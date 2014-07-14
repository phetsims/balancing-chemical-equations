// Copyright 2002-2014, University of Colorado Boulder

/**
 * Query parameters supported by this simulation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  var getQueryParameter = window.phetcommon.getQueryParameter;

  return {
    // enabled developer-only features
    DEV: getQueryParameter( 'dev' ) || false,

    // play all challenges for each level of the game, to get 100% test coverage
    PLAY_ALL: getQueryParameter( 'playAll' ) || false,

    // show the game reward regardless of score
    REWARD: getQueryParameter( 'reward' ) || false
  };
} );
