// Copyright 2014-2020, University of Colorado Boulder

/**
 * Model container for the 'Balancing game' screen.
 *
 * @author Vasily Shakhov (MLearner)
 */
define( require => {
  'use strict';

  // modules
  const BalancedRepresentation = require( 'BALANCING_CHEMICAL_EQUATIONS/common/model/BalancedRepresentation' );
  const balancingChemicalEquations = require( 'BALANCING_CHEMICAL_EQUATIONS/balancingChemicalEquations' );
  const GameFactory = require( 'BALANCING_CHEMICAL_EQUATIONS/game/model/GameFactory' );
  const GameTimer = require( 'VEGAS/GameTimer' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const Property = require( 'AXON/Property' );
  const Range = require( 'DOT/Range' );
  const StringProperty = require( 'AXON/StringProperty' );
  const SynthesisEquation = require( 'BALANCING_CHEMICAL_EQUATIONS/common/model/SynthesisEquation' );

  // constants
  /*
   * Strategies for selecting the "balanced representation" that is displayed by the "Not Balanced" popup.
   * This is a map from level to strategy.
   */
  const BALANCED_REPRESENTATION_STRATEGIES = [

    // level 1
    () => BalancedRepresentation.BALANCE_SCALES,

    //level 2
    () => phet.joist.random.nextDouble() < 0.5 ? BalancedRepresentation.BALANCE_SCALES : BalancedRepresentation.BAR_CHARTS,

    // level 3
    () => BalancedRepresentation.BAR_CHARTS
  ];
  const POINTS_FIRST_ATTEMPT = 2;  // points to award for correct guess on 1st attempt
  const POINTS_SECOND_ATTEMPT = 1; // points to award for correct guess on 2nd attempt

  class GameModel {

    constructor() {

      /*
       * @public
       * The set of game states.
       * For lack of better names, the state names correspond to the main action that
       * the user can take in that state.  For example. the CHECK state is where the user
       * can enter coefficients and press the "Check" button to check their answer.
       */
      this.states = {
        LEVEL_SELECTION: 'LevelSelection', //level selection screen
        CHECK: 'Check',
        TRY_AGAIN: 'TryAgain',
        SHOW_ANSWER: 'ShowAnswer',
        NEXT: 'Next',
        LEVEL_COMPLETED: 'LevelCompleted' //reward node
      };

      // @public (read-only) constants
      this.COEFFICENTS_RANGE = new Range( 0, 7 ); // Range of possible equation coefficients
      this.LEVELS_RANGE = new Range( 0, 2 ); // Levels 1-2-3, counting from 0

      // @public
      this.stateProperty = new StringProperty( this.states.LEVEL_SELECTION );
      // level of the current game
      this.levelProperty = new NumberProperty( 0, { numberType: 'Integer' } );
      // how many points the user has earned for the current game
      this.pointsProperty = new NumberProperty( 0, { numberType: 'Integer' } );
      // number of challenges in the current game
      this.numberOfEquationsProperty = new NumberProperty( 0, { numberType: 'Integer' } );
      // any non-null {Equation} will do here
      this.currentEquationProperty = new Property( SynthesisEquation.create_N2_3H2_2NH3() );
      // index of the current challenge that the user is working on
      this.currentEquationIndexProperty = new NumberProperty( 0, { numberType: 'Integer' } );

      this.equations = []; // @public array of Equation
      this.timer = new GameTimer(); // @public
      this.attempts = 0; // @private how many attempts the user has made at solving the current challenge
      this.currentPoints = 0; // @public how many points were earned for the current challenge
      this.balancedRepresentation = null; // @public which representation to use in the "Not Balanced" popup
      this.isNewBestTime = false; // @public is the time for this game a new best time?

      this.bestTimeProperties = [];// @public {Property.<number>[]} best times in ms, indexed by level
      this.bestScoreProperties = []; // @public {Property.<number>[]} best scores, indexed by level
      for ( let i = this.LEVELS_RANGE.min; i <= this.LEVELS_RANGE.max; i++ ) {
        this.bestTimeProperties[ i ] = new NumberProperty( 0, { numberType: 'Integer' } );
        this.bestScoreProperties[ i ] = new NumberProperty( 0, { numberType: 'Integer' } );
      }
    }

    // @public
    reset() {
      this.stateProperty.reset();
      this.levelProperty.reset();
      this.pointsProperty.reset();
      this.numberOfEquationsProperty.reset();
      this.currentEquationProperty.reset();
      this.currentEquationIndexProperty.reset();
      this.bestTimeProperties.forEach( bestTimeProperty => bestTimeProperty.reset() );
      this.bestScoreProperties.forEach( bestScoreProperty => bestScoreProperty.reset() );
    }

    /**
     * Called when the user presses a level-selection button.
     * @public
     */
    startGame() {

      const level = this.levelProperty.get();

      // create a set of challenges
      this.equations = GameFactory.createEquations( level );

      // initialize simple fields
      this.attempts = 0;
      this.currentPoints = 0;
      this.isNewBestTime = false;
      this.balancedRepresentation = BALANCED_REPRESENTATION_STRATEGIES[ level ]();
      this.timer.restart();

      // initialize properties
      this.currentEquationIndexProperty.set( 0 );
      this.currentEquationProperty.set( this.equations[ this.currentEquationIndexProperty.get() ] );
      this.numberOfEquationsProperty.set( this.equations.length );
      this.pointsProperty.set( 0 );
      this.stateProperty.set( this.states.CHECK );
    }

    /**
     * Called when the user presses the "Check" button.
     * @public
     */
    check() {
      this.attempts++;

      if ( this.currentEquationProperty.get().balancedAndSimplified ) {
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
        this.pointsProperty.set( this.pointsProperty.get() + this.currentPoints );
        this.stateProperty.set( this.states.NEXT );

        if ( this.currentEquationIndexProperty.get() === this.equations.length - 1 ) {
          this.endGame();
        }
      }
      else if ( this.attempts < 2 ) {
        this.stateProperty.set( this.states.TRY_AGAIN );
      }
      else {
        if ( this.currentEquationIndexProperty.get() === this.equations.length - 1 ) {
          this.endGame();
        }
        this.stateProperty.set( this.states.SHOW_ANSWER );
      }
    }

    /**
     * When a game ends, stop the timer and (if perfect score) set the new best time.
     * @private
     */
    endGame() {

      this.timer.stop();

      const level = this.levelProperty.get();
      const points = this.pointsProperty.get();

      //check for new best score
      if ( points > this.bestScoreProperties[ level ].get() ) {
        this.bestScoreProperties[ level ].set( points );
      }

      // check for new best time
      const previousBestTime = this.bestTimeProperties[ level ].get();
      if ( this.isPerfectScore() && ( previousBestTime === 0 || this.timer.elapsedTimeProperty.value < previousBestTime ) ) {
        this.isNewBestTime = true;
        this.bestTimeProperties[ level ].set( this.timer.elapsedTimeProperty.value );
      }
    }

    /**
     * Called when the user presses the "Try Again" button.
     * @public
     */
    tryAgain() {
      this.stateProperty.set( this.states.CHECK );
    }

    /**
     * Called when the user presses the "Show Answer" button.
     * @public
     */
    showAnswer() {
      this.stateProperty.set( this.states.NEXT );
    }

    /**
     * Gets the number of equations for a specified level.
     * @param level
     * @returns {number}
     * @public
     */
    getNumberOfEquations( level ) {
      return GameFactory.getNumberOfEquations( level );
    }

    /**
     * Gets the number of points in a perfect score for a specified level.
     * A perfect score is obtained when the user balances every equation correctly on the first attempt.
     * @param level
     * @returns {number}
     * @public
     */
    getPerfectScore( level ) {
      return this.getNumberOfEquations( level ) * POINTS_FIRST_ATTEMPT;
    }

    /**
     * Is the current score a perfect score?
     * This can be called at any time during the game, but can't possibly
     * return true until the game has been completed.
     * @returns {boolean}
     * @public
     */
    isPerfectScore() {
      return this.pointsProperty.get() === this.getPerfectScore( this.levelProperty.get() );
    }

    /**
     * Called when the user presses the "Start Over" button.
     * @public
     */
    newGame() {
      this.stateProperty.set( this.states.LEVEL_SELECTION );
      this.timer.restart();
    }

    /**
     * Called when the user presses the "Next" button.
     * @public
     */
    next() {
      if ( this.currentEquationIndexProperty.get() < this.equations.length - 1 ) {
        this.attempts = 0;
        this.currentPoints = 0;
        this.balancedRepresentation = BALANCED_REPRESENTATION_STRATEGIES[ this.levelProperty.get() ]();
        this.currentEquationIndexProperty.set( this.currentEquationIndexProperty.get() + 1 );
        this.currentEquationProperty.set( this.equations[ this.currentEquationIndexProperty.get() ] );
        this.stateProperty.set( this.states.CHECK );
      }
      else {
        this.stateProperty.set( this.states.LEVEL_COMPLETED );
      }
    }
  }

  return balancingChemicalEquations.register( 'GameModel', GameModel );
} );