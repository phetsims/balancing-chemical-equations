// Copyright 2014-2015, University of Colorado Boulder

/**
 * Model container for the 'Balancing game' screen.
 *
 * @author Vasily Shakhov (MLearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var balancingChemicalEquations = require( 'BALANCING_CHEMICAL_EQUATIONS/balancingChemicalEquations' );
  var BalancedRepresentation = require( 'BALANCING_CHEMICAL_EQUATIONS/common/model/BalancedRepresentation' );
  var GameFactory = require( 'BALANCING_CHEMICAL_EQUATIONS/game/model/GameFactory' );
  var GameTimer = require( 'VEGAS/GameTimer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var PropertySet = require( 'AXON/PropertySet' );
  var Range = require( 'DOT/Range' );
  var SynthesisEquation = require( 'BALANCING_CHEMICAL_EQUATIONS/common/model/SynthesisEquation' );

  // constants
  /*
   * Strategies for selecting the "balanced representation" that is displayed by the "Not Balanced" popup.
   * This is a map from level to strategy.
   */
  var BALANCED_REPRESENTATION_STRATEGIES = [
    function() { return BalancedRepresentation.BALANCE_SCALES; }, //level 1
    function() {  //level 2
      return Math.random() < 0.5 ? BalancedRepresentation.BALANCE_SCALES : BalancedRepresentation.BAR_CHARTS;
    },
    function() { return BalancedRepresentation.BAR_CHARTS; } // level 3
  ];
  var POINTS_FIRST_ATTEMPT = 2;  // points to award for correct guess on 1st attempt
  var POINTS_SECOND_ATTEMPT = 1; // points to award for correct guess on 2nd attempt

  /**
   * @constructor
   */
  function GameModel() {

    var self = this;

    /*
     * @public
     * The set of game states.
     * For lack of better names, the state names correspond to the main action that
     * the user can take in that state.  For example. the CHECK state is where the user
     * can enter coefficients and press the "Check" button to check their answer.
     */
    this.states = {
      LEVEL_SELECTION: 'LevelSelection', //level selection screen
      START_GAME: 'StartGame', //intermediate state, needed for initialize game view
      CHECK: 'Check',
      TRY_AGAIN: 'TryAgain',
      SHOW_ANSWER: 'ShowAnswer',
      NEXT: 'Next',
      LEVEL_COMPLETED: 'LevelCompleted' //reward node
    };

    // @public (read-only) constants
    this.COEFFICENTS_RANGE = new Range( 0, 7 ); // Range of possible equation coefficients
    this.LEVELS_RANGE = new Range( 0, 2 ); // Levels 1-2-3, counting from 0

    PropertySet.call( this, {

      // @public
      state: self.states.LEVEL_SELECTION,
      level: 0, // level of the current game
      points: 0, // how many points the user has earned for the current game
      numberOfEquations: 0, // number of challenges in the current game
      currentEquation: SynthesisEquation.create_N2_3H2_2NH3(), // any non-null {Equation} will do here
      currentEquationIndex: 0 // index of the current challenge that the user is working on
    } );

    this.equations = []; // @public array of Equation
    this.timer = new GameTimer(); // @public
    this.attempts = 0; // @private how many attempts the user has made at solving the current challenge
    this.currentPoints = 0; // @public how many points were earned for the current challenge
    this.balancedRepresentation = null; // @public which representation to use in the "Not Balanced" popup
    this.isNewBestTime = false; // @public is the time for this game a new best time?

    this.bestTimeProperties = [];// @public {Property.<number>[]} best times in ms, indexed by level
    this.bestScoreProperties = []; // @public {Property.<number>[]} best scores, indexed by level
    for ( var i = this.LEVELS_RANGE.min; i <= this.LEVELS_RANGE.max; i++ ) {
      this.bestTimeProperties[ i ] = new Property( 0 );
      this.bestScoreProperties[ i ] = new Property( 0 );
    }
  }

  balancingChemicalEquations.register( 'GameModel', GameModel );

  return inherit( PropertySet, GameModel, {

    // @override @public
    reset: function() {
      PropertySet.prototype.reset.call( this );
      this.bestTimeProperties.forEach( function( bestTimeProperty ) {
        bestTimeProperty.reset();
      } );
      this.bestScoreProperties.forEach( function( bestScoreProperty ) {
        bestScoreProperty.reset();
      } );
    },

    /**
     * Called when the user presses a level-selection button.
     * @public
     */
    startGame: function() {

      // create a set of challenges
      this.equations = GameFactory.createEquations( this.level );

      // initialize simple fields
      this.attempts = 0;
      this.currentPoints = 0;
      this.isNewBestTime = false;
      this.balancedRepresentation = BALANCED_REPRESENTATION_STRATEGIES[ this.level ]();
      this.timer.restart();

      // initialize properties
      this.currentEquationIndex = 0;
      this.currentEquation = this.equations[ this.currentEquationIndex ];
      this.numberOfEquations = this.equations.length;
      this.points = 0;
      this.state = this.states.CHECK;
    },

    /**
     * Called when the user presses the "Check" button.
     * @public
     */
    check: function() {
      this.attempts++;

      if ( this.currentEquation.balancedAndSimplified ) {
        // award points
        if ( this.attempts === 1 ) {
          this.currentPoints = POINTS_FIRST_ATTEMPT;

        }
        else if ( this.attempts === 2 ) {
          this.currentPoints = POINTS_SECOND_ATTEMPT;
        }
        else {
          this.currentPoints = 0;
        }
        this.points += this.currentPoints;
        this.state = this.states.NEXT;

        if ( this.currentEquationIndex === this.equations.length - 1 ) {
          this.endGame();
        }
      }
      else if ( this.attempts < 2 ) {
        this.state = this.states.TRY_AGAIN;
      }
      else {
        if ( this.currentEquationIndex === this.equations.length - 1 ) {
          this.endGame();
        }
        this.state = this.states.SHOW_ANSWER;
      }
    },

    /**
     * When a game ends, stop the timer and (if perfect score) set the new best time.
     * @private
     */
    endGame: function() {
      this.timer.stop();
      //check for new best score
      if ( this.points > this.bestScoreProperties[ this.level ].get() ) {
        this.bestScoreProperties[ this.level ].set( this.points );
      }

      // check for new best time
      var previousBestTime = this.bestTimeProperties[ this.level ].get();
      if ( this.isPerfectScore() && ( previousBestTime === 0 || this.timer.elapsedTime < previousBestTime ) ) {
        this.isNewBestTime = true;
        this.bestTimeProperties[ this.level ].set( this.timer.elapsedTime );
      }
    },

    /**
     * Called when the user presses the "Try Again" button.
     * @public
     */
    tryAgain: function() {
      this.state = this.states.CHECK;
    },

    /**
     * Called when the user presses the "Show Answer" button.
     * @public
     */
    showAnswer: function() {
      this.state = this.states.NEXT;
    },

    /**
     * Gets the number of equations for a specified level.
     *
     * @param level
     * @returns {*}
     * @public
     */
    getNumberOfEquations: function( level ) {
      return GameFactory.getNumberOfEquations( level );
    },

    /**
     * Gets the number of points in a perfect score for a specified level.
     * A perfect score is obtained when the user balances every equation correctly on the first attempt.
     *
     * @param level
     * @return {number}
     * @public
     */
    getPerfectScore: function( level ) {
      return this.getNumberOfEquations( level ) * POINTS_FIRST_ATTEMPT;
    },

    /**
     * Is the current score a perfect score?
     * This can be called at any time during the game, but can't possibly
     * return true until the game has been completed.
     *
     * @return {boolean}
     * @public
     */
    isPerfectScore: function() {
      return this.points === this.getPerfectScore( this.level );
    },

    /**
     * Called when the user presses the "Start Over" button.
     * @public
     */
    newGame: function() {
      this.state = this.states.LEVEL_SELECTION;
      this.timer.restart();
    },

    /**
     * Called when the user presses the "Next" button.
     * @public
     */
    next: function() {
      if ( this.currentEquationIndex < this.equations.length - 1 ) {
        this.attempts = 0;
        this.currentPoints = 0;
        this.balancedRepresentation = BALANCED_REPRESENTATION_STRATEGIES[ this.level ]();
        this.currentEquationIndex++;
        this.currentEquation = this.equations[ this.currentEquationIndex ];
        this.state = this.states.CHECK;
      }
      else {
        this.state = this.states.LEVEL_COMPLETED;
      }
    }
  } );
} );