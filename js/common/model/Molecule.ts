// Copyright 2014-2023, University of Colorado Boulder

/**
 * Model of a molecule.
 *
 * @author Vasily Shakhov (mlearner.com)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Atom from '../../../../nitroglycerin/js/Atom.js';
import MoleculeNode, { MoleculeNodeOptions } from '../../../../nitroglycerin/js/nodes/MoleculeNode.js';
import Element from '../../../../nitroglycerin/js/Element.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';

export default class Molecule {

  private readonly MoleculeNodeConstructor: new ( options?: MoleculeNodeOptions ) => MoleculeNode;
  public readonly symbol: string;
  public readonly atoms: Atom[];

  public constructor( MoleculeNodeConstructor: new ( options?: MoleculeNodeOptions ) => MoleculeNode, symbol: string, elements: Element[] ) {

    this.MoleculeNodeConstructor = MoleculeNodeConstructor;
    this.symbol = symbol;
    this.atoms = [];

    elements.forEach( element => this.atoms.push( new Atom( element ) ) );
  }

  /**
   * Any molecule with more than 5 atoms is considered "big". This affects degree of difficulty in the Game.
   */
  public isBig(): boolean {
    return this.atoms.length > 5;
  }

  /**
   * Creates the MoleculeNode that corresponds to this Molecule.
   */
  public createNode( options?: MoleculeNodeOptions ): MoleculeNode {
    return new this.MoleculeNodeConstructor( options );
  }
}

balancingChemicalEquations.register( 'Molecule', Molecule );