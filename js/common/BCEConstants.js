// Copyright 2002-2014, University of Colorado Boulder

/**
 * A collection of constants that configure global properties.
 * If you change something here, it will change *everywhere* in this project.
 *
 *  Author: Vasily Shakhov (mlearner.com)
 */


define( function( require ) {
  'use strict';

  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var ShadowText = require( 'SCENERY_PHET/ShadowText' );

  return Object.freeze( {
    RENDERER: 'svg',
    UNBALANCED_COLOR: 'rgb(46,107,178)',
    BALANCED_HIGHLIGHT_COLOR: 'yellow',
    INTRODUCTION_CANVAS_BACKGROUND: '#d9ebff',
    GAME_CANVAS_BACKGROUND: '#ffffe4',
    BOX_COLOR: 'white',
    ATOM_OPTIONS: { stroke: 'black', lineWidth: 0.5 },
    MOLECULE_SCALE_FACTOR: 0.74, // scale all molecules by scaleFactor to fit design
    CORRECT_ICON: new ShadowText( '\u2713', { fill: 'rgb(251,247,0)', font: new PhetFont( 40 ) } ), // heavy-ballot check mark
    INCORRECT_ICON: new ShadowText( '\u2718', { fill: 'rgb(252,104,0)', font: new PhetFont( 40 ) } ) // big X
  } );

} );