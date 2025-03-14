// Copyright 2014-2025, University of Colorado Boulder

/**
 * Molecule is the model of a molecule.
 *
 * @author Vasily Shakhov (mlearner.com)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Atom from '../../../../nitroglycerin/js/Atom.js';
import Element from '../../../../nitroglycerin/js/Element.js';
import C2H2Node from '../../../../nitroglycerin/js/nodes/C2H2Node.js';
import C2H4Node from '../../../../nitroglycerin/js/nodes/C2H4Node.js';
import C2H5ClNode from '../../../../nitroglycerin/js/nodes/C2H5ClNode.js';
import C2H5OHNode from '../../../../nitroglycerin/js/nodes/C2H5OHNode.js';
import C2H6Node from '../../../../nitroglycerin/js/nodes/C2H6Node.js';
import CH2ONode from '../../../../nitroglycerin/js/nodes/CH2ONode.js';
import CH3OHNode from '../../../../nitroglycerin/js/nodes/CH3OHNode.js';
import CH4Node from '../../../../nitroglycerin/js/nodes/CH4Node.js';
import Cl2Node from '../../../../nitroglycerin/js/nodes/Cl2Node.js';
import CNode from '../../../../nitroglycerin/js/nodes/CNode.js';
import CO2Node from '../../../../nitroglycerin/js/nodes/CO2Node.js';
import CONode from '../../../../nitroglycerin/js/nodes/CONode.js';
import CS2Node from '../../../../nitroglycerin/js/nodes/CS2Node.js';
import F2Node from '../../../../nitroglycerin/js/nodes/F2Node.js';
import H2Node from '../../../../nitroglycerin/js/nodes/H2Node.js';
import H2ONode from '../../../../nitroglycerin/js/nodes/H2ONode.js';
import H2SNode from '../../../../nitroglycerin/js/nodes/H2SNode.js';
import HClNode from '../../../../nitroglycerin/js/nodes/HClNode.js';
import HFNode from '../../../../nitroglycerin/js/nodes/HFNode.js';
import MoleculeNode, { MoleculeNodeOptions } from '../../../../nitroglycerin/js/nodes/MoleculeNode.js';
import N2Node from '../../../../nitroglycerin/js/nodes/N2Node.js';
import N2ONode from '../../../../nitroglycerin/js/nodes/N2ONode.js';
import NH3Node from '../../../../nitroglycerin/js/nodes/NH3Node.js';
import NO2Node from '../../../../nitroglycerin/js/nodes/NO2Node.js';
import NONode from '../../../../nitroglycerin/js/nodes/NONode.js';
import O2Node from '../../../../nitroglycerin/js/nodes/O2Node.js';
import OF2Node from '../../../../nitroglycerin/js/nodes/OF2Node.js';
import P4Node from '../../../../nitroglycerin/js/nodes/P4Node.js';
import PCl3Node from '../../../../nitroglycerin/js/nodes/PCl3Node.js';
import PCl5Node from '../../../../nitroglycerin/js/nodes/PCl5Node.js';
import PF3Node from '../../../../nitroglycerin/js/nodes/PF3Node.js';
import PH3Node from '../../../../nitroglycerin/js/nodes/PH3Node.js';
import SNode from '../../../../nitroglycerin/js/nodes/SNode.js';
import SO2Node from '../../../../nitroglycerin/js/nodes/SO2Node.js';
import SO3Node from '../../../../nitroglycerin/js/nodes/SO3Node.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';

const C = Element.C;
const Cl = Element.Cl;
const F = Element.F;
const H = Element.H;
const N = Element.N;
const O = Element.O;
const P = Element.P;
const S = Element.S;

export default class Molecule {

  private readonly MoleculeNodeConstructor: new ( options?: MoleculeNodeOptions ) => MoleculeNode;
  public readonly symbol: string; // in RichText format, with LTR wrapping
  public readonly symbolPlainText: string; // in plain text format
  public readonly atoms: Atom[];

  /**
   * Constructor is private because we only use the static instances defined below.
   * @param MoleculeNodeConstructor - constructor for some MoleculeNode subclass, for creating the view
   * @param elements - ordered set of Elements that define the Molecule structure. For example: [ C, C, H, H ] => 'C<sub>2</sub>H<sub>2</sub>'
   */
  private constructor( MoleculeNodeConstructor: new ( options?: MoleculeNodeOptions ) => MoleculeNode, elements: Element[] ) {

    this.MoleculeNodeConstructor = MoleculeNodeConstructor;
    this.symbol = elementsToSymbol( elements );
    this.symbolPlainText = elementsToSymbol( elements, false /* withMarkup */ );
    this.atoms = elements.map( element => new Atom( element ) );
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

  // Static instances used through the simulation.
  public static readonly C = new Molecule( CNode, [ C ] );
  public static readonly Cl2 = new Molecule( Cl2Node, [ Cl, Cl ] );
  public static readonly C2H2 = new Molecule( C2H2Node, [ C, C, H, H ] );
  public static readonly C2H4 = new Molecule( C2H4Node, [ C, C, H, H, H, H ] );
  public static readonly C2H5Cl = new Molecule( C2H5ClNode, [ C, C, H, H, H, H, H, Cl ] );
  public static readonly C2H5OH = new Molecule( C2H5OHNode, [ C, C, H, H, H, H, H, O, H ] );
  public static readonly C2H6 = new Molecule( C2H6Node, [ C, C, H, H, H, H, H, H ] );
  public static readonly CH2O = new Molecule( CH2ONode, [ C, H, H, O ] );
  public static readonly CH3OH = new Molecule( CH3OHNode, [ C, H, H, H, O, H ] );
  public static readonly CH4 = new Molecule( CH4Node, [ C, H, H, H, H ] );
  public static readonly CO = new Molecule( CONode, [ C, O ] );
  public static readonly CO2 = new Molecule( CO2Node, [ C, O, O ] );
  public static readonly CS2 = new Molecule( CS2Node, [ C, S, S ] );
  public static readonly F2 = new Molecule( F2Node, [ F, F ] );
  public static readonly H2 = new Molecule( H2Node, [ H, H ] );
  public static readonly H2O = new Molecule( H2ONode, [ H, H, O ] );
  public static readonly H2S = new Molecule( H2SNode, [ H, H, S ] );
  public static readonly HF = new Molecule( HFNode, [ H, F ] );
  public static readonly HCl = new Molecule( HClNode, [ H, Cl ] );
  public static readonly N2 = new Molecule( N2Node, [ N, N ] );
  public static readonly N2O = new Molecule( N2ONode, [ N, N, O ] );
  public static readonly NH3 = new Molecule( NH3Node, [ N, H, H, H ] );
  public static readonly NO = new Molecule( NONode, [ N, O ] );
  public static readonly NO2 = new Molecule( NO2Node, [ N, O, O ] );
  public static readonly O2 = new Molecule( O2Node, [ O, O ] );
  public static readonly OF2 = new Molecule( OF2Node, [ O, F, F ] );
  public static readonly P4 = new Molecule( P4Node, [ P, P, P, P ] );
  public static readonly PH3 = new Molecule( PH3Node, [ P, H, H, H ] );
  public static readonly PCl3 = new Molecule( PCl3Node, [ P, Cl, Cl, Cl ] );
  public static readonly PCl5 = new Molecule( PCl5Node, [ P, Cl, Cl, Cl, Cl, Cl ] );
  public static readonly PF3 = new Molecule( PF3Node, [ P, F, F, F ] );
  public static readonly S = new Molecule( SNode, [ S ] );
  public static readonly SO3 = new Molecule( SO3Node, [ S, O, O, O ] );
  public static readonly SO2 = new Molecule( SO2Node, [ S, O, O ] );
}

