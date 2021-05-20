// Copyright 2014-2021, University of Colorado Boulder

/**
 * Query parameters supported by this simulation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import logGlobal from '../../../phet-core/js/logGlobal.js';
import balancingChemicalEquations from '../balancingChemicalEquations.js';

const BCEQueryParameters = QueryStringMachine.getAll( {

  // Play all challenges for each level of the game, to get 100% test coverage.
  // For internal use only.
  playAll: { type: 'flag' },

  // Show the game reward regardless of score.
  // For internal use only.
  showReward: { type: 'flag' }
} );

balancingChemicalEquations.register( 'BCEQueryParameters', BCEQueryParameters );

// Log query parameters
logGlobal( 'phet.chipper.queryParameters' );
logGlobal( 'phet.preloads.phetio.queryParameters' );
logGlobal( 'phet.balancingChemicalEquations.BCEQueryParameters' );

export default BCEQueryParameters;