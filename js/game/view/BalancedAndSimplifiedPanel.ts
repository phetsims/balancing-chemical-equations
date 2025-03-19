// Copyright 2025, University of Colorado Boulder

/**
 * BalancedAndSimplifiedPanel presents feedback when the answer to a challenge is balanced and simplified.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import FaceNode from '../../../../scenery-phet/js/FaceNode.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VStrut from '../../../../scenery/js/nodes/VStrut.js';
import checkSolidShape from '../../../../sherpa/js/fontawesome-5/checkSolidShape.js';
import TextPushButton from '../../../../sun/js/buttons/TextPushButton.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import BalancingChemicalEquationsStrings from '../../BalancingChemicalEquationsStrings.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import GameFeedbackPanel from './GameFeedbackPanel.js';

const MAX_WIDTH = 385; // maxWidth for UI elements
const POINTS_AWARDED_FONT = new PhetFont( {
  size: 24,
  weight: 'bold'
} );

export default class BalancedAndSimplifiedPanel extends GameFeedbackPanel {

  public constructor( pointsProperty: TReadOnlyProperty<number>, nextButtonListener: () => void, tandem: Tandem ) {

    const textOptions = {
      font: GameFeedbackPanel.TEXT_FONT,
      maxWidth: MAX_WIDTH
    };

    const faceNode = new FaceNode( 75 );

    const greenCheckMark = new Path( checkSolidShape, {
      scale: 0.08,
      fill: 'rgb( 0, 180, 0 )'
    } );

    const balancedText = new Text( BalancingChemicalEquationsStrings.balancedStringProperty, textOptions );

    const pointsStringProperty = new DerivedStringProperty(
      [ BalancingChemicalEquationsStrings.pattern_0pointsStringProperty, pointsProperty ],
      ( pattern, points ) => StringUtils.format( pattern, points )
    );

    const pointsText = new Text( pointsStringProperty, {
      font: POINTS_AWARDED_FONT,
      maxWidth: MAX_WIDTH,
      tandem: tandem.createTandem( 'pointsText' )
    } );

    const nextButton = new TextPushButton( BalancingChemicalEquationsStrings.nextStringProperty, {
      font: GameFeedbackPanel.PUSH_BUTTON_FONT,
      baseColor: GameFeedbackPanel.PUSH_BUTTON_COLOR,
      maxWidth: MAX_WIDTH,
      listener: nextButtonListener,
      tandem: tandem.createTandem( 'nextButton' ),
      phetioVisiblePropertyInstrumented: false
    } );

    const content = new VBox( {
      align: 'center',
      spacing: GameFeedbackPanel.VBOX_SPACING,
      children: [

        // happy face
        faceNode,

        // check mark + 'balanced'
        new HBox( {
          children: [ greenCheckMark, balancedText ],
          spacing: GameFeedbackPanel.HBOX_SPACING
        } ),

        // points awarded
        pointsText,

        // space
        new VStrut( GameFeedbackPanel.ACTION_AREA_Y_SPACING ),

        // Next button
        nextButton
      ]
    } );

    super( content, {
      tandem: tandem,
      phetioDocumentation: 'Provides feedback when the challenge is balanced and simplified.'
    } );
  }
}

balancingChemicalEquations.register( 'BalancedAndSimplifiedPanel', BalancedAndSimplifiedPanel );