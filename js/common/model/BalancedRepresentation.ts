// Copyright 2014-2025, University of Colorado Boulder

/**
 * BalancedRepresentation is an enumeration of the visual representations of "balanced".
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

//TODO https://github.com/phetsims/balancing-chemical-equations/issues/170 Delete 'molecules' if not promoted to a BalancedRepresentation.
export const BalancedRepresentationValues = [ 'molecules', 'balanceScales', 'barChart', 'none' ] as const;
export type BalancedRepresentation = ( typeof BalancedRepresentationValues )[number];