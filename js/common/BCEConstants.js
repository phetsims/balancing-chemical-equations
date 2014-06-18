// Copyright 2002-2014, University of Colorado Boulder

/**
 * A collection of constants that configure global properties.
 * If you change something here, it will change *everywhere* in this project.
 *
 *  Author: Vasily Shakhov (mlearner.com)
 */


define( function() {
  'use strict';

  return Object.freeze( {
    UNBALANCED_COLOR: 'rgb(46,107,178)',
    BALANCED_HIGHLIGHT_COLOR: 'yellow',
    INTRODUCTION_CANVAS_BACKGROUND: '#d9ebff',
    GAME_CANVAS_BACKGROUND: '#ffffe4',
    BOX_COLOR: 'white',
    ATOM_OPTIONS: { stroke: 'black', lineWidth: 0.5 },
    MOLECULE_SCALE_FACTOR: 0.37 // scale all molecules by scaleFactor to fit design
  } );

} );