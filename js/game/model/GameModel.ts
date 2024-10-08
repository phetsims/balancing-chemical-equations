// Copyright 2014-2024, University of Colorado Boulder

/**
 * Top-level model for the 'Game' screen.
 *
 * @author Vasily Shakhov (MLearner)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import Range from '../../../../dot/js/Range.js';
import GameTimer from '../../../../vegas/js/GameTimer.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import { BalancedRepresentation } from '../../common/model/BalancedRepresentation.js';
import SynthesisEquation from '../../common/model/SynthesisEquation.js';
import GameFactory from './GameFactory.js';
import { GameState, GameStateValues } from './GameState.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Equation from '../../common/model/Equation.js';
import StringUnionProperty from '../../../../axon/js/StringUnionProperty.js';

/*
 * Strategies for selecting the "balanced representation" that is displayed by the "Not Balanced" popup.
 * This is a map from level to strategy.
 */
const BALANCED_REPRESENTATION_STRATEGIES: ( () => BalancedRepresentation )[] = [

  // level 1
  () => 'balanceScales',

  // level 2
  () => dotRandom.nextDouble() < 0.5 ? 'balanceScales' : 'barCharts',

  // level 3
  () => 'barCharts'
];
const POINTS_FIRST_ATTEMPT = 2;  // points to award for correct guess on 1st attempt
const POINTS_SECOND_ATTEMPT = 1; // points to award for correct guess on 2nd attempt

export default class GameModel {

  public readonly stateProperty: StringUnionProperty<GameState>; // state of the game
  public readonly levelRange: Range;
  public readonly levelProperty: Property<number>; // level of the current game
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
  public readonly bestTimeProperties: Property<number>[]; // best times in ms, indexed by level
  public readonly bestScoreProperties: Property<number>[]; // best scores, indexed by level

  public constructor( tandem: Tandem ) {

    this.stateProperty = new StringUnionProperty( 'levelSelection', {
      validValues: GameStateValues,
      tandem: tandem.createTandem( 'stateProperty' ),
      phetioReadOnly: true
    } );

    this.levelRange = new Range( 1, 3 ); // level uses 1-based numbering

    this.levelProperty = new NumberProperty( 1, {
      numberType: 'Integer',
      range: this.levelRange,
      tandem: tandem.createTandem( 'levelProperty' ),
      phetioReadOnly: true //TODO https://github.com/phetsims/balancing-chemical-equations/issues/160 Make this settable.
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

    this.bestTimeProperties = [];
    this.bestScoreProperties = [];
    for ( let i = 0; i < this.levelRange.max; i++ ) {
      this.bestTimeProperties[ i ] = new NumberProperty( 0, { numberType: 'Integer' } );
      this.bestScoreProperties[ i ] = new NumberProperty( 0, { numberType: 'Integer' } );
    }
  }

  public reset(): void {
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
   */
  public startGame(): void {

    // level is 1-based numbering
    const level = this.levelProperty.value;

    // create a set of challenges
    this.equations = GameFactory.createEquations( level );

    // initialize simple fields
    this.attempts = 0;
    this.currentPoints = 0;
    this.isNewBestTime = false;
    this.balancedRepresentation = BALANCED_REPRESENTATION_STRATEGIES[ level - 1 ]();
    this.timer.restart();

    // initialize properties
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

    if ( this.currentEquationProperty.value.balancedAndSimplified ) {
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
    if ( points > this.bestScoreProperties[ level - 1 ].value ) {
      this.bestScoreProperties[ level - 1 ].value = points;
    }

    // Check for new best time.
    const previousBestTime = this.bestTimeProperties[ level - 1 ].value;
    if ( this.isPerfectScore() && ( previousBestTime === 0 || this.timer.elapsedTimeProperty.value < previousBestTime ) ) {
      this.isNewBestTime = true;
      this.bestTimeProperties[ level - 1 ].value = this.timer.elapsedTimeProperty.value;
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
  public getNumberOfEquations( level: number ): number {
    return GameFactory.getNumberOfEquations( level );
  }

  /**
   * Gets the number of points in a perfect score for a specified level.
   * A perfect score is obtained when the user balances every equation correctly on the first attempt.
   */
  public getPerfectScore( level: number ): number {
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
      this.balancedRepresentation = BALANCED_REPRESENTATION_STRATEGIES[ this.levelProperty.value - 1 ]();
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