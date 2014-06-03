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
  var BalancedRepresentationStrategy = require( 'BALANCING_CHEMICAL_EQUATIONS/game/model/BalancedRepresentationStrategy' );
  var BalancedRepresentation = require( 'BALANCING_CHEMICAL_EQUATIONS/common/model/BalancedRepresentation' );
  var GameFactory = require( 'BALANCING_CHEMICAL_EQUATIONS/game/model/GameFactory' );
  var GameTimer = require( 'VEGAS/GameTimer' );
  var Range = require( 'DOT/Range' );


  function GameModel( width, height ) {
    var self = this;
    /*
     * The set of game states.
     * For lack of better names, the state names correspond to the main action that
     * the user can take in that state.  For example. the CHECK state is where the user
     * can enter coefficients and press the "Check" button to check their answer.
     */
    this.gameState = {
      START_GAME: 'StartGame', //level selection screen
      CHECK: 'Check',
      TRY_AGAIN: 'TryAgain',
      SHOW_ANSWER: 'ShowAnswer',
      NEXT: 'Next',
      LEVEL_COMPLETED: 'LevelCompleted' //reward node
    };

    /*
     * Strategies for selecting the "balanced representation" that is displayed by the "Not Balanced" popup.
     * This is a map from level to strategy.
     */
    this.BALANCED_REPRESENTATION_STRATEGIES = {
      1: new BalancedRepresentationStrategy().Constant( BalancedRepresentation.BALANCE_SCALES ),
      2: new BalancedRepresentationStrategy().Random(),
      3: new BalancedRepresentationStrategy().Constant( BalancedRepresentation.BAR_CHARTS )
    };


    //TODO check if we can move it outside function
    //constants
    this.COEFFICENTS_RANGE = new Range( 0, 7 ); // Range of possible equation coefficients
    this.LEVELS_RANGE = new Range( 1, 3 );
    this.EQUATIONS_PER_GAME = 5;
    this.POINTS_FIRST_ATTEMPT = 2;  // points to award for correct guess on 1st attempt
    this.POINTS_SECOND_ATTEMPT = 1; // points to award for correct guess on 2nd attempt

    // dimensions of the model's space
    this.width = width;
    this.height = height;

    //properties
    PropertySet.call( this, {
      state: self.gameState.START_GAME,
      points: 0, // how many points the user has earned for the current game
      currentEquation: null,
      currentLevel: 0,
      currentPoints: 0, // how many points were earned for the current equation
      attempts: 0,// how many attempts the user has made at solving the current challenge
      currentEquationIndex: 0, // index of the current equation that the user is working on
      balancedRepresentation: null, // which representation to use in the "Not Balanced" popup
      isNewBestTime: false, // is the time for this game a new best time?
      soundEnabled: true,
      timerEnabled: true,
      elapsedTime: 0
    } );

    this.equationsFactory = new GameFactory(); // generates problem sets
    this.timer = new GameTimer();
    this.bestTimes = [];// best times, maps level to time in ms
    for ( var i = this.LEVELS_RANGE.min; i < this.LEVELS_RANGE.max; i++ ) {
      this.bestTimes[i] = 0;
    }

  }

  return inherit( PropertySet, GameModel, {
    /**
     * Called when the user presses the "Start Game" button.
     */
    startGame: function() {
      this.equations = this.equationsFactory.createEquations( this.EQUATIONS_PER_GAME, this.currentLevel );
      this.currentEquationIndex = 0;
      this.balancedRepresentation = this.BALANCED_REPRESENTATION_STRATEGIES[ this.currentLevel ].getBalancedRepresentation();
      this.attempts = 0;
      this.isNewBestTime = false;
      this.timer.start();
      this.currentPoints = 0;
      this.points = 0;
      this.currentEquation = this.equations [this.currentEquationIndex ];
      this.state = this.gameState.CHECK;
    },
    /**
     * Called when the user presses the "Check" button.
     */
    check: function() {
      this.attempts++;
      if ( this.currentEquation.balancedAndSimplified ) {
        // award points
        if ( this.attempts === 1 ) {
          this.currentPoints = this.POINTS_FIRST_ATTEMPT;

        }
        else if ( this.attempts === 2 ) {
          this.currentPoints = this.POINTS_SECOND_ATTEMPT;
        }
        else {
          this.currentPoints = 0;
        }
        this.points += this.currentPoints;

        // end the game
        if ( this.currentEquationIndex === this.equations.length - 1 ) {
          this.timer.stop();
          // check for new best time
          var previousBestTime = this.bestTimes[this.currentLevel];
          if ( this.isPerfectScore() && ( previousBestTime === 0 || this.timer.time < previousBestTime ) ) {
            this.isNewBestTime = true;
            this.bestTimes.put( this.currentLevel, this.timer.time );
          }
        }

        this.state = this.gameState.NEXT;
      }
      else if ( this.attempts < 2 ) {
        this.state = this.gameState.TRY_AGAIN;
      }
      else {
        this.state = this.gameState.SHOW_ANSWER;
      }
    },
    /**
     * Called when the user presses the "Try Again" button.
     */
    tryAgain: function() {
      this.state = this.gameState.CHECK;
    },
    /**
     * Called when the user presses the "Show Answer" button.
     */
    showAnswer: function() {
      this.state = this.gameState.NEXT;
    },
    /**
     * Gets the number of points in a perfect score, which occurs when the user
     * balances every equation in the game correctly on the first attempt.
     *
     * @return
     */
    getPerfectScore: function() {
      return this.equations.length * this.POINTS_FIRST_ATTEMPT;
    },
    /**
     * Is the current score a perfect score?
     * This can be called at any time during the game, but can't possibly
     * return true until the game has been completed.
     *
     * @return
     */
    isPerfectScore: function() {
      return this.points.get() === this.getPerfectScore();
    },
    /**
     * Called when the user presses the "New Game" button.
     */
    newGame: function() {
      this.state = this.gameState.START_GAME;
    },
    /**
     * Called when the user presses the "Next" button.
     */
    next: function() {
      if ( this.currentEquationIndex < this.equations.length - 1 ) {
        this.attempts = 0;
        this.currentPoints = 0;
        this.balancedRepresentation = this.BALANCED_REPRESENTATION_STRATEGIES[this.currentLevel].balancedRepresentation;
        this.currentEquationIndex++;
        this.currentEquation = this.equations[this.currentEquationIndex];
        this.state = this.gameState.CHECK;
      }
      else {
        this.state = this.gameState.LEVEL_COMPLETED;
      }
    }
  } );
} );