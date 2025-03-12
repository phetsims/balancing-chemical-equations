// Copyright 2014-2025, University of Colorado Boulder

/**
 * IntroModel is the top-level model for the 'Intro' screen. This model has a small set of equations, one of which
 * is the current equation that we're operating on.
 *
 * @author Vasily Shakhov (MLearner)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Range from '../../../../dot/js/Range.js';
import TModel from '../../../../joist/js/TModel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import BalancingChemicalEquationsStrings from '../../BalancingChemicalEquationsStrings.js';
import DecompositionEquation from '../../common/model/DecompositionEquation.js';
import DisplacementEquation from '../../common/model/DisplacementEquation.js';
import Equation from '../../common/model/Equation.js';
import SynthesisEquation from '../../common/model/SynthesisEquation.js';

export type EquationChoice = {
  equation: Equation;
  labelStringProperty: TReadOnlyProperty<string>;
  tandemNamePrefix: string;
};

export default class IntroModel implements TModel {

  // Range of possible equation coefficients
  public readonly coefficientsRange: Range;

  // Choice of equations
  public readonly choices: EquationChoice[];

  // the equation that is selected
  public readonly equationProperty: Property<Equation>;

  public constructor( tandem: Tandem ) {

    this.coefficientsRange = new Range( 0, 3 );

    this.choices = [
      {
        equation: SynthesisEquation.create_N2_3H2_2NH3(),
        labelStringProperty: BalancingChemicalEquationsStrings.makeAmmoniaStringProperty,
        tandemNamePrefix: 'makeAmmonia'
      },
      {
        equation: DecompositionEquation.create_2H2O_2H2_O2(),
        labelStringProperty: BalancingChemicalEquationsStrings.separateWaterStringProperty,
        tandemNamePrefix: 'separateWater'
      },
      {
        equation: DisplacementEquation.create_CH4_2O2_CO2_2H2O(),
        labelStringProperty: BalancingChemicalEquationsStrings.combustMethaneStringProperty,
        tandemNamePrefix: 'combustMethane'
      }
    ];

    this.equationProperty = new Property( this.choices[ 0 ].equation );
  }

  public reset(): void {
    this.equationProperty.reset();
    this.choices.forEach( choice => choice.equation.reset() );
  }
}

balancingChemicalEquations.register( 'IntroModel', IntroModel );