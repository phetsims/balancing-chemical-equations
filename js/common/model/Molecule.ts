// Copyright 2014-2023, University of Colorado Boulder

// @ts-nocheck
/**
 * Model of a molecule.
 *
 * @author Vasily Shakhov (mlearner.com)
 */

import Atom from '../../../../nitroglycerin/js/Atom.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';

export default class Molecule {

  /**
   * @param {NITROGLYCERIN.node} nodeConstructor constructor of molecule from NITROGLYCERIN
   * @param {string} symbolText html string
   * @param {NITROGLYCERIN.Element[]} elements
   */
  constructor( nodeConstructor, symbolText, elements ) {

    // @private
    this.nodeConstructor = nodeConstructor;

    // @public
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

  /**
   * Creates the MoleculeNode that corresponds to this Molecule.
   * @param [options]
   * @returns {MoleculeNode}
   * @public
   */
  createNode( options ) {
    return new this.nodeConstructor( options );
  }
}

balancingChemicalEquations.register( 'Molecule', Molecule );