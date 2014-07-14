// Copyright 2002-2014, University of Colorado Boulder

/**
 * Model container for the 'Introduction' screen.
 * This model has a small set of equations, one of which is the current equation that we're operating on.*
 *
 * @author Vasily Shakhov (MLearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );
  var SynthesisEquation = require( 'BALANCING_CHEMICAL_EQUATIONS/common/model/SynthesisEquation' );
  var DecompositionEquation = require( 'BALANCING_CHEMICAL_EQUATIONS/common/model/DecompositionEquation' );
  var DisplacementEquation = require( 'BALANCING_CHEMICAL_EQUATIONS/common/model/DisplacementEquation' );
  var Range = require( 'DOT/Range' );

  /**
   * @constructor
   */
  function IntroductionModel() {

    this.COEFFICENTS_RANGE = new Range( 0, 3 ); // Range of possible equation coefficients

    // list of possible equations
    this.equations = [
      SynthesisEquation.create_N2_3H2_2NH3(),
      DecompositionEquation.create_2H2O_2H2_O2(),
      DisplacementEquation.create_CH4_2O2_CO2_2H2O()
    ];

    PropertySet.call( this, {
      equation: this.equations[0] // the equation that is selected
    } );
  }

  return inherit( PropertySet, IntroductionModel, {

    // @override
    reset: function() {
      PropertySet.prototype.reset.call( this );
      this.equations.forEach( function( equation ) {
        equation.reset();
      } );
    }
  } );
} );