// Copyright 2025, University of Colorado Boulder

/**
 * ViewMode is an enumeration of possible choices in the 'View' combo box. We decided on the name ViewMode to be
 * consistent with Acid-Base Solutions - see https://github.com/phetsims/balancing-chemical-equations/issues/199#issuecomment-2847755158.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

export const ViewModeValues = [ 'particles', 'balanceScales', 'barCharts', 'none' ] as const;
export type ViewMode = ( typeof ViewModeValues )[number];