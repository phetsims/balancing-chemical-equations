// Copyright 2014-2025, University of Colorado Boulder

/**
 * GameModel is the top-level model for the 'Game' screen.
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
import GameLevel1 from './GameLevel1.js';
import GameLevel2 from './GameLevel2.js';
import GameLevel3 from './GameLevel3.js';
import TModel from '../../../../joist/js/TModel.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import NullableIO from '../../../../tandem/js/types/NullableIO.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';

export default class GameModel implements TModel {

  public readonly levels: GameLevel[];

  // The selected game level. null means 'no selection' and causes the view to return to the level-selection UI.
  public readonly levelProperty: Property<GameLevel | null>;

  // state of the game
  private readonly _stateProperty: StringUnionProperty<GameState>;
  public readonly stateProperty: TReadOnlyProperty<GameState>;

  public readonly coefficientsRange: Range;
  public readonly scoreProperty: Property<number>; // the score for the current game
  private equations: Equation[];
  public readonly numberOfEquationsProperty: Property<number>; // number of challenges in the current game
  public readonly currentEquationProperty: Property<Equation>; // current challenge/Equation
  public readonly currentEquationIndexProperty: Property<number>; // index of the current challenge that the user is working on

  public readonly timer: GameTimer;
  public readonly timerEnabledProperty: Property<boolean>;

  private attempts: number; // how many attempts the user has made at solving the current challenge
  public currentPoints: number; // how many points were earned for the current challenge
  public isNewBestTime: boolean; // is the time for this game a new best time?

  public constructor( tandem: Tandem ) {

    this.levels = [
      new GameLevel1( tandem.createTandem( 'level1' ) ),
      new GameLevel2( tandem.createTandem( 'level2' ) ),
      new GameLevel3( tandem.createTandem( 'level3' ) )
    ];

    this.levelProperty = new Property<GameLevel | null>( null, {
      validValues: [ ...this.levels, null ],
      tandem: tandem.createTandem( 'levelProperty' ),
      phetioDocumentation: 'The selected level in the game. null means that no level is selected.',
      phetioFeatured: true,
      phetioValueType: NullableIO( GameLevel.GameLevelIO )
    } );

    this._stateProperty = new StringUnionProperty( 'levelSelection', {
      validValues: GameStateValues,
      tandem: tandem.createTandem( 'stateProperty' ),
      phetioDocumentation: 'For internal use only.',
      phetioReadOnly: true
    } );
    this.stateProperty = this._stateProperty;

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

    const timerTandem = tandem.createTandem( 'timer' );
    this.timer = new GameTimer( timerTandem );

    this.timerEnabledProperty = new BooleanProperty( false, {
      tandem: timerTandem.createTandem( 'enabledProperty' ),
      phetioFeatured: true
    } );

    this.attempts = 0;
    this.currentPoints = 0;
    this.isNewBestTime = false;

    this.levelProperty.link( level => level ? this.startGame() : this.startOver() );

    if ( BCEQueryParameters.verifyGame ) {
      this.verifyGame();
    }
  }

  public reset(): void {
    this.levels.forEach( level => level.reset() );
    this.levelProperty.reset();
    this._stateProperty.reset();
    this.scoreProperty.reset();
    this.numberOfEquationsProperty.reset();
    this.currentEquationProperty.reset();
    this.currentEquationIndexProperty.reset();
    this.timer.reset();
    this.timerEnabledProperty.reset();
  }

  private setState( value: GameState ): void {
    this._stateProperty.value = value;
  }

  /**
   * Called before the first challenge has been played.
   */
  private startGame(): void {

    const level = this.levelProperty.value!;
    assert && assert( level );

    // create a set of challenges
    this.equations = level.createEquations();

    // initialize simple fields
    this.attempts = 0;
    this.currentPoints = 0;
    this.isNewBestTime = false;
    if ( this.timerEnabledProperty.value ) {
      this.timer.start();
    }

    // initialize Properties
    this.currentEquationIndexProperty.value = 0;
    this.currentEquationProperty.value = this.equations[ this.currentEquationIndexProperty.value ];
    this.numberOfEquationsProperty.value = this.equations.length;
    this.scoreProperty.value = 0;
    this.setState( 'check' );
  }

  /**
   * Called after the last challenge has been played.
   */
  private endGame(): void {

    this.timer.stop();

    const level = this.levelProperty.value!;
    assert && assert( level );

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
      this.setState( 'next' );

      if ( this.currentEquationIndexProperty.value === this.equations.length - 1 ) {
        this.endGame();
      }
    }
    else if ( this.attempts < 2 ) {
      this.setState( 'tryAgain' );
    }
    else {
      if ( this.currentEquationIndexProperty.value === this.equations.length - 1 ) {
        this.endGame();
      }
      this.setState( 'showAnswer' );
    }
  }

  /**
   * Called when the user presses the "Try Again" button.
   */
  public tryAgain(): void {
    this.setState( 'check' );
  }

  /**
   * Called when the user presses the "Show Answer" button.
   */
  public showAnswer(): void {
    this.setState( 'next' );
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
      this.setState( 'check' );
    }
    else {
      this.setState( 'levelCompleted' );
    }
  }

  /**
   * Called when the user presses the "Start Over" button, or when levelProperty is set to null.
   */
  public startOver(): void {
    this.levelProperty.value = null;
    this.setState( 'levelSelection' );
    this.timer.reset();
    this.scoreProperty.value = 0;
  }

  /**
   * Is the current score a perfect score?
   */
  public isPerfectScore(): boolean {
    const level = this.levelProperty.value;
    if ( level ) {
      return level.isPerfectScore( this.scoreProperty.value );
    }
    else {
      return false;
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
}

balancingChemicalEquations.register( 'GameModel', GameModel );