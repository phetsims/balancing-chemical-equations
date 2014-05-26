// Copyright 2002-2014, University of Colorado Boulder

/**
 * Model container for the 'Introduction' screen.
 * This model has a small set of equations, one of which is the current equation that we're operating on.*
 *
 * @author Vasily Shakhov (MLearner)
 */
define( function( require ) {
  'use strict';

  // imports
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );
  var BalancedRepresentation = require( 'BALANCING_CHEMICAL_EQUATIONS/introduction/model/BalancedRepresentation' );
  var SynthesisEquation = require( 'BALANCING_CHEMICAL_EQUATIONS/common/model/SynthesisEquation' );
  var DecompositionEquation = require( 'BALANCING_CHEMICAL_EQUATIONS/common/model/DecompositionEquation' );
  var DisplacementEquation = require( 'BALANCING_CHEMICAL_EQUATIONS/common/model/DisplacementEquation' );

  function IntroductionModel(width, height) {

    var COEFFICENTS_ARRAY = [0, 1, 2, 3]; // Array of possible equation coefficients

    this.width = width;
    this.height = height;

    //list of possible equations
    var equations = [SynthesisEquation.Synthesis_N2_3H2_2NH3(), DecompositionEquation.Decomposition_2H2O_2H2_O2()/*, new Displacement_CH4_2O2_CO2_2H2O()*/];

    PropertySet.call( this, {
      currentEquation: equations[0],
      balanceChoice: BalancedRepresentation.NONE
    } );

  }

  inherit( PropertySet, IntroductionModel, {
    reset: function() {
      PropertySet.prototype.reset.call( this );
    }
  } );

  return IntroductionModel;
} );