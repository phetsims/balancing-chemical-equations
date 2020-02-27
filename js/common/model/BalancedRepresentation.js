// Copyright 2014-2020, University of Colorado Boulder

/**
 * Choices for visual representations of "balanced".
 *
 * @author Vasily Shakhov (Mlearner)
 */

import balancingChemicalEquations from '../../balancingChemicalEquations.js';

const BalancedRepresentation = Object.freeze( {
  'NONE': 'NONE',
  'BALANCE_SCALES': 'BALANCE_SCALES',
  'BAR_CHARTS': 'BAR_CHARTS'
} );

balancingChemicalEquations.register( 'BalancedRepresentation', BalancedRepresentation );
export default BalancedRepresentation;