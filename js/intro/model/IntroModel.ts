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
import Equation from '../../common/model/Equation.js';
import Molecule from '../../common/model/Molecule.js';
import BCEPreferences from '../../common/model/BCEPreferences.js';

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

  private readonly equations: Equation[];

  // the equation that is selected
  public readonly equationProperty: Property<Equation>;

  public constructor( tandem: Tandem ) {

    this.coefficientsRange = new Range( 0, 3 );

    const equationsTandem = tandem.createTandem( 'equations' );

    this.choices = [

      // Make Ammonia: N2 + 3 H2 -> 2 NH3
      {
        equation: Equation.create2Reactants1Product( 1, Molecule.N2, 3, Molecule.H2, 2, Molecule.NH3,
          this.coefficientsRange, equationsTandem.createTandem( 'makeAmmoniaEquation' ) ),
        labelStringProperty: BalancingChemicalEquationsStrings.makeAmmoniaStringProperty,
        tandemNamePrefix: 'makeAmmonia'
      },

      // Separate Water: 2 H2O -> 2 H2 + O2
      {
        equation: Equation.create1Reactant2Products( 2, Molecule.H2O, 2, Molecule.H2, 1, Molecule.O2,
          this.coefficientsRange, equationsTandem.createTandem( 'separateWaterEquation' ) ),
        labelStringProperty: BalancingChemicalEquationsStrings.separateWaterStringProperty,
        tandemNamePrefix: 'separateWater'
      },

      // Combust Methane: CH4 + 2 O2 -> CO2 + 2 H2O
      {
        equation: Equation.create2Reactants2Products( 1, Molecule.CH4, 2, Molecule.O2, 1, Molecule.CO2, 2, Molecule.H2O,
          this.coefficientsRange, equationsTandem.createTandem( 'combustMethaneEquation' ) ),
        labelStringProperty: BalancingChemicalEquationsStrings.combustMethaneStringProperty,
        tandemNamePrefix: 'combustMethane'
      }
    ];

    this.equations = this.choices.map( choice => choice.equation );

    this.equationProperty = new Property( this.choices[ 0 ].equation, {
      validValues: this.equations,
      tandem: tandem.createTandem( 'equationProperty' ),
      phetioFeatured: true,
      phetioValueType: Equation.EquationIO
    } );

    // Change the initial coefficient for all equations.
    BCEPreferences.instance.initialCoefficientProperty.lazyLink( initialCoefficient =>
      this.equations.forEach( equation => equation.setInitialCoefficients( initialCoefficient ) ) );
  }

  public reset(): void {
    this.equationProperty.reset();
    this.equations.forEach( equation => equation.reset() );
  }
}

balancingChemicalEquations.register( 'IntroModel', IntroModel );