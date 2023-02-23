// Copyright 2020-2023, University of Colorado Boulder

/**
 * Selects a random set from a pool of equations, with no duplicates.
 * Selection of an equation may cause other equations to be excluded from the pool.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import dotRandom from '../../../../dot/js/dotRandom.js';
import optionize from '../../../../phet-core/js/optionize.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import { EquationGenerator, ExclusionsMap } from './GameFactory.js';

type SelfOptions = {
  exclusionsMap?: ExclusionsMap | null; // See GameFactory.LEVEL3_EXCLUSIONS_MAP
};

type RandomStrategyOptions = SelfOptions;

export default class RandomStrategy {

  // The pool of EquationGenerators to choose from
  public readonly pool: EquationGenerator[];

  // Whether it's OK if the first equation in the set contains a "big" molecule
  public readonly firstBigMolecule: boolean;

  // See GameFactory.LEVEL3_EXCLUSIONS_MAP
  public readonly exclusionsMap: ExclusionsMap | null;

  public constructor( pool: EquationGenerator[], firstBigMolecule: boolean, providedOptions?: RandomStrategyOptions ) {

    const options = optionize<RandomStrategyOptions, SelfOptions>()( {

      // SelfOptions
      exclusionsMap: null
    }, providedOptions );

    this.pool = pool;
    this.firstBigMolecule = firstBigMolecule;
    this.exclusionsMap = options.exclusionsMap;
  }

  /**
   * Randomly selects a specified number of EquationGenerators from the pool.
   */
  public getEquationGenerators( numberOfEquations: number ): EquationGenerator[] {

    phet.log && phet.log( 'Choosing challenges...' );

    // Operate on a copy of the pool, so that we can prune as we select equations.
    const poolCopy = _.clone( this.pool );

    const equationGenerators: EquationGenerator[] = [];
    for ( let i = 0; i < numberOfEquations; i++ ) {

      assert && assert( poolCopy.length > 0 );

      // randomly select an equation
      const randomIndex = dotRandom.nextInt( poolCopy.length );
      let equationGenerator = poolCopy[ randomIndex ];

      // If the first equation isn't supposed to contain any "big" molecules, then find an equation generator
      // in the pool that does not make equations that have "big" molecules.
      if ( i === 0 && !this.firstBigMolecule && equationGenerator().hasBigMolecule() ) {

        // start the search at a random index
        const startIndex = dotRandom.nextInt( poolCopy.length );
        let index = startIndex;
        let done = false;
        while ( !done ) {

          // next equation in the pool
          equationGenerator = poolCopy[ index ];

          if ( !equationGenerator().hasBigMolecule() ) {
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
      equationGenerators.push( equationGenerator );
      phet.log && phet.log( `+ chose ${equationGenerator().toString()}` );

      // Remove the equation from the pool, so it won't be selected again.
      poolCopy.splice( poolCopy.indexOf( equationGenerator ), 1 );

      // If the selected equation generator has exclusions, remove them from the pool.
      if ( this.exclusionsMap ) {
        const exclusions = this.exclusionsMap.get( equationGenerator );
        if ( exclusions ) {
          for ( let j = 0; j < exclusions.length; j++ ) {
            const exclusion = exclusions[ j ];
            const excludedIndex = poolCopy.indexOf( exclusion );
            if ( excludedIndex !== -1 ) {
              poolCopy.splice( excludedIndex, 1 );
              phet.log && phet.log( `- excluded ${exclusion().toString()}` );
            }
          }
        }
      }
    }

    assert && assert( equationGenerators.length === numberOfEquations );
    return equationGenerators;
  }
}

balancingChemicalEquations.register( 'RandomStrategy', RandomStrategy );