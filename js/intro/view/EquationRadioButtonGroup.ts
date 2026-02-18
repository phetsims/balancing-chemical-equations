// Copyright 2024-2025, University of Colorado Boulder

/**
 * EquationRadioButtonGroup is the radio button group for selecting an equation in the 'Intro' screen.
 *
 * @author Vasily Shakhov (MLearner)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import { AquaRadioButtonGroupItem } from '../../../../sun/js/AquaRadioButtonGroup.js';
import HorizontalAquaRadioButtonGroup from '../../../../sun/js/HorizontalAquaRadioButtonGroup.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import BalancingChemicalEquationsStrings from '../../BalancingChemicalEquationsStrings.js';
import Equation from '../../common/model/Equation.js';
import { EquationChoice } from '../model/IntroModel.js';

const TEXT_OPTIONS = {
  font: new PhetFont( 16 ),
  fill: 'white',
  maxWidth: 150
};

export default class EquationRadioButtonGroup extends HorizontalAquaRadioButtonGroup<Equation> {

  public constructor( equationProperty: Property<Equation>, choices: EquationChoice[], tandem: Tandem ) {

    // radio button descriptions, one button for each equation
    const radioButtonItems: AquaRadioButtonGroupItem<Equation>[] = choices.map( choice => {
      return {
        value: choice.equation,
        tandemName: `${choice.tandemNamePrefix}RadioButton`,
        createNode: () => new Text( choice.labelStringProperty, TEXT_OPTIONS )
      };
    } );

    super( equationProperty, radioButtonItems, {
      isDisposable: false,
      radioButtonOptions: { radius: 8 },
      touchAreaYDilation: 15,
      spacing: 30,
      accessibleName: BalancingChemicalEquationsStrings.a11y.equationStringProperty,
      tandem: tandem
    } );
  }
}

balancingChemicalEquations.register( 'EquationRadioButtonGroup', EquationRadioButtonGroup );