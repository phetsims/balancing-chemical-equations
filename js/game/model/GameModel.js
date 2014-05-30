// Copyright 2002-2014, University of Colorado Boulder

/**
 * Model container for the 'Balancing game' screen.
 *
 * @author Vasily Shakhov (MLearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );
  var Range = require('DOT/Range');




  function GameModel( width, height ) {
    /**
     * The set of game states.
     * For lack of better names, the state names correspond to the main action that
     * the user can take in that state.  For example. the CHECK state is where the user
     * can enter coefficients and press the "Check" button to check their answer.
     */
    this.gameState = {
      START_GAME: 'START_GAME',
      CHECK: 'CHECK',
      TRY_AGAIN: 'TRY_AGAIN',
      SHOW_ANSWER: 'SHOW_ANSWER',
      NEXT: 'NEXT',
      NEW_GAME: 'NEW_GAME'
    };

    this.COEFFICENTS_RANGE = new Range( 0, 7 ); // Range of possible equation coefficients
    this.LEVELS_RANGE = new Range( 1, 3 );
    this.EQUATIONS_PER_GAME = 5;
    this.POINTS_FIRST_ATTEMPT = 2;  // points to award for correct guess on 1st attempt
    this.POINTS_SECOND_ATTEMPT = 1; // points to award for correct guess on 2nd attempt

    // dimensions of the model's space
    this.width = width;
    this.height = height;

    PropertySet.call( this, {
      points: 0, // how many points the user has earned for the current game
      state: GameState.START_GAME,
      currentEquation: null,
      attempts:0,// how many attempts the user has made at solving the current challenge
      currentEquationIndex: 0, // index of the current equation that the user is working on
      soundEnabled: true,
      isTimerOn: true,
      elapsedTime:0
    } );

  }

  inherit( PropertySet, GameModel, {
    reset: function() {
    }
  } );

  return GameModel;
} );