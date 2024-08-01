// Copyright 2014-2024, University of Colorado Boulder

/**
 * GameFeedbackPanel presents feedback about a user's guess. The format of the feedback is specific to whether
 * the equation is balanced and simplified, balanced but not simplified, or unbalanced.
 *
 * NOTE: While the UX here is similar to a Dialog, there are significant differences that make using Dialog impractical
 * here. See https://github.com/phetsims/balancing-chemical-equations/issues/137 for details.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import FaceNode from '../../../../scenery-phet/js/FaceNode.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { HBox, Node, NodeOptions, Path, Rectangle, TColor, Text, VBox, VStrut } from '../../../../scenery/js/imports.js';
import checkSolidShape from '../../../../sherpa/js/fontawesome-5/checkSolidShape.js';
import timesSolidShape from '../../../../sherpa/js/fontawesome-5/timesSolidShape.js';
import TextPushButton from '../../../../sun/js/buttons/TextPushButton.js';
import Panel from '../../../../sun/js/Panel.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import BalancingChemicalEquationsStrings from '../../BalancingChemicalEquationsStrings.js';
import BalancedRepresentation from '../../common/model/BalancedRepresentation.js';
import BalanceScalesNode from '../../common/view/BalanceScalesNode.js';
import BarChartsNode from '../../common/view/BarChartsNode.js';
import GameState from '../model/GameState.js';
import HorizontalAligner from '../../common/view/HorizontalAligner.js';
import GameModel from '../model/GameModel.js';
import optionize from '../../../../phet-core/js/optionize.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Equation from '../../common/model/Equation.js';
import Disposable from '../../../../axon/js/Disposable.js';
import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';

// constants
const TEXT_FONT = new PhetFont( 18 );
const STATE_BUTTON_FONT = new PhetFont( 20 );
const STATE_BUTTON_FILL = 'yellow';
const WHY_BUTTON_FONT = new PhetFont( 16 );
const WHY_BUTTON_FILL = '#d9d9d9';
const ACTION_AREA_Y_SPACING = 8; // vertical space that separates the 'action area' (buttons) from stuff above it

type SelfOptions = {
  fill?: TColor;
  xMargin?: number;
  yMargin?: number;
  cornerRadius?: number;
  hBoxSpacing?: number;
  vBoxSpacing?: number;
  shadowXOffset?: number;
  shadowYOffset?: number;
};

type GameFeedbackPanelOptions = SelfOptions;

export default class GameFeedbackPanel extends Node {

  private readonly disposeGameFeedbackPanel: () => void;

  public constructor( model: GameModel, aligner: HorizontalAligner, providedOptions?: GameFeedbackPanelOptions ) {

    const options = optionize<GameFeedbackPanelOptions, SelfOptions, NodeOptions>()( {

      // SelfOptions
      fill: '#c1d8fe',
      xMargin: 40,
      yMargin: 10,
      cornerRadius: 0,
      hBoxSpacing: 5,
      vBoxSpacing: 7,
      shadowXOffset: 5,
      shadowYOffset: 5
    }, providedOptions );

    const equation = model.currentEquationProperty.value;
    const balancedRepresentation = model.balancedRepresentation;
    const points = model.currentPoints;
    const maxWidth = 0.5 * aligner.getScreenWidth(); // max width of UI elements
    const textOptions = { font: TEXT_FONT, maxWidth: maxWidth };

    // Subcomponents that need to be disposed.
    const disposables: Disposable[] = [];

    // happy/sad face
    const faceNode = new FaceNode( 75 );
    if ( !equation.balancedProperty.value ) { faceNode.frown(); }

    const pointsAwardedStringProperty = new DerivedStringProperty(
      [ BalancingChemicalEquationsStrings.pattern_0pointsStringProperty ],
      pattern => StringUtils.format( pattern, points )
    );
    disposables.push( pointsAwardedStringProperty );

    let content: Node;
    if ( equation.balancedAndSimplified ) {

      const balancedText = new Text( BalancingChemicalEquationsStrings.balancedStringProperty, textOptions );
      disposables.push( balancedText );

      const pointsAwardedText = new Text( pointsAwardedStringProperty, {
          font: new PhetFont( {
            size: 24,
            weight: 'bold'
          } ), maxWidth: maxWidth
        } );
      disposables.push( pointsAwardedText );

      const nextButton = createStateChangeButton( BalancingChemicalEquationsStrings.nextStringProperty, model.next.bind( model ), maxWidth );
      disposables.push( nextButton );

      // balanced and simplified
      content = new VBox( {
        children: [

          // happy face
          faceNode,

          // check mark + 'balanced'
          new HBox( {
            children: [ createCorrectIcon(), balancedText ],
            spacing: options.hBoxSpacing
          } ),

          // points awarded
          pointsAwardedText,

          // space
          new VStrut( ACTION_AREA_Y_SPACING ),

          // Next button
          nextButton
        ],
        spacing: options.vBoxSpacing
      } );
    }
    else if ( equation.balancedProperty.value ) {

      const balancedText = new Text( BalancingChemicalEquationsStrings.balancedStringProperty, textOptions );
      disposables.push( balancedText );

      const notSimplifiedText = new Text( BalancingChemicalEquationsStrings.notSimplifiedStringProperty, textOptions );
      disposables.push( notSimplifiedText );

      // Try Again or Show Answer button
      const button = createButtonForState( model, maxWidth );
      disposables.push( button );

      // balanced, not simplified: happy face with 'balance' and 'not simplified' below it
      content = new VBox( {
        children: [

          // happy face
          faceNode,
          new VBox( {
            align: 'left',
            spacing: 3,
            children: [

              // check mark + 'balanced'
              new HBox( {
                children: [ createCorrectIcon(), balancedText ],
                spacing: options.hBoxSpacing
              } ),

              // red X + 'not simplified'
              new HBox( {
                children: [ createIncorrectIcon(), notSimplifiedText ],
                spacing: options.hBoxSpacing
              } )
            ]
          } ),

          // space
          new VStrut( ACTION_AREA_Y_SPACING ),

          // Try Again or Show Answer button
          button
        ],
        spacing: options.vBoxSpacing
      } );
    }
    else {

      // not balanced
      let saveCenterX; // saves the panel's centerX when pressing Show/Hide Why.
      let balancedRepresentationNode: Node | null = null; // create on demand

      // 'Show Why' button, exposes one of the 'balanced' representations to explain why it's not balanced
      const showWhyButton = new TextPushButton( BalancingChemicalEquationsStrings.showWhyStringProperty, {
        listener: () => {
          showWhyButton.visible = false;
          hideWhyButton.visible = true;
          saveCenterX = this.centerX;
          if ( !balancedRepresentationNode ) {
            balancedRepresentationNode = createBalancedRepresentation( equation, balancedRepresentation, aligner );
          }
          content.addChild( balancedRepresentationNode );
          this.centerX = saveCenterX;
        },
        font: WHY_BUTTON_FONT,
        baseColor: WHY_BUTTON_FILL,
        visible: true,
        maxWidth: maxWidth
      } );
      disposables.push( showWhyButton );

      // 'Hide Why' button, hides the 'balanced' representation
      const hideWhyButton = new TextPushButton( BalancingChemicalEquationsStrings.hideWhyStringProperty, {
        listener: () => {
          showWhyButton.visible = true;
          hideWhyButton.visible = false;
          saveCenterX = this.centerX;
          if ( balancedRepresentationNode && content.hasChild( balancedRepresentationNode ) ) {
            content.removeChild( balancedRepresentationNode );
          }
          this.centerX = saveCenterX;
        },
        font: WHY_BUTTON_FONT,
        baseColor: WHY_BUTTON_FILL,
        visible: !showWhyButton.visible,
        center: showWhyButton.center,
        maxWidth: maxWidth
      } );
      disposables.push( hideWhyButton );

      const notBalancedText = new Text( BalancingChemicalEquationsStrings.notBalancedStringProperty, textOptions );
      disposables.push( notBalancedText );

      // Try Again or Show Answer button
      const button = createButtonForState( model, maxWidth );
      disposables.push( button );

      content = new VBox( {
        children: [

          // sad face
          faceNode,

          // red X + 'not balanced'
          new HBox( {
            children: [ createIncorrectIcon(), notBalancedText ],
            spacing: options.hBoxSpacing
          } ),

          // space
          new VStrut( ACTION_AREA_Y_SPACING ),

          // Try Again or Show Answer button
          button,

          // Show/Hide Why buttons
          new Node( { children: [ showWhyButton, hideWhyButton ] } )
        ],
        spacing: options.vBoxSpacing
      } );
    }

    // panel, which will resize dynamically
    const panel = new Panel( content, options );

    // shadow
    const shadowNode = new Rectangle( 0, 0, 1, 1, {
      fill: 'rgba( 80, 80, 80, 0.12 )',
      cornerRadius: options.cornerRadius
    } );
    const updateShadow = () => {
      shadowNode.setRect( panel.left + options.shadowXOffset, panel.top + options.shadowYOffset, panel.width, panel.height );
    };
    content.boundsProperty.lazyLink( updateShadow ); // resize shadow when panel changes size
    updateShadow();

    options.children = [ shadowNode, panel ];
    super( options );

    this.disposeGameFeedbackPanel = () => {
      disposables.forEach( disposable => disposable.dispose() );
    };
  }

  public override dispose(): void {
    this.disposeGameFeedbackPanel();
    super.dispose();
  }
}

/**
 * Creates the icon for a correct answer, a green check mark.
 */
