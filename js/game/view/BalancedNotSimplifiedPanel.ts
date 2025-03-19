// Copyright 2025, University of Colorado Boulder

/**
 * BalancedNotSimplifiedPanel presents feedback to the user when their answer to a challenge is balanced,
 * but not simplified.
 *
 * NOTE: While the UX here is similar to a Dialog, there are significant differences that make using Dialog impractical
 * and/or undesirable here. See https://github.com/phetsims/balancing-chemical-equations/issues/137 for details.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

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
import Tandem from '../../../../tandem/js/Tandem.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import BalancingChemicalEquationsStrings from '../../BalancingChemicalEquationsStrings.js';
import HorizontalAligner from '../../common/view/HorizontalAligner.js';
import { GameState } from '../model/GameState.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';

const TEXT_FONT = new PhetFont( 18 );
const PUSH_BUTTON_FONT = new PhetFont( 20 );
const PUSH_BUTTON_FILL = 'yellow';
const ACTION_AREA_Y_SPACING = 8; // vertical space that separates the 'action area' (buttons) from stuff above it
const HBOX_SPACING = 5;
const VBOX_SPACING = 7;
const SHADOW_X_OFFSET = 5;
const SHADOW_Y_OFFSET = 5;
const CORNER_RADIUS = 0;

export default class BalancedNotSimplifiedPanel extends Node {

  public constructor( gameStateProperty: TReadOnlyProperty<GameState>,
                      tryAgainButtonCallback: () => void,
                      showAnswerButtonCallback: () => void,
                      aligner: HorizontalAligner,
                      tandem: Tandem ) {

    // maxWidth for UI elements
    const maxWidth = 0.5 * aligner.getScreenWidth();
    console.log( `maxWidth=${maxWidth}` );

    const textOptions = {
      font: TEXT_FONT,
      maxWidth: maxWidth
    };

    const faceNode = new FaceNode( 75 );

    // To make icons have the same effective size.
    const iconAlignGroup = new AlignGroup();

    const greenCheckMark = iconAlignGroup.createBox( new Path( checkSolidShape, {
      scale: 0.08,
      fill: 'rgb( 0, 180, 0 )'
    } ) );

    const redX = iconAlignGroup.createBox( new Path( timesSolidShape, {
      scale: 0.08,
      fill: 'rgb( 252, 104, 0 )'
    } ) );

    const balancedText = new Text( BalancingChemicalEquationsStrings.balancedStringProperty, textOptions );

    const notSimplifiedText = new Text( BalancingChemicalEquationsStrings.notSimplifiedStringProperty, textOptions );

    const tryAgainButton = new TextPushButton( BalancingChemicalEquationsStrings.tryAgainStringProperty, {
      font: PUSH_BUTTON_FONT,
      baseColor: PUSH_BUTTON_FILL,
      maxWidth: maxWidth,
      listener: tryAgainButtonCallback,
      visibleProperty: new DerivedProperty( [ gameStateProperty ], gameState => gameState === 'tryAgain' ),
      tandem: tandem.createTandem( 'tryAgainButton' )
    } );

    const showAnswerButton = new TextPushButton( BalancingChemicalEquationsStrings.showAnswerStringProperty, {
      font: PUSH_BUTTON_FONT,
      baseColor: PUSH_BUTTON_FILL,
      maxWidth: maxWidth,
      listener: showAnswerButtonCallback,
      visibleProperty: new DerivedProperty( [ gameStateProperty ], gameState => gameState === 'showAnswer' ),
      tandem: tandem.createTandem( 'showAnswerButton' )
    } );

    // balanced, not simplified: happy face with 'balance' and 'not simplified' below it
    const content = new VBox( {
      align: 'center',
      spacing: VBOX_SPACING,
      children: [
        faceNode,
        new VBox( {
          align: 'left',
          spacing: 3,
          children: [

            // check mark + 'balanced'
            new HBox( {
              children: [ greenCheckMark, balancedText ],
              spacing: HBOX_SPACING
            } ),

            // red X + 'not simplified'
            new HBox( {
              children: [ redX, notSimplifiedText ],
              spacing: HBOX_SPACING
            } )
          ]
        } ),

        // space
        new VStrut( ACTION_AREA_Y_SPACING ),

        // Try Again / Show Answer buttons, one of which will be visible at a time.
        // Wrap these in an HBox (not a Node!) so that dynamic layout will work properly.
        new HBox( {
          children: [ tryAgainButton, showAnswerButton ]
        } )
      ]
    } );

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
      isDisposable: false,
      children: [ shadowNode, panel ],
      tandem: tandem,
      phetioDocumentation: 'Provides feedback when the challenge is balanced, but not simplified.',
      phetioVisiblePropertyInstrumented: false
    } );
  }
}

balancingChemicalEquations.register( 'BalancedNotSimplifiedPanel', BalancedNotSimplifiedPanel );