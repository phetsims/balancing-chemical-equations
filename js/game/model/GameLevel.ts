// Copyright 2025, University of Colorado Boulder

/**
 * GameLevel is a level in the Game screen.
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
import optionize from '../../../../phet-core/js/optionize.js';

type SelfOptions = {

  // 1-based numbering
  levelNumber: number;

  // Strategy for selecting the "balanced representation" that is displayed by the "Not Balanced" popup.
  balancedRepresentation: () => BalancedRepresentation;
};

type GameLevelOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class GameLevel extends PhetioObject {

  public readonly levelNumber: number;
  public readonly balancedRepresentation: () => BalancedRepresentation;
  public readonly bestScoreProperty: Property<number>;
  public readonly bestTimeProperty: Property<number>;

  public constructor( providedOptions: GameLevelOptions ) {

    const options = optionize<GameLevelOptions, SelfOptions, PhetioObjectOptions>()( {

      // PhetioObjectOptions
      phetioType: GameLevel.GameLevelIO
    }, providedOptions );

    super( options );

    this.levelNumber = options.levelNumber;
    this.balancedRepresentation = options.balancedRepresentation;

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
   * GameLevelIO handles serialization a level in the game screen. It implements reference-type serialization, as
   * described in https://github.com/phetsims/phet-io/blob/main/doc/phet-io-instrumentation-technical-guide.md#serialization.
   */
  public static readonly GameLevelIO = new IOType<GameLevel, ReferenceIOState>( 'HydrogenAtomIO', {
    valueType: GameLevel,
    supertype: ReferenceIO( IOType.ObjectIO ),
    documentation: 'A level in the game'
  } );
}

balancingChemicalEquations.register( 'GameLevel', GameLevel );