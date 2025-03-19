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
import Molecule from '../../common/model/Molecule.js';
import ArrayIO from '../../../../tandem/js/types/ArrayIO.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import isSettingPhetioStateProperty from '../../../../tandem/js/isSettingPhetioStateProperty.js';

const ATTEMPTS_RANGE = new Range( 0, 2 );

export default class GameModel implements TModel {

  public readonly levels: GameLevel[];

  // The selected game level. null means 'no selection' and causes the view to return to the level-selection UI.
  public readonly levelProperty: Property<GameLevel | null>;

  // State of the game.
  private readonly _stateProperty: StringUnionProperty<GameState>;
  public readonly stateProperty: TReadOnlyProperty<GameState>;

  // Range of all coefficients, for all challenges.
  public readonly coefficientsRange: Range;

  // The score for the current game that is being played.
  public readonly scoreProperty: Property<number>;

  // Challenges are a set of Equations to be balanced.
  private readonly challengesProperty: Property<Equation[]>;

  // Number of challenges in the current game
  public readonly numberOfChallengesProperty: TReadOnlyProperty<number>;

  // Index of the current challenge in this.challenges
  public readonly challengeIndexProperty: TReadOnlyProperty<number>;
  private readonly _challengeIndexProperty: Property<number>;

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

    this._stateProperty = new StringUnionProperty( 'levelSelection', {
      validValues: GameStateValues,
      tandem: tandem.createTandem( 'stateProperty' ),
      phetioDocumentation: 'For internal use only.',
      phetioReadOnly: true
    } );
    this.stateProperty = this._stateProperty;

    this.scoreProperty = new NumberProperty( 0, {
      numberType: 'Integer',
      range: new Range( 0, Infinity ), // because ?playAll affects the range
      tandem: tandem.createTandem( 'scoreProperty' ),
      phetioDocumentation: 'Score for the current level that is being played.',
      phetioFeatured: true,
      phetioReadOnly: true
    } );

    // The initial value of challengesProperty needs to be constant for PhET-iO, and non-empty for DerivedProperties
    // herein. So create one dummy challenge that will never be seen by the user. The dummy challenge unfortunately
    // must be PhET-iO instrumented, so it will appear in the PhET-iO Studio tree and PhET-iO API.
    const initialChallenges = [
      new SynthesisEquation( 1, Molecule.C, 1, Molecule.O2, 1, Molecule.CO2, this.coefficientsRange,
        tandem.createTandem( 'dummyChallenge' ) )
    ];

    this.challengesProperty = new Property<Equation[]>( initialChallenges, {
      tandem: tandem.createTandem( 'challengesProperty' ),
      phetioDocumentation: 'The current set of challenges being played.',
      phetioReadOnly: true,
      phetioFeatured: true,
      phetioValueType: ArrayIO( Equation.EquationIO )
    } );

    this.numberOfChallengesProperty = new DerivedProperty( [ this.challengesProperty ], challenges => challenges.length );

    this._challengeIndexProperty = new NumberProperty( 0, {
      numberType: 'Integer',
      tandem: tandem.createTandem( 'challengeIndexProperty' ),
      phetioFeatured: true,
      phetioReadOnly: true
    } );
    this.challengeIndexProperty = this._challengeIndexProperty;

    this.challengesProperty.lazyLink( () => {
      if ( !isSettingPhetioStateProperty.value ) {
        this._challengeIndexProperty.value = 0;
      }
    } );

    // Consider that this derivation may go through intermediate states when PhET-iO state is restored,
    // depending on the order in which the dependencies are set.
    this.challengeProperty = new DerivedProperty( [ this.challengesProperty, this.challengeIndexProperty ],
      ( challenges, challengeIndex ) => ( challengeIndex >= 0 && challenges.length > challengeIndex ) ? challenges[ challengeIndex ] : challenges[ 0 ], {
        tandem: tandem.createTandem( 'challengeProperty' ),
        phetioDocumentation: 'The challenge being played.',
        phetioFeatured: true,
        phetioValueType: Equation.EquationIO
      } );

    // When the challenge changes, reset it to ensure that coefficients are zero, in case the set of challenges
    // contains the same equation instance more than once.
    this.challengeProperty.link( challenge => {
      if ( !isSettingPhetioStateProperty.value ) {
        challenge.reset();
      }
    } );

    const timerTandem = tandem.createTandem( 'timer' );
    this.timer = new GameTimer( timerTandem );

    this.timerEnabledProperty = new BooleanProperty( false, {
      tandem: timerTandem.createTandem( 'enabledProperty' ),
      phetioFeatured: true
    } );

    this.attemptsProperty = new NumberProperty( 0, {
      numberType: 'Integer',
      range: ATTEMPTS_RANGE,
      tandem: tandem.createTandem( 'attemptsProperty' ),
      phetioDocumentation: 'The number of attempts to solve the current challenge.',
      phetioReadOnly: true
    } );

    this.pointsProperty = new NumberProperty( 0, {
      numberType: 'Integer',
      range: new Range( 0, ATTEMPTS_RANGE.max * GameLevel.POINTS_FIRST_ATTEMPT ),
      tandem: tandem.createTandem( 'pointsProperty' ),
      phetioDocumentation: 'Points that have been earned for the current challenge.',
      phetioReadOnly: true
    } );

    this.isNewBestTime = false;

    this.levelProperty.link( level => level ? this.startGame() : this.startOver() );

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
    this._stateProperty.reset();
    this._challengeIndexProperty.reset();
    this.timerEnabledProperty.reset();
  }

  /**
   * Resets only the things that should be reset when a game is started, or when in the 'levelSelection' state.
   */
  private resetToStart(): void {
    this.isNewBestTime = false;
    this.attemptsProperty.reset();
    this.pointsProperty.reset();
    this.scoreProperty.reset();
    this.timer.reset();
  }

  /**
   * Convenience method for setting the game's state.
   */
  private setState( value: GameState ): void {
    this._stateProperty.value = value;
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
    this.attemptsProperty.value++;

    if ( this.challengeProperty.value.isBalancedAndSimplified ) {
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
      this.setState( 'next' );

      if ( this.challengeIndexProperty.value === this.challengesProperty.value.length - 1 ) {
        this.endGame();
      }
    }
    else if ( this.attemptsProperty.value < 2 ) {
      this.setState( 'tryAgain' );
    }
    else {
      if ( this.challengeIndexProperty.value === this.challengesProperty.value.length - 1 ) {
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
    if ( this.challengeIndexProperty.value < this.challengesProperty.value.length - 1 ) {
      this.attemptsProperty.value = 0;
      this.pointsProperty.value = 0;
      this._challengeIndexProperty.value++;
      this.setState( 'check' );
    }
    else {
      this.setState( 'levelCompleted' );
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
    this.setState( 'levelSelection' );
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