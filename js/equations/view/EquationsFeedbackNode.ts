// Copyright 2025, University of Colorado Boulder

/**
 * EquationsFeedbackNode provides feedback on whether the equation is balanced on the 'Intro' and 'Equations' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import Equation from '../../common/model/Equation.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import checkSolidShape from '../../../../sherpa/js/fontawesome-5/checkSolidShape.js';
import FaceNode from '../../../../scenery-phet/js/FaceNode.js';
import AlignGroup from '../../../../scenery/js/layout/constraints/AlignGroup.js';
import timesSolidShape from '../../../../sherpa/js/fontawesome-5/timesSolidShape.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import BalancingChemicalEquationsStrings from '../../BalancingChemicalEquationsStrings.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import PhetColorScheme from '../../../../scenery-phet/js/PhetColorScheme.js';
import BCEColors from '../../common/BCEColors.js';
import BCEConstants from '../../common/BCEConstants.js';

const TEXT_OPTIONS = {
  font: new PhetFont( 18 ),
  maxWidth: 120
};
const X_SPACING = 5;
const ICON_SCALE = 0.05;

export default class EquationsFeedbackNode extends HBox {

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

    // Green check mark to the left of 'simplified'.
    const simplifiedHBox = new HBox( {
      children: [
        iconAlignGroup.createBox( new Path( checkSolidShape, {
          scale: ICON_SCALE,
          fill: BCEColors.CHECK_MARK_FILL
        } ) ),
        new Text( BalancingChemicalEquationsStrings.simplifiedStringProperty, TEXT_OPTIONS )
      ],
      spacing: X_SPACING
    } );

    // Red 'X' to the left of 'not simplified'.
    const notSimplifiedHBox = new HBox( {
      children: [
        iconAlignGroup.createBox( new Path( timesSolidShape, {
          scale: ICON_SCALE,
          fill: PhetColorScheme.RED_COLORBLIND
        } ) ),
        new Text( BalancingChemicalEquationsStrings.notSimplifiedStringProperty, TEXT_OPTIONS )
      ],
      spacing: X_SPACING
    } );

    const vBox = new VBox( {
      align: 'left',
      spacing: 8,
      children: [ balancedHBox, simplifiedHBox, notSimplifiedHBox ]
    } );

    super( {
      spacing: 8,
      children: [ faceNode, vBox ]
    } );

    // Listener for isBalancedProperty.
    const isBalancedListener = ( isBalanced: boolean ) => {
      this.visible = isBalanced;

      // Not strictly necessary to set these since this Node will not be visible, but for future-proofing...
      balancedHBox.visible = isBalanced;
      isBalanced ? faceNode.smile() : faceNode.frown();
    };

    // Listener for isSimplifiedProperty.
    const isSimplifiedListener = ( isSimplified: boolean ) => {
      simplifiedHBox.visible = isSimplified;
      notSimplifiedHBox.visible = !isSimplified;
    };

    equationProperty.link( ( newEquation, oldEquation ) => {

      oldEquation && oldEquation.isBalancedProperty.unlink( isBalancedListener );
      newEquation.isBalancedProperty.link( isBalancedListener );

      oldEquation && oldEquation.isSimplifiedProperty.unlink( isSimplifiedListener );
      newEquation.isSimplifiedProperty.link( isSimplifiedListener );
    } );
  }
}

balancingChemicalEquations.register( 'EquationsFeedbackNode', EquationsFeedbackNode );