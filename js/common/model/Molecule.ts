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
  public readonly symbol: string;
  public readonly atoms: Atom[];

  /**
   * Constructor is private because we only use the static instances defined below.
   */
  private constructor( MoleculeNodeConstructor: new ( options?: MoleculeNodeOptions ) => MoleculeNode, symbol: string, elements: Element[] ) {

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

  // Static instances used through the simulation.
  public static readonly C = new Molecule( CNode, 'C', [ C ] );
  public static readonly Cl2 = new Molecule( Cl2Node, 'Cl<sub>2</sub>', [ Cl, Cl ] );
  public static readonly C2H2 = new Molecule( C2H2Node, 'C<sub>2</sub>H<sub>2</sub>', [ C, C, H, H ] );
  public static readonly C2H4 = new Molecule( C2H4Node, 'C<sub>2</sub>H<sub>4</sub>', [ C, C, H, H, H, H ] );
  public static readonly C2H5Cl = new Molecule( C2H5ClNode, 'C<sub>2</sub>H<sub>5</sub>Cl', [ C, C, H, H, H, H, H, Cl ] );
  public static readonly C2H5OH = new Molecule( C2H5OHNode, 'C<sub>2</sub>H<sub>5</sub>OH', [ C, C, H, H, H, H, H, O, H ] );
  public static readonly C2H6 = new Molecule( C2H6Node, 'C<sub>2</sub>H<sub>6</sub>', [ C, C, H, H, H, H, H, H ] );
  public static readonly CH2O = new Molecule( CH2ONode, 'CH<sub>2</sub>O', [ C, H, H, O ] );
  public static readonly CH3OH = new Molecule( CH3OHNode, 'CH<sub>3</sub>OH', [ C, H, H, H, O, H ] );
  public static readonly CH4 = new Molecule( CH4Node, 'CH<sub>4</sub>', [ C, H, H, H, H ] );
  public static readonly CO = new Molecule( CONode, 'CO', [ C, O ] );
  public static readonly CO2 = new Molecule( CO2Node, 'CO<sub>2</sub>', [ C, O, O ] );
  public static readonly CS2 = new Molecule( CS2Node, 'CS<sub>2</sub>', [ C, S, S ] );
  public static readonly F2 = new Molecule( F2Node, 'F<sub>2</sub>', [ F, F ] );
  public static readonly H2 = new Molecule( H2Node, 'H<sub>2</sub>', [ H, H ] );
  public static readonly H2O = new Molecule( H2ONode, 'H<sub>2</sub>O', [ H, H, O ] );
  public static readonly H2S = new Molecule( H2SNode, 'H<sub>2</sub>S', [ H, H, S ] );
  public static readonly HF = new Molecule( HFNode, 'HF', [ H, F ] );
  public static readonly HCl = new Molecule( HClNode, 'HCl', [ H, Cl ] );
  public static readonly N2 = new Molecule( N2Node, 'N<sub>2</sub>', [ N, N ] );
  public static readonly N2O = new Molecule( N2ONode, 'N<sub>2</sub>O', [ N, N, O ] );
  public static readonly NH3 = new Molecule( NH3Node, 'NH<sub>3</sub>', [ N, H, H, H ] );
  public static readonly NO = new Molecule( NONode, 'NO', [ N, O ] );
  public static readonly NO2 = new Molecule( NO2Node, 'NO<sub>2</sub>', [ N, O, O ] );
  public static readonly O2 = new Molecule( O2Node, 'O<sub>2</sub>', [ O, O ] );
  public static readonly OF2 = new Molecule( OF2Node, 'OF<sub>2</sub>', [ O, F, F ] );
  public static readonly P4 = new Molecule( P4Node, 'P<sub>4</sub>', [ P, P, P, P ] );
  public static readonly PH3 = new Molecule( PH3Node, 'PH<sub>3</sub>', [ P, H, H, H ] );
  public static readonly PCl3 = new Molecule( PCl3Node, 'PCl<sub>3</sub>', [ P, Cl, Cl, Cl ] );
  public static readonly PCl5 = new Molecule( PCl5Node, 'PCl<sub>5</sub>', [ P, Cl, Cl, Cl, Cl, Cl ] );
  public static readonly PF3 = new Molecule( PF3Node, 'PF<sub>3</sub>', [ P, F, F, F ] );
  public static readonly S = new Molecule( SNode, 'S', [ S ] );
  public static readonly SO3 = new Molecule( SO3Node, 'SO<sub>3</sub>', [ S, O, O, O ] );
  public static readonly SO2 = new Molecule( SO2Node, 'SO<sub>2</sub>', [ S, O, O ] );
}

balancingChemicalEquations.register( 'Molecule', Molecule );