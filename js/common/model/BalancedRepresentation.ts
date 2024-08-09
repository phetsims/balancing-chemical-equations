// Copyright 2014-2024, University of Colorado Boulder

/**
 * Choices for visual representations of "balanced".
 *
 * @author Vasily Shakhov (Mlearner)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';

export default class BalancedRepresentation extends EnumerationValue {

  public static readonly NONE = new BalancedRepresentation();
  public static readonly BALANCE_SCALES = new BalancedRepresentation();
  public static readonly BAR_CHARTS = new BalancedRepresentation();

  public static readonly enumeration = new Enumeration( BalancedRepresentation );
}

balancingChemicalEquations.register( 'BalancedRepresentation', BalancedRepresentation );