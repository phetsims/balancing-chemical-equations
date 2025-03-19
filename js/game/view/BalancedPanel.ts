// Copyright 2025, University of Colorado Boulder

/**
 * BalancedPanel presents feedback to the user when their answer to a challenge is balanced and simplified.
 *
 * NOTE: While the UX here is similar to a Dialog, there are significant differences that make using Dialog impractical
 * and/or undesirable here. See https://github.com/phetsims/balancing-chemical-equations/issues/137 for details.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import FaceNode from '../../../../scenery-phet/js/FaceNode.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VStrut from '../../../../scenery/js/nodes/VStrut.js';
import checkSolidShape from '../../../../sherpa/js/fontawesome-5/checkSolidShape.js';
import TextPushButton from '../../../../sun/js/buttons/TextPushButton.js';
import Panel from '../../../../sun/js/Panel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import BalancingChemicalEquationsStrings from '../../BalancingChemicalEquationsStrings.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';

const TEXT_FONT = new PhetFont( 18 );
const POINTS_AWARDED_FONT = new PhetFont( {
  size: 24,
  weight: 'bold'
} );
const NEXT_BUTTON_FONT = new PhetFont( 20 );
const NEXT_BUTTON_FILL = 'yellow';
const ACTION_AREA_Y_SPACING = 8; // vertical space that separates the 'action area' (buttons) from stuff above it
const HBOX_SPACING = 5;
const VBOX_SPACING = 7;
const SHADOW_X_OFFSET = 5;
const SHADOW_Y_OFFSET = 5;
const CORNER_RADIUS = 0;
const MAX_WIDTH = 385; // maxWidth for UI elements

export default class BalancedPanel extends Node {

  public constructor( pointsProperty: TReadOnlyProperty<number>, nextButtonListener: () => void, tandem: Tandem ) {

    const textOptions = {
      font: TEXT_FONT,
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
      font: NEXT_BUTTON_FONT,
      baseColor: NEXT_BUTTON_FILL,
      maxWidth: MAX_WIDTH,
      listener: nextButtonListener,
      tandem: tandem.createTandem( 'nextButton' ),
      phetioVisiblePropertyInstrumented: false
    } );

    const content = new VBox( {
      align: 'center',
      spacing: VBOX_SPACING,
      children: [

        // happy face
        faceNode,

        // check mark + 'balanced'
        new HBox( {
          children: [ greenCheckMark, balancedText ],
          spacing: HBOX_SPACING
        } ),

        // points awarded
        pointsText,

        // space
        new VStrut( ACTION_AREA_Y_SPACING ),

        // Next button
        nextButton
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
      phetioDocumentation: 'Provides feedback when the challenge is balanced and simplified.',
      phetioVisiblePropertyInstrumented: false
    } );
  }
}

balancingChemicalEquations.register( 'BalancedPanel', BalancedPanel );