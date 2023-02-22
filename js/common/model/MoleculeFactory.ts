// Copyright 2014-2021, University of Colorado Boulder

// @ts-nocheck
/**
 * Factory for creating molecule nodes.
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

// modules - molecules

const MoleculeFactory = {

  C: function() {
    return new Molecule( CNode, 'C', [ Element.C ] );
  },

  Cl2: function() {
    return new Molecule( Cl2Node, 'Cl<sub>2</sub>', [ Element.Cl, Element.Cl ] );
  },

  C2H2: function() {
    return new Molecule( C2H2Node, 'C<sub>2</sub>H<sub>2</sub>', [ Element.C, Element.C, Element.H, Element.H ] );
  },

  C2H4: function() {
    return new Molecule( C2H4Node, 'C<sub>2</sub>H<sub>4</sub>', [ Element.C, Element.C, Element.H, Element.H, Element.H, Element.H ] );
  },

  C2H5Cl: function() {
    return new Molecule( C2H5ClNode, 'C<sub>2</sub>H<sub>5</sub>Cl', [ Element.C, Element.C, Element.H, Element.H, Element.H, Element.H, Element.H, Element.Cl ] );
  },

  C2H5OH: function() {
    return new Molecule( C2H5OHNode, 'C<sub>2</sub>H<sub>5</sub>OH', [ Element.C, Element.C, Element.H, Element.H, Element.H, Element.H, Element.H, Element.O, Element.H ] );
  },

  C2H6: function() {
    return new Molecule( C2H6Node, 'C<sub>2</sub>H<sub>6</sub>', [ Element.C, Element.C, Element.H, Element.H, Element.H, Element.H, Element.H, Element.H ] );
  },

  CH2O: function() {
    return new Molecule( CH2ONode, 'CH<sub>2</sub>O', [ Element.C, Element.H, Element.H, Element.O ] );
  },

  CH3OH: function() {
    return new Molecule( CH3OHNode, 'CH<sub>3</sub>OH', [ Element.C, Element.H, Element.H, Element.H, Element.O, Element.H ] );
  },

  CH4: function() {
    return new Molecule( CH4Node, 'CH<sub>4</sub>', [ Element.C, Element.H, Element.H, Element.H, Element.H ] );
  },

  CO: function() {
    return new Molecule( CONode, 'CO', [ Element.C, Element.O ] );
  },

  CO2: function() {
    return new Molecule( CO2Node, 'CO<sub>2</sub>', [ Element.C, Element.O, Element.O ] );
  },

  CS2: function() {
    return new Molecule( CS2Node, 'CS<sub>2</sub>', [ Element.C, Element.S, Element.S ] );
  },

  F2: function() {
    return new Molecule( F2Node, 'F<sub>2</sub>', [ Element.F, Element.F ] );
  },

  H2: function() {
    return new Molecule( H2Node, 'H<sub>2</sub>', [ Element.H, Element.H ] );
  },

  H2O: function() {
    return new Molecule( H2ONode, 'H<sub>2</sub>O', [ Element.H, Element.H, Element.O ] );
  },

  H2S: function() {
    return new Molecule( H2SNode, 'H<sub>2</sub>S', [ Element.H, Element.H, Element.S ] );
  },

  HF: function() {
    return new Molecule( HFNode, 'HF', [ Element.H, Element.F ] );
  },

  HCl: function() {
    return new Molecule( HClNode, 'HCl', [ Element.H, Element.Cl ] );
  },

  N2: function() {
    return new Molecule( N2Node, 'N<sub>2</sub>', [ Element.N, Element.N ] );
  },

  N2O: function() {
    return new Molecule( N2ONode, 'N<sub>2</sub>O', [ Element.N, Element.N, Element.O ] );
  },

  NH3: function() {
    return new Molecule( NH3Node, 'NH<sub>3</sub>', [ Element.N, Element.H, Element.H, Element.H ] );
  },

  NO: function() {
    return new Molecule( NONode, 'NO', [ Element.N, Element.O ] );
  },

  NO2: function() {
    return new Molecule( NO2Node, 'NO<sub>2</sub>', [ Element.N, Element.O, Element.O ] );
  },

  O2: function() {
    return new Molecule( O2Node, 'O<sub>2</sub>', [ Element.O, Element.O ] );
  },

  OF2: function() {
    return new Molecule( OF2Node, 'OF<sub>2</sub>', [ Element.O, Element.F, Element.F ] );
  },

  P4: function() {
    return new Molecule( P4Node, 'P<sub>4</sub>', [ Element.P, Element.P, Element.P, Element.P ] );
  },

  PH3: function() {
    return new Molecule( PH3Node, 'PH<sub>3</sub>', [ Element.P, Element.H, Element.H, Element.H ] );
  },

  PCl3: function() {
    return new Molecule( PCl3Node, 'PCl<sub>3</sub>', [ Element.P, Element.Cl, Element.Cl, Element.Cl ] );
  },

  PCl5: function() {
    return new Molecule( PCl5Node, 'PCl<sub>5</sub>', [ Element.P, Element.Cl, Element.Cl, Element.Cl, Element.Cl, Element.Cl ] );
  },

  PF3: function() {
    return new Molecule( PF3Node, 'PF<sub>3</sub>', [ Element.P, Element.F, Element.F, Element.F ] );
  },

  S: function() {
    return new Molecule( SNode, 'S', [ Element.S ] );
  },

  SO3: function() {
    return new Molecule( SO3Node, 'SO<sub>3</sub>', [ Element.S, Element.O, Element.O, Element.O ] );
  },

  SO2: function() {
    return new Molecule( SO2Node, 'SO<sub>2</sub>', [ Element.S, Element.O, Element.O ] );
  }
};

balancingChemicalEquations.register( 'MoleculeFactory', MoleculeFactory );
export default MoleculeFactory;