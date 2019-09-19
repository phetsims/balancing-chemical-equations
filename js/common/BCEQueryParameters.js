// Copyright 2014-2018, University of Colorado Boulder

/**
 * Query parameters supported by this simulation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const balancingChemicalEquations = require( 'BALANCING_CHEMICAL_EQUATIONS/balancingChemicalEquations' );

  const BCEQueryParameters = QueryStringMachine.getAll( {

    // play all challenges for each level of the game, to get 100% test coverage
    playAll: { type: 'flag' },

    // show the game reward regardless of score
    showReward: { type: 'flag' }
  } );

  balancingChemicalEquations.register( 'BCEQueryParameters', BCEQueryParameters );

  // log the values of all sim-specific query parameters
  phet.log && phet.log( 'query parameters: ' + JSON.stringify( BCEQueryParameters, null, 2 ) );

  return BCEQueryParameters;
} );
