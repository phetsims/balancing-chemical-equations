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
import Molecule from '../../common/model/Molecule.js';

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

    const equationsTandem = tandem.createTandem( 'equations' );

    this.choices = [

      // Make Ammonia: N2 + 3 H2 -> 2 NH3
      {
        equation: new SynthesisEquation( 1, Molecule.N2, 3, Molecule.H2, 2, Molecule.NH3,
          this.coefficientsRange, equationsTandem.createTandem( 'makeAmmoniaEquation' ) ),
        labelStringProperty: BalancingChemicalEquationsStrings.makeAmmoniaStringProperty,
        tandemNamePrefix: 'makeAmmonia'
      },

      // Separate Water: 2 H2O -> 2 H2 + O2
      {
        equation: new DecompositionEquation( 2, Molecule.H2O, 2, Molecule.H2, 1, Molecule.O2,
          this.coefficientsRange, equationsTandem.createTandem( 'separateWaterEquation' ) ),
        labelStringProperty: BalancingChemicalEquationsStrings.separateWaterStringProperty,
        tandemNamePrefix: 'separateWater'
      },

      // Combust Methane: CH4 + 2 O2 -> CO2 + 2 H2O
      {
        equation: new DisplacementEquation( 1, Molecule.CH4, 2, Molecule.O2, 1, Molecule.CO2, 2, Molecule.H2O,
          this.coefficientsRange, equationsTandem.createTandem( 'combustMethaneEquation' ) ),
        labelStringProperty: BalancingChemicalEquationsStrings.combustMethaneStringProperty,
        tandemNamePrefix: 'combustMethane'
      }
    ];

    this.equationProperty = new Property( this.choices[ 0 ].equation, {
      validValues: this.choices.map( choice => choice.equation ),
      tandem: tandem.createTandem( 'equationProperty' ),
      phetioValueType: Equation.EquationIO
    } );
  }

  public reset(): void {
    this.equationProperty.reset();
    this.choices.forEach( choice => choice.equation.reset() );
  }
}

balancingChemicalEquations.register( 'IntroModel', IntroModel );