function createCorrectIcon(): Node {
  return new Path( checkSolidShape, {
    scale: 0.08,
    fill: 'rgb( 0, 180, 0 )'
  } );
}

/**
 * Creates the icon for an incorrect answer, a red 'X'.
 */
function createIncorrectIcon(): Node {
  return new Path( timesSolidShape, {
    scale: 0.08,
    fill: 'rgb( 252, 104, 0 )'
  } );
}

/**
 * Creates a text button that performs a model state change when pressed.
 * @param labelStringProperty
 * @param modelFunction - model function that performs the state change
 * @param maxWidth
 */
function createStateChangeButton( labelStringProperty: TReadOnlyProperty<string>,
                                  modelFunction: () => void, maxWidth: number ): TextPushButton {
  return new TextPushButton( labelStringProperty, {
    font: STATE_BUTTON_FONT,
    baseColor: STATE_BUTTON_FILL,
    maxWidth: maxWidth,
    listener: () => modelFunction()
  } );
}

/**
 * Creates a button that is appropriate for the current state of the model.
 */
function createButtonForState( model: GameModel, maxWidth: number ): TextPushButton {
  let button = null;
  const gameState = model.stateProperty.value;
  if ( gameState === GameState.TRY_AGAIN ) {
    button = createStateChangeButton( BalancingChemicalEquationsStrings.tryAgainStringProperty,
      model.tryAgain.bind( model ), maxWidth );
  }
  else if ( gameState === GameState.SHOW_ANSWER ) {
    button = createStateChangeButton( BalancingChemicalEquationsStrings.showAnswerStringProperty,
      model.showAnswer.bind( model ), maxWidth );
  }
  else {
    throw new Error( `unsupported GameState: ${gameState}` );
  }
  return button;
}

/**
 * Creates the representation of 'balanced' that becomes visible when the 'Show Why' button is pressed.
 */
function createBalancedRepresentation( equation: Equation, balancedRepresentation: BalancedRepresentation,
                                       aligner: HorizontalAligner ): Node {
  let balancedRepresentationNode;
  if ( balancedRepresentation === BalancedRepresentation.BALANCE_SCALES ) {
    balancedRepresentationNode = new BalanceScalesNode( new Property( equation ), aligner );
  }
  else if ( balancedRepresentation === BalancedRepresentation.BAR_CHARTS ) {
    balancedRepresentationNode = new BarChartsNode( new Property( equation ), aligner );
  }
  else {
    throw new Error( `unsupported balancedRepresentation: ${balancedRepresentation.name}` );
  }
  balancedRepresentationNode.setScaleMagnitude( 0.65 ); // issue #29, shrink size so that it doesn't cover so much of the screen
  return balancedRepresentationNode;
}

balancingChemicalEquations.register( 'GameFeedbackPanel', GameFeedbackPanel );