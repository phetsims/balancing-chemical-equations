// Copyright 2014-2020, University of Colorado Boulder

/**
 * Choices for visual representations of "balanced".
 *
 * @author Vasily Shakhov (Mlearner)
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';

const BalancedRepresentation = Enumeration.byKeys( [ 'NONE', 'BALANCE_SCALES', 'BAR_CHARTS' ] );

balancingChemicalEquations.register( 'BalancedRepresentation', BalancedRepresentation );
export default BalancedRepresentation;