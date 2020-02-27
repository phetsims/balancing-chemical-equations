// Copyright 2014-2020, University of Colorado Boulder

/**
 * Model of a molecule.
 *
 * @author Vasily Shakhov (mlearner.com)
 */

import Atom from '../../../../nitroglycerin/js/Atom.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';

class Molecule {

  /**
   * @param {NITROGLYCERIN.node} nodeConstructor constructor of molecule from NITROGLYCERIN
   * @param {string} symbolText html string
   * @param {NITROGLYCERIN.Element[]} elements
   */
  constructor( nodeConstructor, symbolText, elements ) {

    // @public
    this.nodeConstructor = nodeConstructor;
    this.symbol = symbolText;
    this.atoms = [];

    elements.forEach( element => this.atoms.push( new Atom( element ) ) );
  }

  /**
   * Any molecule with more than 5 atoms is considered "big".
   * This affects degree of difficulty in the Game.
   * @returns {boolean}
   * @public
   */
  isBig() {
    return this.atoms.length > 5;
  }
}

balancingChemicalEquations.register( 'Molecule', Molecule );
export default Molecule;