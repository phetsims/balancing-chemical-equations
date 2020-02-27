// Copyright 2014-2020, University of Colorado Boulder

/**
 * Data structure for describing how many times an atom appears in an equation.
 * There are separate counts for the left-hand (reactants) and right-hand (products)
 * sides of the equation.
 *
 * @author Vasily Shakhov
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const balancingChemicalEquations = require( 'BALANCING_CHEMICAL_EQUATIONS/balancingChemicalEquations' );

  class AtomCount {

    /**
     * @param {NITROGLYCERIN.Element} element
     * @param {number} reactantsCount
     * @param {number} productsCount
     */
    constructor( element, reactantsCount, productsCount ) {
      this.element = element; // @public the element that describes the atom's chemical properties
      this.reactantsCount = reactantsCount; // @public
      this.productsCount = productsCount; // @public
    }

    /**
     * Returns a count of each type of atom, based on the user coefficients.
     * The order of atoms will be the same order that they are encountered in the terms, left to right.
     * For example, if the equation is CH4 + 2 O2 -> CO2 + 2 H2O, then the order of atoms
     * will be [C,H,O].
     *
     * @param {Equation} equation
     * @returns {AtomCount[]}
     * @public
     * @static
     */
    static countAtoms( equation ) {
      const atomCounts = [];
      appendToCounts( atomCounts, equation.reactants, true /* isReactants */ );
      appendToCounts( atomCounts, equation.products, false /* isReactants */ );
      return atomCounts;
    }
  }

  /**
   * Some of our visual representations of 'balanced' (ie, balance scales and bar charts)
   * compare the number of atoms on the left and right side of the equation.
   *
   * This algorithm supports those representations by computing the atom counts.
   * It examines a collection of terms in the equation (either reactants or products),
   * examines those terms' molecules, and counts the number of each atom type.
   * The atomCounts argument is modified, so that it contains the counts for the
   * specified terms.
   *
   * This is a brute force algorithm, but our number of terms is always small,
   * and this is easy to implement and understand.
   *
   * @param {AtomCount[]} atomCounts
   * @param {EquationTerm[]} terms
   * @param {boolean} isReactants true if the terms are the reactants, false if they are the products
   */
  const appendToCounts = function( atomCounts, terms, isReactants ) {
    terms.forEach( function( term ) {
      term.molecule.atoms.forEach( function( atom ) {

        let found = false;
        for ( let i = 0; i < atomCounts.length; i++ ) {
          const atomCount = atomCounts[ i ];
          // add to an existing count
          if ( atomCount.element === atom.element ) {
            if ( isReactants ) {
              atomCount.reactantsCount += term.userCoefficientProperty.get();
            }
            else {
              atomCount.productsCount += term.userCoefficientProperty.get();
            }
            found = true;
            break;
          }
        }

        // if no existing count was found, create one.
        if ( !found ) {
          if ( isReactants ) {
            atomCounts.push( new AtomCount( atom.element, term.userCoefficientProperty.get(), 0 ) );
          }
          else {
            atomCounts.push( new AtomCount( atom.element, 0, term.userCoefficientProperty.get() ) );
          }
        }
      } );
    } );
    return atomCounts;
  };

  return balancingChemicalEquations.register( 'AtomCount', AtomCount );
} );