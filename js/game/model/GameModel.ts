// Copyright 2014-2025, University of Colorado Boulder

/**
 * Top-level model for the 'Game' screen.
 *
 * @author Vasily Shakhov (MLearner)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import StringUnionProperty from '../../../../axon/js/StringUnionProperty.js';
import Range from '../../../../dot/js/Range.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import GameTimer from '../../../../vegas/js/GameTimer.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import BCEQueryParameters from '../../common/BCEQueryParameters.js';
import Equation from '../../common/model/Equation.js';
import SynthesisEquation from '../../common/model/SynthesisEquation.js';
import { GameState, GameStateValues } from './GameState.js';
import GameLevel from './GameLevel.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import GameLevel1 from './GameLevel1.js';
import GameLevel2 from './GameLevel2.js';
import GameLevel3 from './GameLevel3.js';
import TModel from '../../../../joist/js/TModel.js';

export default class GameModel implements TModel {

  public readonly levels: GameLevel[];
  public readonly levelProperty: Property<GameLevel>; // the selected game level
  public readonly levelNumberProperty: TReadOnlyProperty<number>; // number of the selected game level, 1-based

  public readonly stateProperty: StringUnionProperty<GameState>; // state of the game

  public readonly coefficientsRange: Range;
  public readonly scoreProperty: Property<number>; // the score for the current game
  private equations: Equation[];
  public readonly numberOfEquationsProperty: Property<number>; // number of challenges in the current game
  public readonly currentEquationProperty: Property<Equation>; // current challenge/Equation
  public readonly currentEquationIndexProperty: Property<number>; // index of the current challenge that the user is working on
  public readonly timer: GameTimer;

  private attempts: number; // how many attempts the user has made at solving the current challenge
  public currentPoints: number; // how many points were earned for the current challenge
  public isNewBestTime: boolean; // is the time for this game a new best time?

  public constructor( tandem: Tandem ) {

    this.levels = [
      new GameLevel1( tandem.createTandem( 'level1' ) ),
      new GameLevel2( tandem.createTandem( 'level2' ) ),
      new GameLevel3( tandem.createTandem( 'level3' ) )
    ];

    this.levelProperty = new Property<GameLevel>( this.levels[ 0 ], {
      validValues: this.levels,
      tandem: tandem.createTandem( 'levelProperty' ),
      phetioDocumentation: 'The selected level in the game.',
      phetioFeatured: true,
      phetioReadOnly: true,
      phetioValueType: GameLevel.GameLevelIO
    } );

    this.levelNumberProperty = new DerivedProperty( [ this.levelProperty ], level => level.levelNumber );

    this.stateProperty = new StringUnionProperty( 'levelSelection', {
      validValues: GameStateValues,
      tandem: tandem.createTandem( 'stateProperty' ),
      phetioDocumentation: 'State that the game is currently in.',
      phetioReadOnly: true
    } );

    this.coefficientsRange = new Range( 0, 7 ); // Range of possible equation coefficients

    this.scoreProperty = new NumberProperty( 0, {
      numberType: 'Integer',
      range: new Range( 0, Infinity ), // because ?playAll affects the range
      tandem: tandem.createTandem( 'scoreProperty' ),
      phetioFeatured: true,
      phetioReadOnly: true
    } );

    this.equations = [];

    this.numberOfEquationsProperty = new NumberProperty( 0, { numberType: 'Integer' } );

    this.currentEquationProperty = new Property( SynthesisEquation.create_N2_3H2_2NH3() ); // any non-null Equation will do here

    this.currentEquationIndexProperty = new NumberProperty( 0, { numberType: 'Integer' } );

    this.timer = new GameTimer();
    this.attempts = 0;
    this.currentPoints = 0;
    this.isNewBestTime = false;

    if ( BCEQueryParameters.verifyGame ) {
      this.verifyGame();
    }
  }

  /**
   * Verifies by creating lots of equation sets for each game level.
   * This test is performed when you run with ?verifyGame.
   */
  private verifyGame(): void {
    const iterations = 1000;
    this.levels.forEach( level => {
      for ( let i = 0; i < iterations; i++ ) {
        level.createEquations();
      }
      console.log( `Level ${level.levelNumber} has been verified by creating ${iterations} challenges.` );
    } );
  }

  public reset(): void {
    this.levels.forEach( level => level.reset() );
    this.levelProperty.reset();
    this.stateProperty.reset();
    this.scoreProperty.reset();
    this.numberOfEquationsProperty.reset();
    this.currentEquationProperty.reset();
    this.currentEquationIndexProperty.reset();
  }

  /**
   * Called when the user presses a level-selection button.
   */
  public startGame(): void {

    const level = this.levelProperty.value;

    // create a set of challenges
    this.equations = level.createEquations();

    // initialize simple fields
    this.attempts = 0;
    this.currentPoints = 0;
    this.isNewBestTime = false;
    this.timer.restart();

    // initialize Properties
    this.currentEquationIndexProperty.value = 0;
    this.currentEquationProperty.value = this.equations[ this.currentEquationIndexProperty.value ];
    this.numberOfEquationsProperty.value = this.equations.length;
    this.scoreProperty.value = 0;
    this.stateProperty.value = 'check';
  }

  /**
   * Called when the user presses the "Check" button.
   */
  public check(): void {
    this.attempts++;

    if ( this.currentEquationProperty.value.isBalancedAndSimplified ) {
      // award points
      if ( this.attempts === 1 ) {
        this.currentPoints = GameLevel.POINTS_FIRST_ATTEMPT;
      }
      else if ( this.attempts === 2 ) {
        this.currentPoints = GameLevel.POINTS_SECOND_ATTEMPT;
      }
      else {
        this.currentPoints = 0;
      }
      this.scoreProperty.value = this.scoreProperty.value + this.currentPoints;
      this.stateProperty.value = 'next';

      if ( this.currentEquationIndexProperty.value === this.equations.length - 1 ) {
        this.endGame();
      }
    }
    else if ( this.attempts < 2 ) {
      this.stateProperty.value = 'tryAgain';
    }
    else {
      if ( this.currentEquationIndexProperty.value === this.equations.length - 1 ) {
        this.endGame();
      }
      this.stateProperty.value = 'showAnswer';
    }
  }

  /**
   * When a game ends, stop the timer and (if perfect score) set the new best time.
   */
  private endGame(): void {

    this.timer.stop();

    const level = this.levelProperty.value;
    const points = this.scoreProperty.value;

    // Check for new best score.
    if ( points > level.bestScoreProperty.value ) {
      level.bestScoreProperty.value = points;
    }

    // Check for new best time.
    const previousBestTime = level.bestTimeProperty.value;
    if ( level.isPerfectScore( points ) && ( previousBestTime === 0 || this.timer.elapsedTimeProperty.value < previousBestTime ) ) {
      this.isNewBestTime = true;
      level.bestTimeProperty.value = this.timer.elapsedTimeProperty.value;
    }
  }

  /**
   * Called when the user presses the "Try Again" button.
   */
  public tryAgain(): void {
    this.stateProperty.value = 'check';
  }

  /**
   * Called when the user presses the "Show Answer" button.
   */
  public showAnswer(): void {
    this.stateProperty.value = 'next';
  }

  /**
   * Called when the user presses the "Start Over" button.
   */
  public newGame(): void {
    this.stateProperty.value = 'levelSelection';
    this.timer.restart();
  }

  /**
   * Is the current score a perfect score?
   * This can be called at any time during the game, but can't possibly return true until the game has been completed.
   */
  public isPerfectScore(): boolean {
    return this.levelProperty.value.isPerfectScore( this.scoreProperty.value );
  }

  /**
   * Called when the user presses the "Next" button.
   */
  public next(): void {
    if ( this.currentEquationIndexProperty.value < this.equations.length - 1 ) {
      this.attempts = 0;
      this.currentPoints = 0;
      this.currentEquationIndexProperty.value = this.currentEquationIndexProperty.value + 1;
      this.currentEquationProperty.value = this.equations[ this.currentEquationIndexProperty.value ];
      this.stateProperty.value = 'check';
    }
    else {
      this.stateProperty.value = 'levelCompleted';
    }
  }
}

balancingChemicalEquations.register( 'GameModel', GameModel );