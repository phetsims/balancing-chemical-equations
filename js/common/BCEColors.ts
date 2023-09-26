// Copyright 2023, University of Colorado Boulder

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

  boxColorProperty: new ProfileColorProperty( balancingChemicalEquations, 'boxColor', {
    default: 'white'
  } ),

  atomStrokeProperty: new ProfileColorProperty( balancingChemicalEquations, 'atomStroke', {
    default: 'black'
  } ),

  // Using ProfileColorProperty for these colors is problematic.
  UNBALANCED_COLOR: 'rgb( 46, 107, 178 )',
  BALANCED_HIGHLIGHT_COLOR: 'yellow'
};

balancingChemicalEquations.register( 'BCEColors', BCEColors );
export default BCEColors;