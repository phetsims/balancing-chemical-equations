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

import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';
import Disposable from '../../../../axon/js/Disposable.js';
import Property from '../../../../axon/js/Property.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import FaceNode from '../../../../scenery-phet/js/FaceNode.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import AlignGroup from '../../../../scenery/js/layout/constraints/AlignGroup.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VStrut from '../../../../scenery/js/nodes/VStrut.js';
import checkSolidShape from '../../../../sherpa/js/fontawesome-5/checkSolidShape.js';
import timesSolidShape from '../../../../sherpa/js/fontawesome-5/timesSolidShape.js';
import TextPushButton from '../../../../sun/js/buttons/TextPushButton.js';
import Panel from '../../../../sun/js/Panel.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import BalancingChemicalEquationsStrings from '../../BalancingChemicalEquationsStrings.js';
import { BalancedRepresentation } from '../../common/model/BalancedRepresentation.js';
import Equation from '../../common/model/Equation.js';
import BalanceScalesNode from '../../common/view/BalanceScalesNode.js';
import BarChartsNode from '../../common/view/BarChartsNode.js';
import HorizontalAligner from '../../common/view/HorizontalAligner.js';
import GameModel from '../model/GameModel.js';

const TEXT_FONT = new PhetFont( 18 );
const POINTS_AWARDED_FONT = new PhetFont( {
  size: 24,
  weight: 'bold'
} );
const STATE_BUTTON_FONT = new PhetFont( 20 );
const STATE_BUTTON_FILL = 'yellow';
const SHOW_WHY_BUTTON_FONT = new PhetFont( 16 );
const SHOW_WHY_BUTTON_FILL = '#d9d9d9';
const ACTION_AREA_Y_SPACING = 8; // vertical space that separates the 'action area' (buttons) from stuff above it
const HBOX_SPACING = 5;
const VBOX_SPACING = 7;
const SHADOW_X_OFFSET = 5;
const SHADOW_Y_OFFSET = 5;
const CORNER_RADIUS = 0;

export default class GameFeedbackPanel extends Node {

  private readonly disposeGameFeedbackPanel: () => void;

