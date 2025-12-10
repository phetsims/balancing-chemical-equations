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
import LevelSelectionButton from '../../../../vegas/js/LevelSelectionButton.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import BCEQueryParameters from '../../common/BCEQueryParameters.js';
import Equation from '../../common/model/Equation.js';
import { GameState, GameStateValues, isValidGameStateTransition } from './GameState.js';
import GameLevel from './GameLevel.js';
import GameLevel1 from './GameLevel1.js';
import GameLevel2 from './GameLevel2.js';
import GameLevel3 from './GameLevel3.js';
import TModel from '../../../../joist/js/TModel.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import NullableIO from '../../../../tandem/js/types/NullableIO.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import ArrayIO from '../../../../tandem/js/types/ArrayIO.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import isSettingPhetioStateProperty from '../../../../tandem/js/isSettingPhetioStateProperty.js';
import ReadOnlyProperty from '../../../../axon/js/ReadOnlyProperty.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';

const ATTEMPTS_RANGE = new Range( 0, 2 );

export default class GameModel implements TModel {

  public readonly levels: GameLevel[];

  // The selected game level. null means 'no selection' and causes the view to return to the level-selection UI.
  public readonly levelProperty: Property<GameLevel | null>;

  // Number of the game level that the user is playing. Uses 1-based numbering. Zero means no level is currently being played.
  public readonly levelNumberProperty: ReadOnlyProperty<number>;

  // State of the game. See GameState.ts for documentation of possible state transitions.
  private readonly _gameStateProperty: StringUnionProperty<GameState>;
  public readonly gameStateProperty: TReadOnlyProperty<GameState>;

  // Range of all coefficients, for all challenges.
  public readonly coefficientsRange: Range;

  // The score for the current game that is being played.
  public readonly scoreProperty: Property<number>;

  // Challenges are a set of Equations to be balanced.
  private readonly challengesProperty: Property<Equation[]>;

  // Number of challenges in the current game
  public readonly numberOfChallengesProperty: ReadOnlyProperty<number>;

  // The current challenge in this.challenges, using 1-based index, as shown in the Game status bar.
  public readonly challengeNumberProperty: ReadOnlyProperty<number>;
  private readonly _challengeNumberProperty: Property<number>;

  // Current challenge to be solved
  public readonly challengeProperty: TReadOnlyProperty<Equation>;

  public readonly timer: GameTimer;
  public readonly timerEnabledProperty: Property<boolean>;

  // The number of attempts the user has made at solving the current challenge.
  private readonly attemptsProperty: Property<number>;

  // The number of points that were earned for the current challenge.
  public readonly pointsProperty: Property<number>;

  // Whether the time for this game a new best time.
  public isNewBestTime: boolean;

