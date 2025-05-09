// Copyright 2025, University of Colorado Boulder

/**
 * IntroFeedbackNode provides feedback on whether the equation is balanced on the 'Intro' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import checkSolidShape from '../../../../sherpa/js/fontawesome-5/checkSolidShape.js';
import FaceNode from '../../../../scenery-phet/js/FaceNode.js';
import AlignGroup from '../../../../scenery/js/layout/constraints/AlignGroup.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import BalancingChemicalEquationsStrings from '../../BalancingChemicalEquationsStrings.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Equation from '../../common/model/Equation.js';
import BCEColors from '../../common/BCEColors.js';
import BCEConstants from '../../common/BCEConstants.js';

const TEXT_OPTIONS = {
  font: new PhetFont( 18 ),
  maxWidth: 120
};
const X_SPACING = 5;
const ICON_SCALE = 0.05;

export default class IntroFeedbackNode extends HBox {

  public constructor( equationProperty: TReadOnlyProperty<Equation> ) {

    const faceNode = new FaceNode( 70, BCEConstants.FACE_NODE_OPTIONS );

    // To make icons have the same effective size.
    const iconAlignGroup = new AlignGroup();

    // Green check mark to the left of 'balanced'.
    const balancedHBox = new HBox( {
      children: [
        iconAlignGroup.createBox( new Path( checkSolidShape, {
          scale: ICON_SCALE,
          fill: BCEColors.CHECK_MARK_FILL
        } ) ),
        new Text( BalancingChemicalEquationsStrings.balancedStringProperty, TEXT_OPTIONS )
      ],
      spacing: X_SPACING
    } );

    super( {
      spacing: 8,
      children: [ faceNode, balancedHBox ]
    } );

    // Listener for isBalancedProperty.
    const isBalancedListener = ( isBalanced: boolean ) => {
      this.visible = isBalanced;

      // Not strictly necessary to set these since this Node will not be visible, but for future-proofing...
      balancedHBox.visible = isBalanced;
      isBalanced ? faceNode.smile() : faceNode.frown();
    };

    equationProperty.link( ( newEquation, oldEquation ) => {
      oldEquation && oldEquation.isBalancedProperty.unlink( isBalancedListener );
      newEquation.isBalancedProperty.link( isBalancedListener );
    } );
  }
}

balancingChemicalEquations.register( 'IntroFeedbackNode', IntroFeedbackNode );