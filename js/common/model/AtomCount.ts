// Copyright 2014-2023, University of Colorado Boulder

/**
 * Data structure for describing how many times an atom appears in an equation.
 * There are separate counts for the left-hand (reactants) and right-hand (products)
 * sides of the equation.
 *
 * @author Vasily Shakhov
 * @author Chris Malley (PixelZoom, Inc.)
 */

import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import Element from '../../../../nitroglycerin/js/Element.js';
import Equation from './Equation.js';
import EquationTerm from './EquationTerm.js';
import Atom from '../../../../nitroglycerin/js/Atom.js';

export default class AtomCount {

  public readonly element: Element; // the element that describes the atom's chemical properties
  public reactantsCount: number;
  public productsCount: number;

  public constructor( element: Element, reactantsCount: number, productsCount: number ) {
    this.element = element;
    this.reactantsCount = reactantsCount;
    this.productsCount = productsCount;
  }

  /**
   * Returns a count of each type of atom, based on the user coefficients.
   * The order of atoms will be the same order that they are encountered in the terms, left to right.
   * For example, if the equation is CH4 + 2 O2 -> CO2 + 2 H2O, then the order of atoms
   * will be [C,H,O].
   */
  public static countAtoms( equation: Equation ): AtomCount[] {
    const atomCounts: AtomCount[] = [];
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
 * @param atomCounts
 * @param terms
 * @param isReactants true if the terms are the reactants, false if they are the products
 */
function appendToCounts( atomCounts: AtomCount[], terms: EquationTerm[], isReactants: boolean ): AtomCount[] {
  terms.forEach( term => {
    term.molecule.atoms.forEach( ( atom: Atom ) => {

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
}

balancingChemicalEquations.register( 'AtomCount', AtomCount );