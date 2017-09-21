// Copyright 2014-2016, University of Colorado Boulder

/**
 * Model container for the 'Introduction' screen.
 * This model has a small set of equations, one of which is the current equation that we're operating on.*
 *
 * @author Vasily Shakhov (MLearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var balancingChemicalEquations = require( 'BALANCING_CHEMICAL_EQUATIONS/balancingChemicalEquations' );
  var DecompositionEquation = require( 'BALANCING_CHEMICAL_EQUATIONS/common/model/DecompositionEquation' );
  var DisplacementEquation = require( 'BALANCING_CHEMICAL_EQUATIONS/common/model/DisplacementEquation' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var RangeWithValue = require( 'DOT/RangeWithValue' );
  var SynthesisEquation = require( 'BALANCING_CHEMICAL_EQUATIONS/common/model/SynthesisEquation' );

  // strings
  var combustMethaneString = require( 'string!BALANCING_CHEMICAL_EQUATIONS/combustMethane' );
  var makeAmmoniaString = require( 'string!BALANCING_CHEMICAL_EQUATIONS/makeAmmonia' );
  var separateWaterString = require( 'string!BALANCING_CHEMICAL_EQUATIONS/separateWater' );

  /**
   * @constructor
   */
  function IntroductionModel() {

    this.COEFFICENTS_RANGE = new RangeWithValue( 0, 3 ); // @public (read-only) Range of possible equation coefficients

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

  balancingChemicalEquations.register( 'IntroductionModel', IntroductionModel );

  return inherit( Object, IntroductionModel, {

    // @public
    reset: function() {
      this.equationProperty.reset();
      this.choices.forEach( function( choice ) {
        choice.equation.reset();
      } );
    }
  } );
} );