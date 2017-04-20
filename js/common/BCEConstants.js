// Copyright 2014-2017, University of Colorado Boulder

/**
 * A collection of constants that configure global properties.
 * If you change something here, it will change *everywhere* in this project.
 *
 * @author Vasily Shakhov (mlearner.com)
 */
define( function( require ) {
  'use strict';

  // modules
  var balancingChemicalEquations = require( 'BALANCING_CHEMICAL_EQUATIONS/balancingChemicalEquations' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var FontAwesomeNode = require( 'SUN/FontAwesomeNode' );

  var BCEConstants = Object.freeze( {
    SCREEN_VIEW_OPTIONS: { layoutBounds: new Bounds2( 0, 0, 768, 504 ) },
    UNBALANCED_COLOR: 'rgb(46,107,178)',
    BALANCED_HIGHLIGHT_COLOR: 'yellow',
    INTRODUCTION_CANVAS_BACKGROUND: '#d9ebff',
    GAME_CANVAS_BACKGROUND: '#ffffe4',
    BOX_COLOR: 'white',
    ATOM_OPTIONS: { stroke: 'black', lineWidth: 0.5 },
    MOLECULE_SCALE_FACTOR: 0.74, // scale all molecules by scaleFactor to fit design
    CORRECT_ICON: new FontAwesomeNode( 'check_without_box', { fill: 'rgb( 0, 180, 0 )' } ), // check mark
    INCORRECT_ICON: new FontAwesomeNode( 'times', { fill: 'rgb(252,104,0)' } ) // X
  } );

  balancingChemicalEquations.register( 'BCEConstants', BCEConstants );

  return BCEConstants;
} );