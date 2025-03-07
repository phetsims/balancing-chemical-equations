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
import dotRandom from '../../../../dot/js/dotRandom.js';
import Range from '../../../../dot/js/Range.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import GameTimer from '../../../../vegas/js/GameTimer.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import BCEQueryParameters from '../../common/BCEQueryParameters.js';
import { BalancedRepresentation } from '../../common/model/BalancedRepresentation.js';
import Equation from '../../common/model/Equation.js';
import SynthesisEquation from '../../common/model/SynthesisEquation.js';
import GameFactory from './GameFactory.js';
import { GameState, GameStateValues } from './GameState.js';
import GameLevel from './GameLevel.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';

const POINTS_FIRST_ATTEMPT = 2;  // points to award for correct guess on 1st attempt
const POINTS_SECOND_ATTEMPT = 1; // points to award for correct guess on 2nd attempt

export default class GameModel {

  public readonly levels: GameLevel[];
  public readonly levelProperty: Property<GameLevel>; // the selected game level
  public readonly levelNumberProperty: TReadOnlyProperty<number>; // number of the selected game level

  public readonly stateProperty: StringUnionProperty<GameState>; // state of the game

  public readonly coefficientsRange: Range;
  public readonly pointsProperty: Property<number>; // how many points the user has earned for the current game
  private equations: Equation[];
  public readonly numberOfEquationsProperty: Property<number>; // number of challenges in the current game
  public readonly currentEquationProperty: Property<Equation>; // current challenge/Equation
  public readonly currentEquationIndexProperty: Property<number>; // index of the current challenge that the user is working on
  public readonly timer: GameTimer;

  private attempts: number; // how many attempts the user has made at solving the current challenge
  public currentPoints: number; // how many points were earned for the current challenge
  public balancedRepresentation: BalancedRepresentation; // which representation to use in the "Not Balanced" popup
  public isNewBestTime: boolean; // is the time for this game a new best time?

  public constructor( tandem: Tandem ) {

    this.levels = [
      new GameLevel( {
        levelNumber: 1,
        balancedRepresentation: () => 'balanceScales',
        tandem: tandem.createTandem( 'level1' )
      } ),
      new GameLevel( {
        levelNumber: 2,
        balancedRepresentation: () => dotRandom.nextDouble() < 0.5 ? 'balanceScales' : 'barCharts',
        tandem: tandem.createTandem( 'level2' )
      } ),
      new GameLevel( {
        levelNumber: 3,
        balancedRepresentation: () => 'barCharts',
        tandem: tandem.createTandem( 'level3' )
      } )
    ];

    this.levelProperty = new Property<GameLevel>( this.levels[ 0 ], {
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
      phetioReadOnly: true
    } );

    this.coefficientsRange = new Range( 0, 7 ); // Range of possible equation coefficients

    this.pointsProperty = new NumberProperty( 0, { numberType: 'Integer' } );

    this.equations = [];

    this.numberOfEquationsProperty = new NumberProperty( 0, { numberType: 'Integer' } );

    this.currentEquationProperty = new Property( SynthesisEquation.create_N2_3H2_2NH3() ); // any non-null Equation will do here

    this.currentEquationIndexProperty = new NumberProperty( 0, { numberType: 'Integer' } );

    this.timer = new GameTimer();
    this.attempts = 0;
    this.currentPoints = 0;
    this.balancedRepresentation = 'none';
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
        GameFactory.createEquations( level.levelNumber );
      }
      console.log( `Level ${level.levelNumber} has been verified by creating ${iterations} challenges.` );
    } );
  }

  public reset(): void {
    this.levels.forEach( level => level.reset() );
    this.levelProperty.reset();
    this.stateProperty.reset();
    this.pointsProperty.reset();
    this.numberOfEquationsProperty.reset();
    this.currentEquationProperty.reset();
    this.currentEquationIndexProperty.reset();
  }

  /**
   * Called when the user presses a level-selection button.
   */
  public startGame(): void {

    // level is 1-based numbering
    const level = this.levelProperty.value;

    // create a set of challenges
    this.equations = GameFactory.createEquations( level.levelNumber );

    // initialize simple fields
    this.attempts = 0;
    this.currentPoints = 0;
    this.isNewBestTime = false;
    this.balancedRepresentation = level.balancedRepresentation();
    this.timer.restart();

    // initialize Properties
    this.currentEquationIndexProperty.value = 0;
    this.currentEquationProperty.value = this.equations[ this.currentEquationIndexProperty.value ];
    this.numberOfEquationsProperty.value = this.equations.length;
    this.pointsProperty.value = 0;
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
        this.currentPoints = POINTS_FIRST_ATTEMPT;
      }
      else if ( this.attempts === 2 ) {
        this.currentPoints = POINTS_SECOND_ATTEMPT;
      }
      else {
        this.currentPoints = 0;
      }
      this.pointsProperty.value = this.pointsProperty.value + this.currentPoints;
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

    const level = this.levelProperty.value; // 1-based numbering
    const points = this.pointsProperty.value;

    // Check for new best score.
    if ( points > level.bestScoreProperty.value ) {
      level.bestScoreProperty.value = points;
    }

    // Check for new best time.
    const previousBestTime = level.bestTimeProperty.value;
    if ( this.isPerfectScore() && ( previousBestTime === 0 || this.timer.elapsedTimeProperty.value < previousBestTime ) ) {
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
   * Gets the number of equations for a specified level.
   */
  public getNumberOfEquations( level: GameLevel ): number {
    return GameFactory.getNumberOfEquations( level.levelNumber );
  }

  /**
   * Gets the number of points in a perfect score for a specified level.
   * A perfect score is obtained when the user balances every equation correctly on the first attempt.
   */
  public getPerfectScore( level: GameLevel ): number {
    return this.getNumberOfEquations( level ) * POINTS_FIRST_ATTEMPT;
  }

  /**
   * Is the current score a perfect score?
   * This can be called at any time during the game, but can't possibly return true until the game has been completed.
   */
  public isPerfectScore(): boolean {
    return this.pointsProperty.value === this.getPerfectScore( this.levelProperty.value );
  }

  /**
   * Called when the user presses the "Start Over" button.
   */
  public newGame(): void {
    this.stateProperty.value = 'levelSelection';
    this.timer.restart();
  }

  /**
   * Called when the user presses the "Next" button.
   */
  public next(): void {
    if ( this.currentEquationIndexProperty.value < this.equations.length - 1 ) {
      this.attempts = 0;
      this.currentPoints = 0;
      this.balancedRepresentation = this.levelProperty.value.balancedRepresentation();
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