// Copyright 2014-2024, University of Colorado Boulder

/**
 * Query parameters supported by this simulation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import logGlobal from '../../../phet-core/js/logGlobal.js';
import getGameLevelsSchema from '../../../vegas/js/getGameLevelsSchema.js';
import balancingChemicalEquations from '../balancingChemicalEquations.js';

const BCEQueryParameters = QueryStringMachine.getAll( {

  // The levels to show in the Game screen.
  gameLevels: getGameLevelsSchema( 3 ),

  // Play all challenges for each level of the game, to get 100% test coverage.
  // For internal use only.
  playAll: { type: 'flag' },

  // Show the game reward and play 'cheering' sound regardless of score.
  // For internal use only.
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