  public constructor( model: GameModel, aligner: HorizontalAligner ) {

    const equation = model.currentEquationProperty.value;

    // maxWidth for UI elements
    const maxWidth = 0.5 * aligner.getScreenWidth();

    const textOptions = {
      font: TEXT_FONT,
      maxWidth: maxWidth
    };

    // Subcomponents that need to be disposed.
    const disposables: Disposable[] = [];

    // happy/sad face
    const faceNode = new FaceNode( 75 );
    if ( !equation.isBalancedProperty.value ) { faceNode.frown(); }

    // To make icons have the same effective size.
    const iconAlignGroup = new AlignGroup();

    let content: Node;
    if ( equation.isBalancedAndSimplified ) {

      const balancedText = new Text( BalancingChemicalEquationsStrings.balancedStringProperty, textOptions );
      disposables.push( balancedText );

      const pointsAwardedStringProperty = new DerivedStringProperty(
        [ BalancingChemicalEquationsStrings.pattern_0pointsStringProperty ],
        pattern => StringUtils.format( pattern, model.currentPoints )
      );
      disposables.push( pointsAwardedStringProperty );

      const pointsAwardedText = new Text( pointsAwardedStringProperty, {
        font: POINTS_AWARDED_FONT,
        maxWidth: maxWidth
      } );
      disposables.push( pointsAwardedText );

      const nextButton = new TextPushButton( BalancingChemicalEquationsStrings.nextStringProperty, {
        font: STATE_BUTTON_FONT,
        baseColor: STATE_BUTTON_FILL,
        maxWidth: maxWidth,
        listener: () => model.next()
      } );
      disposables.push( nextButton );

      // balanced and simplified
      content = new VBox( {
        align: 'center',
        spacing: VBOX_SPACING,
        children: [

          // happy face
          faceNode,

          // check mark + 'balanced'
          new HBox( {
            children: [ createCorrectIcon( iconAlignGroup ), balancedText ],
            spacing: HBOX_SPACING
          } ),

          // points awarded
          pointsAwardedText,

          // space
          new VStrut( ACTION_AREA_Y_SPACING ),

          // Next button
          nextButton
        ]
      } );
    }
    else if ( equation.isBalancedProperty.value ) {

      const balancedText = new Text( BalancingChemicalEquationsStrings.balancedStringProperty, textOptions );
      disposables.push( balancedText );

      const notSimplifiedText = new Text( BalancingChemicalEquationsStrings.notSimplifiedStringProperty, textOptions );
      disposables.push( notSimplifiedText );

      // Try Again or Show Answer button
      const button = ( model.stateProperty.value === 'tryAgain' ) ?
                     createTryAgainButton( model, maxWidth ) :
                     createShowAnswerButton( model, maxWidth );
      disposables.push( button );

      // balanced, not simplified: happy face with 'balance' and 'not simplified' below it
      content = new VBox( {
        align: 'center',
        spacing: VBOX_SPACING,
        children: [

          // happy face
          faceNode,
          new VBox( {
            align: 'left',
            spacing: 3,
            children: [

              // check mark + 'balanced'
              new HBox( {
                children: [ createCorrectIcon( iconAlignGroup ), balancedText ],
                spacing: HBOX_SPACING
              } ),

              // red X + 'not simplified'
              new HBox( {
                children: [ createIncorrectIcon( iconAlignGroup ), notSimplifiedText ],
                spacing: HBOX_SPACING
              } )
            ]
          } ),

          // space
          new VStrut( ACTION_AREA_Y_SPACING ),

          // Try Again or Show Answer button
          button
        ]
      } );
    }
    else {

      // not balanced
      let balancedRepresentationNode: Node | null = null; // create on demand

      // 'Show Why' button, exposes one of the 'balanced' representations to explain why it's not balanced
      const showWhyButton = new TextPushButton( BalancingChemicalEquationsStrings.showWhyStringProperty, {
        listener: () => {
          showWhyButton.visible = false;
          hideWhyButton.visible = true;
          if ( !balancedRepresentationNode ) {
            balancedRepresentationNode = createBalancedRepresentation( equation, model.balancedRepresentation, aligner );
          }
          content.addChild( balancedRepresentationNode );
        },
        font: SHOW_WHY_BUTTON_FONT,
        baseColor: SHOW_WHY_BUTTON_FILL,
        visible: true,
        maxWidth: maxWidth
      } );
      disposables.push( showWhyButton );

      // 'Hide Why' button, hides the 'balanced' representation
      const hideWhyButton = new TextPushButton( BalancingChemicalEquationsStrings.hideWhyStringProperty, {
        listener: () => {
          showWhyButton.visible = true;
          hideWhyButton.visible = false;
          if ( balancedRepresentationNode && content.hasChild( balancedRepresentationNode ) ) {
            content.removeChild( balancedRepresentationNode );
          }
        },
        font: SHOW_WHY_BUTTON_FONT,
        baseColor: SHOW_WHY_BUTTON_FILL,
        visible: !showWhyButton.visible,
        maxWidth: maxWidth
      } );
      disposables.push( hideWhyButton );

      const notBalancedText = new Text( BalancingChemicalEquationsStrings.notBalancedStringProperty, textOptions );
      disposables.push( notBalancedText );

      // Try Again or Show Answer button
      const button = ( model.stateProperty.value === 'tryAgain' ) ?
                     createTryAgainButton( model, maxWidth ) :
                     createShowAnswerButton( model, maxWidth );
      disposables.push( button );

      content = new VBox( {
        align: 'center',
        spacing: VBOX_SPACING,
        children: [

          // sad face
          faceNode,

          // red X + 'not balanced'
          new HBox( {
            children: [ createIncorrectIcon( iconAlignGroup ), notBalancedText ],
            spacing: HBOX_SPACING
          } ),

          // space
          new VStrut( ACTION_AREA_Y_SPACING ),

          // Try Again or Show Answer button
          button,

          // Show/Hide Why buttons, one of which will be visible at a time.
          // Wrap these in an HBox (not a Node!) so that dynamic layout will work properly.
          // See https://github.com/phetsims/balancing-chemical-equations/issues/164
          new HBox( {
            children: [ showWhyButton, hideWhyButton ]
          } )
        ]
      } );
    }

    // panel, which will resize dynamically
    const panel = new Panel( content, {
      fill: '#c1d8fe',
      xMargin: 40,
      yMargin: 10,
      cornerRadius: CORNER_RADIUS
    } );

    // shadow
    const shadowNode = new Rectangle( 0, 0, 1, 1, {
      fill: 'rgba( 80, 80, 80, 0.12 )',
      cornerRadius: CORNER_RADIUS
    } );
    const updateShadow = () => {
      shadowNode.setRect( panel.left + SHADOW_X_OFFSET, panel.top + SHADOW_Y_OFFSET, panel.width, panel.height );
    };
    content.boundsProperty.lazyLink( updateShadow ); // resize shadow when panel changes size
    updateShadow();

    super( {
      children: [ shadowNode, panel ]
    } );

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
function createCorrectIcon( iconAlignGroup: AlignGroup ): Node {
  const icon = new Path( checkSolidShape, {
    scale: 0.08,
    fill: 'rgb( 0, 180, 0 )'
  } );
  return iconAlignGroup.createBox( icon );
}

/**
 * Creates the icon for an incorrect answer, a red 'X'.
 */
function createIncorrectIcon( iconAlignGroup: AlignGroup ): Node {
  const icon = new Path( timesSolidShape, {
    scale: 0.08,
    fill: 'rgb( 252, 104, 0 )'
  } );
  return iconAlignGroup.createBox( icon );
}

/**
 * Creates the 'Try Again' button.
 */
function createTryAgainButton( model: GameModel, maxWidth: number ): TextPushButton {
  return new TextPushButton( BalancingChemicalEquationsStrings.tryAgainStringProperty, {
    font: STATE_BUTTON_FONT,
    baseColor: STATE_BUTTON_FILL,
    maxWidth: maxWidth,
    listener: () => model.tryAgain()
  } );
}

/**
 * Creates the 'Show Answer' button.
 */
function createShowAnswerButton( model: GameModel, maxWidth: number ): TextPushButton {
  return new TextPushButton( BalancingChemicalEquationsStrings.showAnswerStringProperty, {
    font: STATE_BUTTON_FONT,
    baseColor: STATE_BUTTON_FILL,
    maxWidth: maxWidth,
    listener: () => model.showAnswer()
  } );
}

/**
 * Creates the representation of 'balanced' that becomes visible when the 'Show Why' button is pressed.
 */
function createBalancedRepresentation( equation: Equation,
                                       balancedRepresentation: BalancedRepresentation,
                                       aligner: HorizontalAligner ): Node {
  let balancedRepresentationNode;
  if ( balancedRepresentation === 'balanceScales' ) {
    balancedRepresentationNode = new BalanceScalesNode( new Property( equation ), aligner );
  }
  else if ( balancedRepresentation === 'barCharts' ) {
    balancedRepresentationNode = new BarChartsNode( new Property( equation ), aligner );
  }
  else {
    throw new Error( `unsupported balancedRepresentation: ${balancedRepresentation}` );
  }

  // Shrink size so that it doesn't cover so much of the screen.
  // See https://github.com/phetsims/balancing-chemical-equations/issues/29.
  balancedRepresentationNode.setScaleMagnitude( 0.65 );
  return balancedRepresentationNode;
}

balancingChemicalEquations.register( 'GameFeedbackPanel', GameFeedbackPanel );