// Copyright 2014-2025, University of Colorado Boulder

/**
 * Query parameters supported by this simulation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import logGlobal from '../../../phet-core/js/logGlobal.js';
import getGameLevelsSchema from '../../../vegas/js/getGameLevelsSchema.js';
import balancingChemicalEquations from '../balancingChemicalEquations.js';

const BCEQueryParameters = QueryStringMachine.getAll( {

  // The levels to show in the Game screen. This query parameter is public.
  gameLevels: getGameLevelsSchema( 3 ),

  // Plays all challenges for each level of the game, to get 100% test coverage.
  playAll: { type: 'flag' },

  // Shows the game reward and plays the 'cheering' sound, regardless of the score.
  showReward: { type: 'flag' },

  // Verifies the game model by creating lots of equation sets for each game level.
  verifyGame: { type: 'flag' }
} );

balancingChemicalEquations.register( 'BCEQueryParameters', BCEQueryParameters );

// Log query parameters
logGlobal( 'phet.chipper.queryParameters' );
logGlobal( 'phet.preloads.phetio.queryParameters' );
logGlobal( 'phet.balancingChemicalEquations.BCEQueryParameters' );

export default BCEQueryParameters;