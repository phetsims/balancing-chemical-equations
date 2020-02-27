// Copyright 2014-2020, University of Colorado Boulder

/**
 * Factory for creating molecule nodes.
 *
 * @author Vasily Shakhov (mlearner.com)
 */
define( require => {
  'use strict';

  // modules
  const balancingChemicalEquations = require( 'BALANCING_CHEMICAL_EQUATIONS/balancingChemicalEquations' );
  const Element = require( 'NITROGLYCERIN/Element' );
  const Molecule = require( 'BALANCING_CHEMICAL_EQUATIONS/common/model/Molecule' );

  // modules - molecules
  const C2H2Node = require( 'NITROGLYCERIN/nodes/C2H2Node' );
  const C2H4Node = require( 'NITROGLYCERIN/nodes/C2H4Node' );
  const C2H5ClNode = require( 'NITROGLYCERIN/nodes/C2H5ClNode' );
  const C2H5OHNode = require( 'NITROGLYCERIN/nodes/C2H5OHNode' );
  const C2H6Node = require( 'NITROGLYCERIN/nodes/C2H6Node' );
  const CH2ONode = require( 'NITROGLYCERIN/nodes/CH2ONode' );
  const CH3OHNode = require( 'NITROGLYCERIN/nodes/CH3OHNode' );
  const CH4Node = require( 'NITROGLYCERIN/nodes/CH4Node' );
  const Cl2Node = require( 'NITROGLYCERIN/nodes/Cl2Node' );
  const CNode = require( 'NITROGLYCERIN/nodes/CNode' );
  const CO2Node = require( 'NITROGLYCERIN/nodes/CO2Node' );
  const CONode = require( 'NITROGLYCERIN/nodes/CONode' );
  const CS2Node = require( 'NITROGLYCERIN/nodes/CS2Node' );
  const F2Node = require( 'NITROGLYCERIN/nodes/F2Node' );
  const H2Node = require( 'NITROGLYCERIN/nodes/H2Node' );
  const H2ONode = require( 'NITROGLYCERIN/nodes/H2ONode' );
  const H2SNode = require( 'NITROGLYCERIN/nodes/H2SNode' );
  const HClNode = require( 'NITROGLYCERIN/nodes/HClNode' );
  const HFNode = require( 'NITROGLYCERIN/nodes/HFNode' );
  const N2Node = require( 'NITROGLYCERIN/nodes/N2Node' );
  const N2ONode = require( 'NITROGLYCERIN/nodes/N2ONode' );
  const NH3Node = require( 'NITROGLYCERIN/nodes/NH3Node' );
  const NO2Node = require( 'NITROGLYCERIN/nodes/NO2Node' );
  const NONode = require( 'NITROGLYCERIN/nodes/NONode' );
  const O2Node = require( 'NITROGLYCERIN/nodes/O2Node' );
  const OF2Node = require( 'NITROGLYCERIN/nodes/OF2Node' );
  const P4Node = require( 'NITROGLYCERIN/nodes/P4Node' );
  const PCl3Node = require( 'NITROGLYCERIN/nodes/PCl3Node' );
  const PCl5Node = require( 'NITROGLYCERIN/nodes/PCl5Node' );
  const PF3Node = require( 'NITROGLYCERIN/nodes/PF3Node' );
  const PH3Node = require( 'NITROGLYCERIN/nodes/PH3Node' );
  const SNode = require( 'NITROGLYCERIN/nodes/SNode' );
  const SO2Node = require( 'NITROGLYCERIN/nodes/SO2Node' );
  const SO3Node = require( 'NITROGLYCERIN/nodes/SO3Node' );

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

  return balancingChemicalEquations.register( 'MoleculeFactory', MoleculeFactory );
} );
