// Copyright 2014-2015, University of Colorado Boulder

/**
 * Choices for visual representations of "balanced".
 *
 * @author Vasily Shakhov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var balancingChemicalEquations = require( 'BALANCING_CHEMICAL_EQUATIONS/balancingChemicalEquations' );

  var BalancedRepresentation = Object.freeze( {
    'NONE': 'NONE',
    'BALANCE_SCALES': 'BALANCE_SCALES',
    'BAR_CHARTS': 'BAR_CHARTS'
  } );

  balancingChemicalEquations.register( 'BalancedRepresentation', BalancedRepresentation );

  return BalancedRepresentation;
} );
