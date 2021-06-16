[object Promise]

/**
 * Selects a random set from a pool of equations, with no duplicates.
 * Selection of an equation may cause other equations to be excluded from the pool.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import dotRandom from '../../../../dot/js/dotRandom.js';
import merge from '../../../../phet-core/js/merge.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import BCEQueryParameters from '../../common/BCEQueryParameters.js';
import DisplacementEquation from '../../common/model/DisplacementEquation.js';

class RandomStrategy {

  /**
   * @param {function[]} pool - which equation pool to use
   * @param {boolean} firstBigMolecule - specifies whether it's OK if the first equation in the set contains a "big" molecule
   * @param {Object} [options]
   */
  constructor( pool, firstBigMolecule, options ) {

    options = merge( {
      exclusions: {} // see LEVEL3_EXCLUSIONS for doc
    }, options );

    this.pool = pool;
    this.firstBigMolecule = firstBigMolecule;  // can the first equation in the set contain a "big" molecule?
    this.exclusions = options.exclusions;
  }

  /**
   * Randomly selects a specified number of Equation factory functions from the pool.
   * @private
   * @param {number} numberOfEquations
   * @returns { [{function}] } array of Equation factory functions
   * @public
   */
  getEquationFactoryFunctions( numberOfEquations ) {

    BCEQueryParameters.log && console.log( 'GameFactory: choosing challenges...' );

    // operate on a copy of the pool, so that we can prune the pool as we select equations
    const poolCopy = _.clone( this.pool );

    const factoryFunctions = [];
    for ( let i = 0; i < numberOfEquations; i++ ) {

      assert && assert( poolCopy.length > 0 );

      // randomly select an equation
      const randomIndex = dotRandom.nextInt( poolCopy.length );
      let factoryFunction = poolCopy[ randomIndex ];

      // If the first equation isn't supposed to contain any "big" molecules,
      // then find an equation in the pool that has no big molecules.
      if ( i === 0 && !this.firstBigMolecule && factoryFunction().hasBigMolecule() ) {

        // start the search at a random index
        const startIndex = dotRandom.nextInt( poolCopy.length );
        let index = startIndex;
        let done = false;
        while ( !done ) {

          // next equation in the pool
          factoryFunction = poolCopy.get( index );

          if ( !factoryFunction().hasBigMolecule() ) {
            done = true; // success, this equation has no big molecules
          }
          else {
            // increment index to point to next in pool
            index++;
            if ( index > poolCopy.size() - 1 ) {
              index = 0;
            }

            // give up if we've examined all equations in the pool
            if ( index === startIndex ) {
              done = true;
              throw new Error( 'first equation contains big molecules because we ran out of equations' );
            }
          }
        }
      }

      // add the equation to the game
      factoryFunctions.push( factoryFunction );
      BCEQueryParameters.log && console.log( `+ chose ${factoryFunction().toString()}` );

      // remove the equation from the pool so it won't be selected again
      poolCopy.splice( poolCopy.indexOf( factoryFunction ), 1 );

      // if the selected equation has exclusions, remove them from the pool
      for ( const functionName in this.exclusions ) {
        if ( DisplacementEquation[ functionName ] === factoryFunction ) {
          const excludedFunctions = this.exclusions[ functionName ];
          for ( let j = 0; j < excludedFunctions.length; j++ ) {
            const excludedFunction = excludedFunctions[ j ];
            const excludedIndex = poolCopy.indexOf( excludedFunction );
            if ( excludedIndex !== -1 ) {
              poolCopy.splice( excludedIndex, 1 );
              BCEQueryParameters.log && console.log( `- excluded ${excludedFunction().toString()}` );
            }
          }
          break; // assumes that all exclusions are in 1 entry
        }
      }
    }

    assert && assert( factoryFunctions.length === numberOfEquations );
    return factoryFunctions;
  }
}

balancingChemicalEquations.register( 'RandomStrategy', RandomStrategy );
export default RandomStrategy;