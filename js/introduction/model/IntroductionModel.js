// Copyright 2014-2020, University of Colorado Boulder

/**
 * Model container for the 'Introduction' screen.
 * This model has a small set of equations, one of which is the current equation that we're operating on.*
 *
 * @author Vasily Shakhov (MLearner)
 */
define( require => {
  'use strict';

  // modules
  const balancingChemicalEquations = require( 'BALANCING_CHEMICAL_EQUATIONS/balancingChemicalEquations' );
  const DecompositionEquation = require( 'BALANCING_CHEMICAL_EQUATIONS/common/model/DecompositionEquation' );
  const DisplacementEquation = require( 'BALANCING_CHEMICAL_EQUATIONS/common/model/DisplacementEquation' );
  const Property = require( 'AXON/Property' );
  const Range = require( 'DOT/Range' );
  const SynthesisEquation = require( 'BALANCING_CHEMICAL_EQUATIONS/common/model/SynthesisEquation' );

  // strings
  const combustMethaneString = require( 'string!BALANCING_CHEMICAL_EQUATIONS/combustMethane' );
  const makeAmmoniaString = require( 'string!BALANCING_CHEMICAL_EQUATIONS/makeAmmonia' );
  const separateWaterString = require( 'string!BALANCING_CHEMICAL_EQUATIONS/separateWater' );

  class IntroductionModel {

    constructor() {

      this.COEFFICENTS_RANGE = new Range( 0, 3 ); // @public (read-only) Range of possible equation coefficients

      /*
       * @public
       * Choices available in the 'Introduction' screen.
       * The contract for a choice is: { equation: {Equation}, label: {string} }
       */
      this.choices = [
        { equation: SynthesisEquation.create_N2_3H2_2NH3(), label: makeAmmoniaString },
        { equation: DecompositionEquation.create_2H2O_2H2_O2(), label: separateWaterString },
        { equation: DisplacementEquation.create_CH4_2O2_CO2_2H2O(), label: combustMethaneString }
      ];

      // @public the equation that is selected
      this.equationProperty = new Property( this.choices[ 0 ].equation );
    }

    // @public
    reset() {
      this.equationProperty.reset();
      this.choices.forEach( function( choice ) {
        choice.equation.reset();
      } );
    }
  }

  return balancingChemicalEquations.register( 'IntroductionModel', IntroductionModel );
} );