  public constructor( tandem: Tandem ) {

    this.coefficientsRange = new Range( 0, 7 );

    this.levels = [
      new GameLevel1( this.coefficientsRange, tandem.createTandem( 'level1' ) ),
      new GameLevel2( this.coefficientsRange, tandem.createTandem( 'level2' ) ),
      new GameLevel3( this.coefficientsRange, tandem.createTandem( 'level3' ) )
    ];

    this.levelProperty = new Property<GameLevel | null>( null, {
      validValues: [ ...this.levels, null ],
      tandem: tandem.createTandem( 'levelProperty' ),
      phetioDocumentation: 'The selected level in the game. null means that no level is selected.',
      phetioFeatured: true,
      phetioValueType: NullableIO( GameLevel.GameLevelIO )
    } );

    this.levelNumberProperty = new DerivedProperty( [ this.levelProperty ], level => level ? level.levelNumber : 0, {
      tandem: tandem.createTandem( 'levelNumberProperty' ),
      phetioDocumentation: 'Number of the selected level in the game. Zero means that no level is selected.',
      phetioFeatured: true,
      phetioValueType: NumberIO
    } );

    this._gameStateProperty = new StringUnionProperty( 'levelSelection', {
      validValues: GameStateValues,
      tandem: tandem.createTandem( 'gameStateProperty' ),
      phetioDocumentation: 'For internal use only.',
      phetioReadOnly: true
    } );
    this.gameStateProperty = this._gameStateProperty;

    // Validate game state transitions.
    assert && this.gameStateProperty.lazyLink( ( toState, fromState ) => {
      if ( !isSettingPhetioStateProperty.value ) {
        assert && assert( isValidGameStateTransition( fromState, toState ), `invalid transition: ${fromState} to ${toState}` );
      }
    } );

    this.scoreProperty = new NumberProperty( 0, {
      numberType: 'Integer',
      range: new Range( 0, Infinity ), // because ?playAll affects the range
      tandem: tandem.createTandem( 'scoreProperty' ),
      phetioDocumentation: 'Score for the current level that is being played.',
      phetioFeatured: true,
      phetioReadOnly: true
    } );

    // Any initial value if OK here, as long as the array is not empty, the challenges are instrumented,
    // and the initial value is not randomly generated (which would break the PhET-iO API).
    this.challengesProperty = new Property<Equation[]>( [ this.levels[ 0 ].getEquation( 0 ) ], {
      isValidValue: challenges => challenges.length > 0,
      tandem: tandem.createTandem( 'challengesProperty' ),
      phetioDocumentation: 'The current set of challenges being played.',
      phetioReadOnly: true,
      phetioFeatured: true,
      phetioValueType: ArrayIO( Equation.EquationIO )
    } );

    this.numberOfChallengesProperty = new DerivedProperty( [ this.challengesProperty ], challenges => challenges.length );

    this._challengeNumberProperty = new NumberProperty( 1, {
      numberType: 'Integer',
      range: new Range( 1, Infinity ), // Infinity because ?playAll plays all possible challenges.
      tandem: tandem.createTandem( 'challengeNumberProperty' ),
      phetioDocumentation: 'The challenge number shown in the status bar. Indicates how far the user has progressed through a level.',
      phetioReadOnly: true
    } );
    this.challengeNumberProperty = this._challengeNumberProperty;

    this.challengesProperty.lazyLink( () => {
      if ( !isSettingPhetioStateProperty.value ) {
        this._challengeNumberProperty.value = 1;
      }
    } );

    // Consider that this derivation may go through intermediate states when PhET-iO state is restored,
    // depending on the order in which the dependencies are set.
    this.challengeProperty = new DerivedProperty( [ this.challengesProperty, this.challengeNumberProperty ],
      ( challenges, challengeNumber ) => ( challengeNumber >= 1 && challenges.length >= challengeNumber ) ? challenges[ challengeNumber - 1 ] : challenges[ 0 ], {
        tandem: tandem.createTandem( 'challengeProperty' ),
        phetioDocumentation: 'The challenge being played.',
        phetioFeatured: true,
        phetioValueType: Equation.EquationIO
      } );
    phet.log && this.challengeProperty.lazyLink( challenge => phet.log( `Playing ${challenge.tandem.name}, ${challenge.toString()}` ) );

    // When the challenge changes, reset it to ensure that coefficients are zero. It may have been previously
    // selected from the pool, and have coefficients from previous game play.
    this.challengeProperty.link( challenge => {
      if ( !isSettingPhetioStateProperty.value ) {
        challenge.reset();
      }
    } );

    const timerTandem = tandem.createTandem( 'timer' );
    this.timer = new GameTimer( timerTandem );

    this.timerEnabledProperty = new BooleanProperty( false, {
      tandem: timerTandem.createTandem( 'enabledProperty' ),
      phetioDocumentation: 'Whether the timer will run while playing a level.',
      phetioFeatured: true
    } );

    this.attemptsProperty = new NumberProperty( 0, {
      numberType: 'Integer',
      range: ATTEMPTS_RANGE,
      tandem: tandem.createTandem( 'attemptsProperty' ),
      phetioDocumentation: 'The number of attempts to solve the current challenge.',
      phetioFeatured: true,
      phetioReadOnly: true
    } );

    this.pointsProperty = new NumberProperty( 0, {
      numberType: 'Integer',
      range: new Range( 0, GameLevel.POINTS_FIRST_ATTEMPT ),
      tandem: tandem.createTandem( 'pointsProperty' ),
      phetioDocumentation: 'Points that have been earned for the current challenge.',
      phetioFeatured: true,
      phetioReadOnly: true
    } );

    this.isNewBestTime = false;

    this.levelProperty.link( level => {
      if ( !isSettingPhetioStateProperty.value ) {
        level ? this.startGame() : this.startOver();
      }
    } );

    if ( BCEQueryParameters.verifyGame ) {
      this.verifyGame();
    }
  }

