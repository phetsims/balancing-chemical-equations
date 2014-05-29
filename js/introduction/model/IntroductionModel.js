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
  var BalancedRepresentation = require( 'BALANCING_CHEMICAL_EQUATIONS/introduction/model/BalancedRepresentation' );
  var SynthesisEquation = require( 'BALANCING_CHEMICAL_EQUATIONS/common/model/SynthesisEquation' );
  var DecompositionEquation = require( 'BALANCING_CHEMICAL_EQUATIONS/common/model/DecompositionEquation' );
  var DisplacementEquation = require( 'BALANCING_CHEMICAL_EQUATIONS/common/model/DisplacementEquation' );
  var Range = require( 'DOT/Range' );

  function IntroductionModel( width, height ) {

    this.COEFFICENTS_RANGE = new Range( 0, 3 ); // Range of possible equation coefficients

    this.width = width;
    this.height = height;

    //list of possible equations
    this.equations = [SynthesisEquation.Synthesis_N2_3H2_2NH3(), DecompositionEquation.Decomposition_2H2O_2H2_O2(), DisplacementEquation.Displacement_CH4_2O2_CO2_2H2O()];

    PropertySet.call( this, {
      currentEquation: this.equations[0],
      balanceChoice: BalancedRepresentation.BALANCE_SCALES
    } );

  }

  inherit( PropertySet, IntroductionModel, {
    reset: function() {
      PropertySet.prototype.reset.call( this );
      this.equations.forEach( function( equation ) {
        equation.reset();
      } );
    }
  } );

  return IntroductionModel;
} );