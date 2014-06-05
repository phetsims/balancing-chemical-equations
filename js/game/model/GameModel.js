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
  var Property = require( 'AXON/Property' );
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
      LEVEL_SELECTION: 'LevelSelection', //level selection screen
      START_GAME: 'StartGame', //intermediate state, needed for initialize game view
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
    this.BALANCED_REPRESENTATION_STRATEGIES = [
      function() { return BalancedRepresentation.BALANCE_SCALES; }, //level 1
      function() {  //level 2
        return Math.random() < 0.5 ? BalancedRepresentation.BALANCE_SCALES : BalancedRepresentation.BAR_CHARTS;
      },
      function() { return BalancedRepresentation.BAR_CHARTS; } // level 3
    ];

    //constants
    this.COEFFICENTS_RANGE = new Range( 0, 7 ); // Range of possible equation coefficients
    this.LEVELS_RANGE = new Range( 0, 2 ); // Levels 1-2-3, counting from 0
    this.EQUATIONS_PER_GAME = 5;
    this.POINTS_FIRST_ATTEMPT = 2;  // points to award for correct guess on 1st attempt
    this.POINTS_SECOND_ATTEMPT = 1; // points to award for correct guess on 2nd attempt

    // dimensions of the model's space
    this.width = width;
    this.height = height;

    //properties
    PropertySet.call( this, {
      state: self.gameState.LEVEL_SELECTION,
      points: 0, // how many points the user has earned for the current game
      currentEquation: null,
      currentLevel: 0,
      currentPoints: 0, // how many points were earned for the current equation
      attempts: 0,// how many attempts the user has made at solving the current challenge
      currentEquationIndex: 0, // index of the current equation that the user is working on
      balancedRepresentation: null, // which representation to use in the "Not Balanced" popup
      isNewBestTime: false, // is the time for this game a new best time?
      soundEnabled: true,
      timerEnabled: true
    } );

    this.equationsFactory = new GameFactory(); // generates problem sets
    this.timer = new GameTimer();
    this.bestTimes = [];// best times, maps level to time in ms
    this.bestScores = []; //best scores, maps level to best score
    for ( var i = this.LEVELS_RANGE.min; i <= this.LEVELS_RANGE.max; i++ ) {
      this.bestTimes[i] = new Property( 0 );
      this.bestScores[i] = new Property( 0 );
    }


  }

  return inherit( PropertySet, GameModel, {
    /**
     * Called when the user presses the "Start Game" button.
     */
    startGame: function() {
      this.equations = this.equationsFactory.createEquations( this.EQUATIONS_PER_GAME, this.currentLevel );
      this.currentEquationIndex = 0;
      this.balancedRepresentation = this.BALANCED_REPRESENTATION_STRATEGIES[ this.currentLevel ]();
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
          //check for new best score
          if ( this.points > this.bestScores[this.currentLevel].get() ) {
            this.bestScores[this.currentLevel].set( this.points );
          }

          // check for new best time
          var previousBestTime = this.bestTimes[this.currentLevel].get();
          if ( this.isPerfectScore() && ( previousBestTime === 0 || this.timer.elapsedTime < previousBestTime ) ) {
            this.isNewBestTime = true;
            this.bestTimes[this.currentLevel].set( this.timer.elapsedTime );
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
      return this.EQUATIONS_PER_GAME * this.POINTS_FIRST_ATTEMPT;
    },
    /**
     * Is the current score a perfect score?
     * This can be called at any time during the game, but can't possibly
     * return true until the game has been completed.
     *
     * @return
     */
    isPerfectScore: function() {
      return this.points === this.getPerfectScore();
    },
    /**
     * Called when the user presses the "New Game" button.
     */
    newGame: function() {
      this.state = this.gameState.LEVEL_SELECTION;
    },
    /**
     * Called when the user presses the "Next" button.
     */
    next: function() {
      if ( this.currentEquationIndex < this.equations.length - 1 ) {
        this.attempts = 0;
        this.currentPoints = 0;
        this.balancedRepresentation = this.BALANCED_REPRESENTATION_STRATEGIES[this.currentLevel]();
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