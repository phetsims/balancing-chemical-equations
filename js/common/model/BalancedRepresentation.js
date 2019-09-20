// Copyright 2014-2019, University of Colorado Boulder

/**
 * Choices for visual representations of "balanced".
 *
 * @author Vasily Shakhov (Mlearner)
 */
define( require => {
  'use strict';

  // modules
  const balancingChemicalEquations = require( 'BALANCING_CHEMICAL_EQUATIONS/balancingChemicalEquations' );

  const BalancedRepresentation = Object.freeze( {
    'NONE': 'NONE',
    'BALANCE_SCALES': 'BALANCE_SCALES',
    'BAR_CHARTS': 'BAR_CHARTS'
  } );

  balancingChemicalEquations.register( 'BalancedRepresentation', BalancedRepresentation );

  return BalancedRepresentation;
} );
