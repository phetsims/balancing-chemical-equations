// Copyright 2014-2022, University of Colorado Boulder

/**
 * Choices for visual representations of "balanced".
 *
 * @author Vasily Shakhov (Mlearner)
 */

import EnumerationDeprecated from '../../../../phet-core/js/EnumerationDeprecated.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';

const BalancedRepresentation = EnumerationDeprecated.byKeys( [ 'NONE', 'BALANCE_SCALES', 'BAR_CHARTS' ] );

balancingChemicalEquations.register( 'BalancedRepresentation', BalancedRepresentation );
export default BalancedRepresentation;