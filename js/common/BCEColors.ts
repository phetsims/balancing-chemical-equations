// Copyright 2023-2025, University of Colorado Boulder

/**
 * Colors used throughout this simulation.
 * 
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ProfileColorProperty from '../../../scenery/js/util/ProfileColorProperty.js';
import balancingChemicalEquations from '../balancingChemicalEquations.js';

const BCEColors = {

  introScreenBackgroundColorProperty: new ProfileColorProperty( balancingChemicalEquations, 'introScreenBackgroundColor', {
    default: '#d9ebff'
  } ),

  gameScreenBackgroundColorProperty: new ProfileColorProperty( balancingChemicalEquations, 'gameScreenBackgroundColor', {
    default: '#ffffe4'
  } ),

  // Caution! Converting these colors to ProfileColorProperty requires disposing things that link to them.
  ATOM_STROKE: 'black',
  UNBALANCED_COLOR: 'rgb( 46, 107, 178 )',
  BALANCED_HIGHLIGHT_COLOR: 'yellow',
  BOX_COLOR: 'white'
};

balancingChemicalEquations.register( 'BCEColors', BCEColors );
export default BCEColors;