// Copyright 2014-2024, University of Colorado Boulder

/**
 * BalancedRepresentation is an enumeration of the visual representations of "balanced".
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

export const BalancedRepresentationValues = [ 'none', 'balanceScales', 'barCharts' ] as const;
export type BalancedRepresentation = ( typeof BalancedRepresentationValues )[number];