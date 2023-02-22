// Copyright 2014-2021, University of Colorado Boulder

/**
 * Static instances of Molecule used through the sim.
 *
 * @author Vasily Shakhov (mlearner.com)
 */

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
import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import Molecule from './Molecule.js';

const C = Element.C;
const Cl = Element.Cl;
const F = Element.F;
const H = Element.H;
const N = Element.N;
const O = Element.O;
const P = Element.P;
const S = Element.S;

const MoleculeFactory = {
  C: (): Molecule => new Molecule( CNode, 'C', [ C ] ),
  Cl2: (): Molecule => new Molecule( Cl2Node, 'Cl<sub>2</sub>', [ Cl, Cl ] ),
  C2H2: (): Molecule => new Molecule( C2H2Node, 'C<sub>2</sub>H<sub>2</sub>', [ C, C, H, H ] ),
  C2H4: (): Molecule => new Molecule( C2H4Node, 'C<sub>2</sub>H<sub>4</sub>', [ C, C, H, H, H, H ] ),
  C2H5Cl: (): Molecule => new Molecule( C2H5ClNode, 'C<sub>2</sub>H<sub>5</sub>Cl', [ C, C, H, H, H, H, H, Cl ] ),
  C2H5OH: (): Molecule => new Molecule( C2H5OHNode, 'C<sub>2</sub>H<sub>5</sub>OH', [ C, C, H, H, H, H, H, O, H ] ),
  C2H6: (): Molecule => new Molecule( C2H6Node, 'C<sub>2</sub>H<sub>6</sub>', [ C, C, H, H, H, H, H, H ] ),
  CH2O: (): Molecule => new Molecule( CH2ONode, 'CH<sub>2</sub>O', [ C, H, H, O ] ),
  CH3OH: (): Molecule => new Molecule( CH3OHNode, 'CH<sub>3</sub>OH', [ C, H, H, H, O, H ] ),
  CH4: (): Molecule => new Molecule( CH4Node, 'CH<sub>4</sub>', [ C, H, H, H, H ] ),
  CO: (): Molecule => new Molecule( CONode, 'CO', [ C, O ] ),
  CO2: (): Molecule => new Molecule( CO2Node, 'CO<sub>2</sub>', [ C, O, O ] ),
  CS2: (): Molecule => new Molecule( CS2Node, 'CS<sub>2</sub>', [ C, S, S ] ),
  F2: (): Molecule => new Molecule( F2Node, 'F<sub>2</sub>', [ F, F ] ),
  H2: (): Molecule => new Molecule( H2Node, 'H<sub>2</sub>', [ H, H ] ),
  H2O: (): Molecule => new Molecule( H2ONode, 'H<sub>2</sub>O', [ H, H, O ] ),
  H2S: (): Molecule => new Molecule( H2SNode, 'H<sub>2</sub>S', [ H, H, S ] ),
  HF: (): Molecule => new Molecule( HFNode, 'HF', [ H, F ] ),
  HCl: (): Molecule => new Molecule( HClNode, 'HCl', [ H, Cl ] ),
  N2: (): Molecule => new Molecule( N2Node, 'N<sub>2</sub>', [ N, N ] ),
  N2O: (): Molecule => new Molecule( N2ONode, 'N<sub>2</sub>O', [ N, N, O ] ),
  NH3: (): Molecule => new Molecule( NH3Node, 'NH<sub>3</sub>', [ N, H, H, H ] ),
  NO: (): Molecule => new Molecule( NONode, 'NO', [ N, O ] ),
  NO2: (): Molecule => new Molecule( NO2Node, 'NO<sub>2</sub>', [ N, O, O ] ),
  O2: (): Molecule => new Molecule( O2Node, 'O<sub>2</sub>', [ O, O ] ),
  OF2: (): Molecule => new Molecule( OF2Node, 'OF<sub>2</sub>', [ O, F, F ] ),
  P4: (): Molecule => new Molecule( P4Node, 'P<sub>4</sub>', [ P, P, P, P ] ),
  PH3: (): Molecule => new Molecule( PH3Node, 'PH<sub>3</sub>', [ P, H, H, H ] ),
  PCl3: (): Molecule => new Molecule( PCl3Node, 'PCl<sub>3</sub>', [ P, Cl, Cl, Cl ] ),
  PCl5: (): Molecule => new Molecule( PCl5Node, 'PCl<sub>5</sub>', [ P, Cl, Cl, Cl, Cl, Cl ] ),
  PF3: (): Molecule => new Molecule( PF3Node, 'PF<sub>3</sub>', [ P, F, F, F ] ),
  S: (): Molecule => new Molecule( SNode, 'S', [ S ] ),
  SO3: (): Molecule => new Molecule( SO3Node, 'SO<sub>3</sub>', [ S, O, O, O ] ),
  SO2: (): Molecule => new Molecule( SO2Node, 'SO<sub>2</sub>', [ S, O, O ] )
};

balancingChemicalEquations.register( 'MoleculeFactory', MoleculeFactory );
export default MoleculeFactory;