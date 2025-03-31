// Copyright 2025, University of Colorado Boulder

/**
 * EquationsFeedbackNode provides feedback on whether the equation is balanced on the 'Equations' screen.
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

const TEXT_OPTIONS = {
  font: new PhetFont( 18 ),
  maxWidth: 120
};
const X_SPACING = 5;
const ICON_SCALE = 0.05;

export default class EquationsFeedbackNode extends HBox {

  public constructor( equationProperty: TReadOnlyProperty<Equation> ) {

    const faceNode = new FaceNode( 70 );

    // To make icons have the same effective size.
    const iconAlignGroup = new AlignGroup();

    const greenCheckMark1 = iconAlignGroup.createBox( new Path( checkSolidShape, {
      scale: ICON_SCALE,
      fill: BCEColors.CHECK_MARK_FILL
    } ) );

    const greenCheckMark2 = iconAlignGroup.createBox( new Path( checkSolidShape, {
      scale: ICON_SCALE,
      fill: BCEColors.CHECK_MARK_FILL
    } ) );

    const redX = iconAlignGroup.createBox( new Path( timesSolidShape, {
      scale: ICON_SCALE,
      fill: PhetColorScheme.RED_COLORBLIND
    } ) );

    const balancedText = new Text( BalancingChemicalEquationsStrings.balancedStringProperty, TEXT_OPTIONS );
    const balancedHBox = new HBox( {
      children: [ greenCheckMark1, balancedText ],
      spacing: X_SPACING
    } );

    const simplifiedText = new Text( BalancingChemicalEquationsStrings.simplifiedStringProperty, TEXT_OPTIONS );
    const simplifiedHBox = new HBox( {
      children: [ greenCheckMark2, simplifiedText ],
      spacing: X_SPACING
    } );

    const notSimplifiedText = new Text( BalancingChemicalEquationsStrings.notSimplifiedStringProperty, TEXT_OPTIONS );
    const notSimplifiedHBox = new HBox( {
      children: [ redX, notSimplifiedText ],
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

    const isBalancedListener = ( isBalanced: boolean ) => {
      this.visible = isBalanced;
    };

    const isBalancedAndSimplifiedListener = ( isBalancedAndSimplified: boolean ) => {
      simplifiedHBox.visible = isBalancedAndSimplified;
      notSimplifiedHBox.visible = !isBalancedAndSimplified;
    };

    equationProperty.link( ( newEquation, oldEquation ) => {

      oldEquation && oldEquation.isBalancedProperty.unlink( isBalancedListener );
      newEquation.isBalancedProperty.link( isBalancedListener );

      oldEquation && oldEquation.isBalancedAndSimplifiedProperty.unlink( isBalancedAndSimplifiedListener );
      newEquation.isBalancedAndSimplifiedProperty.link( isBalancedAndSimplifiedListener );
    } );
  }
}

balancingChemicalEquations.register( 'EquationsFeedbackNode', EquationsFeedbackNode );