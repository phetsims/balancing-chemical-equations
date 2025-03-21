// Copyright 2025, University of Colorado Boulder

/**
 * GameLevel is the base class for a level in the Game screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import ReferenceIO, { ReferenceIOState } from '../../../../tandem/js/types/ReferenceIO.js';
import Property from '../../../../axon/js/Property.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { BalancedRepresentation } from '../../common/model/BalancedRepresentation.js';
import optionize, { combineOptions } from '../../../../phet-core/js/optionize.js';
import Equation from '../../common/model/Equation.js';
import RandomStrategy from './RandomStrategy.js';
import BCEQueryParameters from '../../common/BCEQueryParameters.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Molecule from '../../common/model/Molecule.js';
import { AtomNodeOptions } from '../../../../nitroglycerin/js/nodes/AtomNode.js';
import BCEConstants from '../../common/BCEConstants.js';
import Range from '../../../../dot/js/Range.js';

type SelfOptions = {

  // 1-based numbering
  levelNumber: number;

  // Molecule that appears on the level-selection button for this game level.
  iconMolecule: Molecule;

  // Range of the coefficient in all equation terms.
  coefficientsRange: Range;

  // Gets the "balanced representation" that is displayed by the "Not Balanced" popup.
  getBalancedRepresentation: () => Exclude<BalancedRepresentation, 'none'>;

  // The pool of equations for the challenges.
  equationPool: Equation[];

  // Strategy for selecting a set of equations from the pool.
  equationSelectionStrategy: RandomStrategy;
};

type GameLevelOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class GameLevel extends PhetioObject {

  private static readonly CHALLENGES_PER_GAME = 5;

  public static readonly POINTS_FIRST_ATTEMPT = 2;  // points to award for correct guess on 1st attempt
  public static readonly POINTS_SECOND_ATTEMPT = 1; // points to award for correct guess on 2nd attempt

  protected static readonly EQUATION_POOL_TANDEM_NAME = 'equationPool';

  public readonly levelNumber: number;
  public readonly icon: Node;
  private readonly coefficientsRange: Range;
  public readonly getBalancedRepresentation: () => Exclude<BalancedRepresentation, 'none'>;
  private readonly equationPool: Equation[];
  private readonly equationSelectionStrategy: RandomStrategy;

  public readonly bestScoreProperty: Property<number>;
  public readonly bestTimeProperty: Property<number>;

  protected constructor( providedOptions: GameLevelOptions ) {

    const options = optionize<GameLevelOptions, SelfOptions, PhetioObjectOptions>()( {

      // PhetioObjectOptions
      isDisposable: false,
      phetioState: false,
      phetioType: GameLevel.GameLevelIO
    }, providedOptions );

    super( options );

    this.levelNumber = options.levelNumber;

    this.icon = options.iconMolecule.createNode( combineOptions<AtomNodeOptions>( {
      scale: 2
    }, BCEConstants.ATOM_NODE_OPTIONS ) );

    this.coefficientsRange = options.coefficientsRange;
    this.getBalancedRepresentation = options.getBalancedRepresentation;
    this.equationPool = options.equationPool;
    this.equationSelectionStrategy = options.equationSelectionStrategy;

    this.bestScoreProperty = new NumberProperty( 0, {
      numberType: 'Integer',
      tandem: options.tandem.createTandem( 'bestScoreProperty' ),
      phetioFeatured: true,
      phetioReadOnly: true
    } );

    this.bestTimeProperty = new NumberProperty( 0, {
      numberType: 'Integer',
      tandem: options.tandem.createTandem( 'bestTimeProperty' ),
      phetioFeatured: true,
      phetioReadOnly: true
    } );
  }

  public reset(): void {
    this.bestScoreProperty.reset();
    this.bestTimeProperty.reset();
  }

  /**
   * Gets an equation from the pool.
   */
  public getEquation( index: number ): Equation {
    assert && assert( index >= 0 && index < this.equationPool.length );
    return this.equationPool[ index ];
  }

  /**
   * Gets the number of equations for this level.
   */
  public getNumberOfChallenges(): number {
    return BCEQueryParameters.playAll ? this.equationPool.length : GameLevel.CHALLENGES_PER_GAME;
  }

  /**
   * Gets the number of points in a perfect score for this level.
   * A perfect score is obtained when the user balances every equation correctly on the first attempt.
   */
  public getPerfectScore(): number {
    return this.getNumberOfChallenges() * GameLevel.POINTS_FIRST_ATTEMPT;
  }

  /**
   * Is the specified score a perfect score?
   */
  public isPerfectScore( points: number ): boolean {
    return points === this.getPerfectScore();
  }

  /**
   * Gets a set of challenges to be used in the game. Each challenges is an Equation to be balanced.
   * If 'playAll' query parameter is defined, return all equations for the level.
   */
  public getChallenges(): Equation[] {
    const equations = BCEQueryParameters.playAll ?
                      this.equationPool :
                      this.equationSelectionStrategy.getEquations( GameLevel.CHALLENGES_PER_GAME );
    equations.forEach( equation => equation.reset() ); // Ensure that all coefficients are reset to zero.
    return equations;
  }

  /**
   * GameLevelIO handles serialization of a level in the game screen. It implements reference-type serialization, as
   * described in https://github.com/phetsims/phet-io/blob/main/doc/phet-io-instrumentation-technical-guide.md#serialization.
   */
  public static readonly GameLevelIO = new IOType<GameLevel, ReferenceIOState>( 'GameLevelIO', {
    valueType: GameLevel,
    supertype: ReferenceIO( IOType.ObjectIO ),
    documentation: 'A level in the game.'
  } );
}

balancingChemicalEquations.register( 'GameLevel', GameLevel );