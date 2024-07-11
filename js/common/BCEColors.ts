// Copyright 2023-2024, University of Colorado Boulder

/**
 * Colors used throughout this simulation.
 * 
 * @author Chris Malley (PixelZoom, Inc.)
 */

import balancingChemicalEquations from '../balancingChemicalEquations.js';
import { ProfileColorProperty } from '../../../scenery/js/imports.js';

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