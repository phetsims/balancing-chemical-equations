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
import ButtonNode from '../../../../sun/js/buttons/ButtonNode.js';
import TextPushButton from '../../../../sun/js/buttons/TextPushButton.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import BalancingChemicalEquationsStrings from '../../BalancingChemicalEquationsStrings.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import GameFeedbackPanel from './GameFeedbackPanel.js';
import BCEColors from '../../common/BCEColors.js';
import AlignGroup from '../../../../scenery/js/layout/constraints/AlignGroup.js';
import BCEConstants from '../../common/BCEConstants.js';

const MAX_TEXT_WIDTH = 385; // maxWidth for Text elements
const X_SPACING = 5;
const POINTS_AWARDED_FONT = new PhetFont( {
  size: 24,
  weight: 'bold'
} );

export default class BalancedAndSimplifiedPanel extends GameFeedbackPanel {
  public nextButton: ButtonNode;

  public constructor( pointsProperty: TReadOnlyProperty<number>, nextButtonListener: () => void, tandem: Tandem ) {

    const textOptions = {
      font: GameFeedbackPanel.TEXT_FONT,
      maxWidth: MAX_TEXT_WIDTH
    };

    // To make icons have the same effective size.
    const iconAlignGroup = new AlignGroup();

    const faceNode = new FaceNode( 75, BCEConstants.FACE_NODE_OPTIONS );

    // Green check mark to the left of 'balanced'.
    const balancedHBox = new HBox( {
      children: [
        iconAlignGroup.createBox( new Path( checkSolidShape, {
          scale: GameFeedbackPanel.ICONS_SCALE,
          fill: BCEColors.CHECK_MARK_FILL,
          stroke: 'black',
          lineWidth: 1 / GameFeedbackPanel.ICONS_SCALE
        } ) ),
        new Text( BalancingChemicalEquationsStrings.balancedStringProperty, textOptions )
      ],
      spacing: X_SPACING
    } );

    // Green check mark to the left of 'simplified'.
    const simplifiedHBox = new HBox( {
      children: [
        iconAlignGroup.createBox( new Path( checkSolidShape, {
          scale: GameFeedbackPanel.ICONS_SCALE,
          fill: BCEColors.CHECK_MARK_FILL,
          stroke: 'black',
          lineWidth: 1 / GameFeedbackPanel.ICONS_SCALE
        } ) ),
        new Text( BalancingChemicalEquationsStrings.simplifiedStringProperty, textOptions )
      ],
      spacing: X_SPACING
    } );

    const pointsStringProperty = new DerivedStringProperty(
      [ BalancingChemicalEquationsStrings.pattern_0pointsStringProperty, pointsProperty ],
      ( pattern, points ) => StringUtils.format( pattern, points )
    );

    const pointsText = new Text( pointsStringProperty, {
      font: POINTS_AWARDED_FONT,
      maxWidth: MAX_TEXT_WIDTH
    } );

    const nextButton = new TextPushButton( BalancingChemicalEquationsStrings.nextStringProperty, {
      font: GameFeedbackPanel.PUSH_BUTTON_FONT,
      baseColor: GameFeedbackPanel.PUSH_BUTTON_COLOR,
      maxTextWidth: MAX_TEXT_WIDTH,
      listener: nextButtonListener,
      tandem: tandem.createTandem( 'nextButton' ),
      phetioVisiblePropertyInstrumented: false,
      phetioEnabledPropertyInstrumented: false // See https://github.com/phetsims/balancing-chemical-equations/issues/197
    } );

    const content = new VBox( {
      align: 'center',
      spacing: GameFeedbackPanel.VBOX_SPACING,
      children: [
        faceNode,
        balancedHBox,
        simplifiedHBox,
        pointsText,
        new VStrut( GameFeedbackPanel.ACTION_AREA_Y_SPACING ),
        nextButton
      ]
    } );

    super( content, {
      tandem: tandem,
      phetioDocumentation: 'Provides feedback when the challenge is balanced and simplified.'
    } );

    this.nextButton = nextButton;
  }
}

balancingChemicalEquations.register( 'BalancedAndSimplifiedPanel', BalancedAndSimplifiedPanel );