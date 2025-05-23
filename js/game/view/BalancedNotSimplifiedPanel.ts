// Copyright 2025, University of Colorado Boulder

/**
 * BalancedNotSimplifiedPanel presents feedback when the answer to a challenge is balanced, but not simplified.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import FaceNode from '../../../../scenery-phet/js/FaceNode.js';
import AlignGroup from '../../../../scenery/js/layout/constraints/AlignGroup.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VStrut from '../../../../scenery/js/nodes/VStrut.js';
import checkSolidShape from '../../../../sherpa/js/fontawesome-5/checkSolidShape.js';
import timesSolidShape from '../../../../sherpa/js/fontawesome-5/timesSolidShape.js';
import TextPushButton from '../../../../sun/js/buttons/TextPushButton.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import BalancingChemicalEquationsStrings from '../../BalancingChemicalEquationsStrings.js';
import { GameState } from '../model/GameState.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import GameFeedbackPanel from './GameFeedbackPanel.js';
import PhetColorScheme from '../../../../scenery-phet/js/PhetColorScheme.js';
import BCEColors from '../../common/BCEColors.js';
import BCEConstants from '../../common/BCEConstants.js';

const MAX_TEXT_WIDTH = 385; // maxWidth for Text elements

export default class BalancedNotSimplifiedPanel extends GameFeedbackPanel {

  public constructor( gameStateProperty: TReadOnlyProperty<GameState>,
                      tryAgainButtonCallback: () => void,
                      showAnswerButtonCallback: () => void,
                      tandem: Tandem ) {

    const textOptions = {
      font: GameFeedbackPanel.TEXT_FONT,
      maxWidth: MAX_TEXT_WIDTH
    };

    const faceNode = new FaceNode( 75, BCEConstants.FACE_NODE_OPTIONS );

    // To make icons have the same effective size.
    const iconAlignGroup = new AlignGroup();

    const greenCheckMark = iconAlignGroup.createBox( new Path( checkSolidShape, {
      scale: GameFeedbackPanel.ICONS_SCALE,
      fill: BCEColors.CHECK_MARK_FILL,
      stroke: 'black',
      lineWidth: 1 / GameFeedbackPanel.ICONS_SCALE
    } ) );

    const redX = iconAlignGroup.createBox( new Path( timesSolidShape, {
      scale: GameFeedbackPanel.ICONS_SCALE,
      fill: PhetColorScheme.RED_COLORBLIND,
      stroke: 'black',
      lineWidth: 1 / GameFeedbackPanel.ICONS_SCALE
    } ) );

    const balancedText = new Text( BalancingChemicalEquationsStrings.balancedStringProperty, textOptions );

    const notSimplifiedText = new Text( BalancingChemicalEquationsStrings.notSimplifiedStringProperty, textOptions );

    const tryAgainButton = new TextPushButton( BalancingChemicalEquationsStrings.tryAgainStringProperty, {
      font: GameFeedbackPanel.PUSH_BUTTON_FONT,
      baseColor: GameFeedbackPanel.PUSH_BUTTON_COLOR,
      maxTextWidth: MAX_TEXT_WIDTH,
      listener: tryAgainButtonCallback,
      visibleProperty: new DerivedProperty( [ gameStateProperty ], gameState => gameState === 'tryAgain' ),
      tandem: tandem.createTandem( 'tryAgainButton' ),
      phetioEnabledPropertyInstrumented: false // See https://github.com/phetsims/balancing-chemical-equations/issues/197
    } );

    const showAnswerButton = new TextPushButton( BalancingChemicalEquationsStrings.showAnswerStringProperty, {
      font: GameFeedbackPanel.PUSH_BUTTON_FONT,
      baseColor: GameFeedbackPanel.PUSH_BUTTON_COLOR,
      maxTextWidth: MAX_TEXT_WIDTH,
      listener: showAnswerButtonCallback,
      visibleProperty: new DerivedProperty( [ gameStateProperty ], gameState => gameState === 'showAnswer' ),
      tandem: tandem.createTandem( 'showAnswerButton' ),
      phetioEnabledPropertyInstrumented: false // See https://github.com/phetsims/balancing-chemical-equations/issues/197
    } );

    // balanced, not simplified: happy face with 'balance' and 'not simplified' below it
    const content = new VBox( {
      align: 'center',
      spacing: GameFeedbackPanel.VBOX_SPACING,
      children: [
        faceNode,
        new VBox( {
          align: 'left',
          spacing: 3,
          children: [

            // check mark + 'balanced'
            new HBox( {
              children: [ greenCheckMark, balancedText ],
              spacing: GameFeedbackPanel.HBOX_SPACING
            } ),

            // red X + 'not simplified'
            new HBox( {
              children: [ redX, notSimplifiedText ],
              spacing: GameFeedbackPanel.HBOX_SPACING
            } )
          ]
        } ),

        // space
        new VStrut( GameFeedbackPanel.ACTION_AREA_Y_SPACING ),

        // Try Again / Show Answer buttons, one of which will be visible at a time.
        // Wrap these in an HBox (not a Node!) so that dynamic layout will work properly.
        new HBox( {
          children: [ tryAgainButton, showAnswerButton ]
        } )
      ]
    } );

    super( content, {
      tandem: tandem,
      phetioDocumentation: 'Provides feedback when the challenge is balanced, but not simplified.'
    } );
  }
}

balancingChemicalEquations.register( 'BalancedNotSimplifiedPanel', BalancedNotSimplifiedPanel );