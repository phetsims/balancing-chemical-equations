// Copyright 2024-2025, University of Colorado Boulder

/**
 * EquationRadioButtonGroup is the radio button group for selecting an equation in the 'Intro' screen.
 *
 * @author Vasily Shakhov (MLearner)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import { AquaRadioButtonGroupItem } from '../../../../sun/js/AquaRadioButtonGroup.js';
import HorizontalAquaRadioButtonGroup, { HorizontalAquaRadioButtonGroupOptions } from '../../../../sun/js/HorizontalAquaRadioButtonGroup.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import Equation from '../../common/model/Equation.js';
import { EquationChoice } from '../model/IntroModel.js';

const TEXT_OPTIONS = {
  font: new PhetFont( 16 ),
  fill: 'white'
};

type SelfOptions = EmptySelfOptions;

type EquationRadioButtonGroupOptions = SelfOptions & PickRequired<HorizontalAquaRadioButtonGroupOptions, 'tandem' | 'maxWidth'>;

export default class EquationRadioButtonGroup extends HorizontalAquaRadioButtonGroup<Equation> {

  public constructor( equationProperty: Property<Equation>, choices: EquationChoice[], providedOptions: EquationRadioButtonGroupOptions ) {

    // radio button descriptions, one button for each equation
    const radioButtonItems: AquaRadioButtonGroupItem<Equation>[] = choices.map( choice => {
      return {
        value: choice.equation,
        tandemName: `${choice.tandemNamePrefix}RadioButton`,
        createNode: () => new Text( choice.labelStringProperty, TEXT_OPTIONS )
      };
    } );

    const options = optionize<EquationRadioButtonGroupOptions, SelfOptions, HorizontalAquaRadioButtonGroupOptions>()( {

      // NodeOptions
      isDisposable: false,
      radioButtonOptions: { radius: 8 },
      touchAreaYDilation: 15,
      spacing: 30
    }, providedOptions );

    super( equationProperty, radioButtonItems, options );
  }
}

balancingChemicalEquations.register( 'EquationRadioButtonGroup', EquationRadioButtonGroup );