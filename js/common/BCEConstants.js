// Copyright 2014-2018, University of Colorado Boulder

/**
 * A collection of constants that configure global properties.
 * If you change something here, it will change *everywhere* in this project.
 *
 * @author Vasily Shakhov (mlearner.com)
 */
define( require => {
  'use strict';

  // modules
  const balancingChemicalEquations = require( 'BALANCING_CHEMICAL_EQUATIONS/balancingChemicalEquations' );
  const Bounds2 = require( 'DOT/Bounds2' );

  const BCEConstants = Object.freeze( {
    SCREEN_VIEW_OPTIONS: { layoutBounds: new Bounds2( 0, 0, 768, 504 ) },
    UNBALANCED_COLOR: 'rgb(46,107,178)',
    BALANCED_HIGHLIGHT_COLOR: 'yellow',
    INTRODUCTION_CANVAS_BACKGROUND: '#d9ebff',
    GAME_CANVAS_BACKGROUND: '#ffffe4',
    BOX_COLOR: 'white',
    ATOM_OPTIONS: { stroke: 'black', lineWidth: 0.5 },
    MOLECULE_SCALE_FACTOR: 0.74 // scale all molecules by scaleFactor to fit design
  } );

  balancingChemicalEquations.register( 'BCEConstants', BCEConstants );

  return BCEConstants;
} );