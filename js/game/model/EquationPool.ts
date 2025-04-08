// Copyright 2020-2025, University of Colorado Boulder

/**
 * EquationPool is the base class for the pool of equations that make up challenges for the Game.
 * It is responsible for selecting a random set of equations from that pool, with no duplicates.
 * Based on the optional exclusionsMap, selection of an equation may cause other equations to be excluded from a game.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import dotRandom from '../../../../dot/js/dotRandom.js';
import optionize from '../../../../phet-core/js/optionize.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import Equation from '../../common/model/Equation.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import BCEQueryParameters from '../../common/BCEQueryParameters.js';
import BCEPreferences from '../../common/model/BCEPreferences.js';

export type ExclusionsMap = Map<Equation, Equation[]>;

type SelfOptions = {

  // Whether it's OK if the first equation returned by getEquations() contains a "big" molecule, as defined by Molecule.isBig.
  firstBigMolecule?: boolean;

  // Defines how selection of an equation may cause other equation to be excluded a game.
  // For an example, see GameLevel3.EXCLUSIONS_MAP
  exclusionsMap?: ExclusionsMap | null;
};

type EquationPoolOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class EquationPool extends PhetioObject {

  // The pool of Equations to choose from
  private readonly pool: Equation[];

  // See SelfOptions
  public readonly firstBigMolecule: boolean;

  // See SelfOptions
  private readonly exclusionsMap: ExclusionsMap | null;

  protected constructor( pool: Equation[], providedOptions: EquationPoolOptions ) {

    const options = optionize<EquationPoolOptions, SelfOptions, PhetioObjectOptions>()( {

      // SelfOptions
      firstBigMolecule: true,
      exclusionsMap: null,

      // PhetioObjectOptions
      phetioState: false
    }, providedOptions );

    super( options );

    this.pool = pool;
    this.firstBigMolecule = options.firstBigMolecule;
    this.exclusionsMap = options.exclusionsMap;

    // Change the initial coefficient for all equations.
    BCEPreferences.instance.initialCoefficientProperty.lazyLink( initialCoefficient =>
      this.pool.forEach( equation => equation.setInitialCoefficients( initialCoefficient ) ) );
  }

  public getPoolSize(): number {
    return this.pool.length;
  }

  /**
   * Randomly selects a specified number of Equations from the pool.
   */
  public getEquations( numberOfEquations: number ): Equation[] {

    phet.log && phet.log( 'Choosing challenges...' );

    // Operate on a copy of the pool, so that we can prune as we select equations.
    const poolCopy = _.clone( this.pool );

    const equations: Equation[] = [];
    for ( let i = 0; i < numberOfEquations; i++ ) {

      assert && assert( poolCopy.length > 0 );

      // randomly select an equation
      const randomIndex = dotRandom.nextInt( poolCopy.length );
      let equation = poolCopy[ randomIndex ];

      // If the first equation isn't supposed to contain any "big" molecules, then find an equation in the pool that
      // does not have "big" molecules.
      if ( i === 0 && !this.firstBigMolecule && equation.hasBigMolecule() ) {

        // start the search at a random index
        const startIndex = dotRandom.nextInt( poolCopy.length );
        let index = startIndex;
        let done = false;
        while ( !done ) {

          // next equation in the pool
          equation = poolCopy[ index ];

          if ( !equation.hasBigMolecule() ) {
            done = true; // success, this equation has no big molecules
          }
          else {
            // increment index to point to next in pool
            index++;
            if ( index > poolCopy.length - 1 ) {
              index = 0;
            }

            // give up if we've examined all equations in the pool
            if ( index === startIndex ) {
              done = true;
              assert && assert( false, 'first equation contains big molecules because we ran out of equations' );
            }
          }
        }
      }

      // Add the equation to the game.
      equations.push( equation );
      phet.log && phet.log( `+ selected ${equation.tandem.name}, ${equation.toString()}` );

      // Remove the equation from the pool, so it won't be selected again.
      poolCopy.splice( poolCopy.indexOf( equation ), 1 );

      // If the selected equation has exclusions, remove them from the pool.
      if ( this.exclusionsMap && !BCEQueryParameters.playAll ) {
        const exclusions = this.exclusionsMap.get( equation );
        if ( exclusions ) {
          for ( let j = 0; j < exclusions.length; j++ ) {
            const exclusion = exclusions[ j ];
            const excludedIndex = poolCopy.indexOf( exclusion );
            if ( excludedIndex !== -1 ) {
              poolCopy.splice( excludedIndex, 1 );
              phet.log && phet.log( `- excluded ${exclusion.tandem.name}, ${exclusion.toString()}` );
            }
          }
        }
      }
    }

    assert && assert( equations.length === numberOfEquations );
    if ( assert && !this.firstBigMolecule ) {
      const firstEquation = equations[ 0 ];
      assert && assert( !firstEquation.hasBigMolecule(), `First equation is not supposed to include a big molecule: ${firstEquation.toString()}` );
    }

    assert && assert( _.uniq( equations ).length === equations.length, 'equation should contain no duplicates.' );

    return equations;
  }

  /**
   * Gets a specific equation from the pool.
   */
  public getEquation( index: number ): Equation {
    assert && assert( index >= 0 && index < this.pool.length );
    return this.pool[ index ];
  }
}

balancingChemicalEquations.register( 'EquationPool', EquationPool );