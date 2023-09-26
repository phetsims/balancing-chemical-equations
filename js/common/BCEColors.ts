// Copyright 2023, University of Colorado Boulder

/**
 * Colors used throughout this simulation.
 * 
 * @author Chris Malley (PixelZoom, Inc.)
 */

import balancingChemicalEquations from '../balancingChemicalEquations.js';

const BCEColors = {

  INTRODUCTION_SCREEN_VIEW_BACKGROUND: '#d9ebff',
  GAME_SCREEN_VIEW_BACKGROUND: '#ffffe4',

  ATOM_STROKE: 'black',
  UNBALANCED_COLOR: 'rgb( 46, 107, 178 )',
  BALANCED_HIGHLIGHT_COLOR: 'yellow',
  BOX_COLOR: 'white'
};

balancingChemicalEquations.register( 'BCEColors', BCEColors );
export default BCEColors;