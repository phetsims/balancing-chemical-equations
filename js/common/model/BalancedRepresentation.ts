// Copyright 2014-2025, University of Colorado Boulder

/**
 * BalancedRepresentation is an enumeration of the visual representations of "balanced".
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

export const BalancedRepresentationValues = [ 'particles', 'balanceScales', 'barCharts', 'none' ] as const;
export type BalancedRepresentation = ( typeof BalancedRepresentationValues )[number];