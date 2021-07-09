// Copyright 2014-2021, University of Colorado Boulder

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
import merge from '../../../../phet-core/js/merge.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import FaceNode from '../../../../scenery-phet/js/FaceNode.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import VStrut from '../../../../scenery/js/nodes/VStrut.js';
import checkSolidShape from '../../../../sherpa/js/fontawesome-5/checkSolidShape.js';
import timesSolidShape from '../../../../sherpa/js/fontawesome-5/timesSolidShape.js';
import TextPushButton from '../../../../sun/js/buttons/TextPushButton.js';
import Panel from '../../../../sun/js/Panel.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import balancingChemicalEquationsStrings from '../../balancingChemicalEquationsStrings.js';
import BalancedRepresentation from '../../common/model/BalancedRepresentation.js';
import BalanceScalesNode from '../../common/view/BalanceScalesNode.js';
import BarChartsNode from '../../common/view/BarChartsNode.js';

// constants
const TEXT_FONT = new PhetFont( 18 );
const STATE_BUTTON_FONT = new PhetFont( 20 );
const STATE_BUTTON_FILL = 'yellow';
const WHY_BUTTON_FONT = new PhetFont( 16 );
const WHY_BUTTON_FILL = '#d9d9d9';
const ACTION_AREA_Y_SPACING = 8; // vertical space that separates the 'action area' (buttons) from stuff above it

class GameFeedbackPanel extends Node {

  /**
   * @param {GameModel} model
   * @param {HorizontalAligner} aligner
   * @param {Object} [options]
   */
  constructor( model, aligner, options ) {

    options = merge( {
      fill: '#c1d8fe',
      xMargin: 40,
      yMargin: 10,
      cornerRadius: 0,
      hBoxSpacing: 5,
      vBoxSpacing: 7,
      shadowXOffset: 5,
      shadowYOffset: 5
    }, options );

    const equation = model.currentEquationProperty.get();
    const balancedRepresentation = model.balancedRepresentation;
    const points = model.currentPoints;
    const maxWidth = 0.75 * aligner.getScreenWidth(); // max width of UI elements
    const textOptions = { font: TEXT_FONT, maxWidth: maxWidth };

    // happy/sad face
    const faceNode = new FaceNode( 75 );
    if ( !equation.balancedProperty.get() ) { faceNode.frown(); }

    let content;
    if ( equation.balancedAndSimplified ) {

      // balanced and simplified
      content = new VBox( {
        children: [

          // happy face
          faceNode,

          // check mark + 'balanced'
          new HBox( {
            children: [ createCorrectIcon(), new Text( balancingChemicalEquationsStrings.balanced, textOptions ) ],
            spacing: options.hBoxSpacing
          } ),

          // points awarded
          new Text( StringUtils.format( balancingChemicalEquationsStrings.pattern_0points, points ), {
            font: new PhetFont( {
              size: 24,
              weight: 'bold'
            } ), maxWidth: maxWidth
          } ),

          // space
          new VStrut( ACTION_AREA_Y_SPACING ),

          // Next button
          createStateChangeButton( balancingChemicalEquationsStrings.next, model.next.bind( model ), maxWidth )
        ],
        spacing: options.vBoxSpacing
      } );
    }
    else if ( equation.balancedProperty.get() ) {

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
                children: [ createCorrectIcon(), new Text( balancingChemicalEquationsStrings.balanced, textOptions ) ],
                spacing: options.hBoxSpacing
              } ),

              // red X + 'not simplified'
              new HBox( {
                children: [ createIncorrectIcon(), new Text( balancingChemicalEquationsStrings.notSimplified, textOptions ) ],
                spacing: options.hBoxSpacing
              } )
            ]
          } ),

          // space
          new VStrut( ACTION_AREA_Y_SPACING ),

          // Try Again or Show Answer button
          createButtonForState( model, maxWidth )
        ],
        spacing: options.vBoxSpacing
      } );
    }
    else {

      // not balanced
      let saveCenterX; // saves the panel's centerX when pressing Show/Hide Why.
      let balancedRepresentationNode = null; // create on demand

      // 'Show Why' button, exposes one of the 'balanced' representations to explain why it's not balanced
      const showWhyButton = new TextPushButton( balancingChemicalEquationsStrings.showWhy, {
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

      // 'Hide Why' button, hides the 'balanced' representation
      const hideWhyButton = new TextPushButton( balancingChemicalEquationsStrings.hideWhy, {
        listener: () => {
          showWhyButton.visible = true;
          hideWhyButton.visible = false;
          saveCenterX = this.centerX;
          content.removeChild( balancedRepresentationNode );
          this.centerX = saveCenterX;
        },
        font: WHY_BUTTON_FONT,
        baseColor: WHY_BUTTON_FILL,
        visible: !showWhyButton.visible,
        center: showWhyButton.center,
        maxWidth: maxWidth
      } );

      content = new VBox( {
        children: [

          // sad face
          faceNode,

          // red X + 'not balanced'
          new HBox( {
            children: [ createIncorrectIcon(), new Text( balancingChemicalEquationsStrings.notBalanced, textOptions ) ],
            spacing: options.hBoxSpacing
          } ),

          // space
          new VStrut( ACTION_AREA_Y_SPACING ),

          // Try Again or Show Answer button
          createButtonForState( model, maxWidth ),

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
  }
}

/**
 * Creates the icon for a correct answer, a green check mark.
 * @returns {Node}
 */
function createCorrectIcon() {
  return new Path( checkSolidShape, {
    scale: 0.08,
    fill: 'rgb( 0, 180, 0 )'
  } );
}

/**
 * Creates the icon for an incorrect answer, a red 'X'.
 * @returns {Node}
 */
function createIncorrectIcon() {
  return new Path( timesSolidShape, {
    scale: 0.08,
    fill: 'rgb( 252, 104, 0 )'
  } );
}

/**
 * Creates a text button that performs a model state change when pressed.
 * @param {string} label
 * @param {function} modelFunction model function that performs the state change
 * @param {number} maxWidth
 * @returns {TextPushButton}
 */
function createStateChangeButton( label, modelFunction, maxWidth ) {
  return new TextPushButton( label, {
    font: STATE_BUTTON_FONT,
    baseColor: STATE_BUTTON_FILL,
    maxWidth: maxWidth,
    listener: () => modelFunction()
  } );
}

/**
 * Creates a button that is appropriate for the current state of the model.
 * @param {GameModel} model
 * @param {number} maxWidth
 * @returns {TextPushButton}
 */
function createButtonForState( model, maxWidth ) {
  let button = null;
  if ( model.stateProperty.get() === model.states.TRY_AGAIN ) {
    button = createStateChangeButton( balancingChemicalEquationsStrings.tryAgain, model.tryAgain.bind( model ), maxWidth );
  }
  else if ( model.stateProperty.get() === model.states.SHOW_ANSWER ) {
    button = createStateChangeButton( balancingChemicalEquationsStrings.showAnswer, model.showAnswer.bind( model ), maxWidth );
  }
  return button;
}

/**
 * Creates the representation of 'balanced' that becomes visible when the 'Show Why' button is pressed.
 * @param {Equation} equation
 * @param {BalancedRepresentation} balancedRepresentation
 * @param {HorizontalAligner} aligner
 * @returns {Node}
 */
function createBalancedRepresentation( equation, balancedRepresentation, aligner ) {
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
export default GameFeedbackPanel;