  /**
   * Does a full reset of the Game model.
   */
  public reset(): void {
    this.resetToStart();
    this.levels.forEach( level => level.reset() );
    this.levelProperty.reset();
    this._gameStateProperty.reset();
    this._challengeNumberProperty.reset();
    this.timerEnabledProperty.reset();
  }

  /**
   * Resets only the things that should be reset when a game is started, or when in the 'levelSelection' game state.
   */
  private resetToStart(): void {
    this.isNewBestTime = false;
    this.attemptsProperty.reset();
    this.pointsProperty.reset();
    this.scoreProperty.reset();
    this.timer.reset();
  }

  /**
   * Convenience method for setting the game state.
   */
  private setGameState( value: GameState ): void {
    this._gameStateProperty.value = value;
  }

  /**
   * Called before the first challenge has been played.
   */
  private startGame(): void {

    const level = this.levelProperty.value!;
    assert && assert( level );

    this.resetToStart();

    // Create a set of challenges.
    this.challengesProperty.value = level.getChallenges();

    // Start the timer.
    if ( this.timerEnabledProperty.value ) {
      this.timer.start();
    }

    this.setGameState( 'check' );
  }

  /**
   * Called after the last challenge has been played.
   */
  private endGame(): void {

    this.timer.stop();

    const level = this.levelProperty.value!;
    assert && assert( level );

    // Update best score and best time if needed.
    const points = this.scoreProperty.value;
    const time = this.timer.elapsedTimeProperty.value;
    this.isNewBestTime = LevelSelectionButton.tryUpdateScoreAndBestTime( points, time, level.bestScoreProperty, level.bestTimeProperty );
  }

  /**
   * Called when the user presses the "Check" button.
   */
  public check(): void {
    this.attemptsProperty.value++;

    if ( this.challengeProperty.value.isSimplifiedProperty.value ) {
      // award points
      if ( this.attemptsProperty.value === 1 ) {
        this.pointsProperty.value = GameLevel.POINTS_FIRST_ATTEMPT;
      }
      else if ( this.attemptsProperty.value === 2 ) {
        this.pointsProperty.value = GameLevel.POINTS_SECOND_ATTEMPT;
      }
      else {
        this.pointsProperty.value = 0;
      }
      this.scoreProperty.value += this.pointsProperty.value;
      this.setGameState( 'next' );

      if ( this.challengeNumberProperty.value === this.challengesProperty.value.length ) {
        this.endGame();
      }
    }
    else if ( this.attemptsProperty.value < 2 ) {
      this.setGameState( 'tryAgain' );
    }
    else {
      if ( this.challengeNumberProperty.value === this.challengesProperty.value.length ) {
        this.endGame();
      }
      this.setGameState( 'showAnswer' );
    }
  }

  /**
   * Called when the user presses the "Try Again" button.
   */
  public tryAgain(): void {
    this.setGameState( 'check' );
  }

  /**
   * Called when the user presses the "Show Answer" button.
   */
  public showAnswer(): void {
    this.setGameState( 'next' );
  }

  /**
   * Called when the user presses the "Next" button.
   */
  public next(): void {
    if ( this.challengeNumberProperty.value < this.challengesProperty.value.length ) {
      this.attemptsProperty.value = 0;
      this.pointsProperty.value = 0;
      this._challengeNumberProperty.value++;
      this.setGameState( 'check' );
    }
    else {
      this.setGameState( 'levelCompleted' );
    }
  }

  /**
   * Called when the user presses the "Skip" button, which is visible when running with ?showAnswers.
   * This is equivalent to pressing the "Next" button.
   */
  public skip(): void {
    this.next();
  }

  /**
   * Called when the user presses the "Start Over" button, or when levelProperty is set to null.
   */
  public startOver(): void {
    this.resetToStart();
    this.levelProperty.value = null;
    this.setGameState( 'levelSelection' );
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
   * Verifies challenge generation by creating lots of equation sets for each game level.
   * This test is performed when you run with ?verifyGame.
   */
  private verifyGame(): void {
    const iterations = 1000;
    this.levels.forEach( level => {
      for ( let i = 0; i < iterations; i++ ) {
        level.getChallenges();
      }
      console.log( `Level ${level.levelNumber} has been verified by creating ${iterations} challenges.` );
    } );
  }
}

balancingChemicalEquations.register( 'GameModel', GameModel );