/**
 * Converts an ordered set of elements to the symbol for a Molecule. Left-to-right order is preserved.
 * The string is in RichText format by default, with LTR wrapping, but can be in plain text format with withMarkup = false.
 * For example: [ C, C, H, H ] => '\u202aC<sub>2</sub>H<sub>2</sub>\u202b'
 */
function elementsToSymbol( elements: Element[], withMarkup = true ): string {
  let symbol = '';
  let element: Element | null = null;
  let count = 0;
  for ( let i = 0; i < elements.length; i++ ) {
    const currentElement = elements[ i ];
    if ( currentElement === element ) {
      count++;
    }
    else {
      if ( count > 1 ) {
        if ( withMarkup ) {
          symbol += `<sub>${count}</sub>`;
        }
        else {
          symbol += `${count}`;
        }
      }
      symbol += currentElement.symbol;
      element = currentElement;
      count = 1;
    }
  }
  if ( count > 1 ) {
    if ( withMarkup ) {
      symbol += `<sub>${count}</sub>`;
    }
    else {
      symbol += `${count}`;
    }
  }

  // Preserve left-to-right ordering.
  if ( withMarkup ) {
    symbol = StringUtils.wrapLTR( symbol );
  }

  return symbol;
}

balancingChemicalEquations.register( 'Molecule', Molecule );