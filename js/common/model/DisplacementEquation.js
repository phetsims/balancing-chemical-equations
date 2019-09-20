// Copyright 2014-2019, University of Colorado Boulder

/**
 * Base type for displacement equations.
 * In a displacement reactions, compounds exchange bonds or ions to form different compounds.
 * All displacement equations in this sim have 2 reactants and 2 products.
 * This base type adds no new functionality to Equation, it simply provides convenient factory functions.
 *
 * @author Vasily Shakhov (mlearner.com)
 */
define( require => {
  'use strict';

  // modules
  const balancingChemicalEquations = require( 'BALANCING_CHEMICAL_EQUATIONS/balancingChemicalEquations' );
  const Equation = require( 'BALANCING_CHEMICAL_EQUATIONS/common/model/Equation' );
  const EquationTerm = require( 'BALANCING_CHEMICAL_EQUATIONS/common/model/EquationTerm' );
  const inherit = require( 'PHET_CORE/inherit' );
  const MoleculeFactory = require( 'BALANCING_CHEMICAL_EQUATIONS/common/model/MoleculeFactory' );

  /**
   * Convenience constructor.
   *
   * @param {number} r1 balanced coefficient for reactant1
   * @param {Molecule} reactant1
   * @param {number} r2 balanced coefficient for reactant1
   * @param {Molecule} reactant2
   * @param {number} p1 balanced coefficient for product1
   * @param {Molecule} product1
   * @param {number} p2 balanced coefficient for product2
   * @param {Molecule} product2
   * @param {Object} [options]
   * @constructor
   */
  function DisplacementEquation( r1, reactant1, r2, reactant2, p1, product1, p2, product2, options ) {
    Equation.call( this, [ new EquationTerm( r1, reactant1 ), new EquationTerm( r2, reactant2 ) ], [ new EquationTerm( p1, product1 ), new EquationTerm( p2, product2 ) ], options );
  }

  balancingChemicalEquations.register( 'DisplacementEquation', DisplacementEquation );

  return inherit( Equation, DisplacementEquation, {}, {

    // CH4 + 2 O2 -> CO2 + 2 H2O
    create_CH4_2O2_CO2_2H2O: function() {
      return new DisplacementEquation( 1, MoleculeFactory.CH4(), 2, MoleculeFactory.O2(), 1, MoleculeFactory.CO2(), 2, MoleculeFactory.H2O() );
    },

    // 2 C + 2 H2O -> CH4 + CO2
    create_2C_2H2O_CH4_CO2: function() {
      return new DisplacementEquation( 2, MoleculeFactory.C(), 2, MoleculeFactory.H2O(), 1, MoleculeFactory.CH4(), 1, MoleculeFactory.CO2() );
    },

    // CH4 + H2O -> 3 H2 + CO
    create_CH4_H2O_3H2_CO: function() {
      return new DisplacementEquation( 1, MoleculeFactory.CH4(), 1, MoleculeFactory.H2O(), 3, MoleculeFactory.H2(), 1, MoleculeFactory.CO() );
    },

    // C2H4 + 3 O2 -> 2 CO2 + 2 H2O
    create_C2H4_3O2_2CO2_2H2O: function() {
      return new DisplacementEquation( 1, MoleculeFactory.C2H4(), 3, MoleculeFactory.O2(), 2, MoleculeFactory.CO2(), 2, MoleculeFactory.H2O() );
    },

    // C2H6 + Cl2 -> C2H5Cl + HCl
    create_C2H6_Cl2_C2H5Cl_HCl: function() {
      return new DisplacementEquation( 1, MoleculeFactory.C2H6(), 1, MoleculeFactory.Cl2(), 1, MoleculeFactory.C2H5Cl(), 1, MoleculeFactory.HCl() );
    },

    // CH4 + 4 S -> CS2 + 2 H2S
    create_CH4_4S_CS2_2H2S: function() {
      return new DisplacementEquation( 1, MoleculeFactory.CH4(), 4, MoleculeFactory.S(), 1, MoleculeFactory.CS2(), 2, MoleculeFactory.H2S() );
    },

    // CS2 + 3 O2 -> CO2 + 2 SO2
    create_CS2_3O2_CO2_2SO2: function() {
      return new DisplacementEquation( 1, MoleculeFactory.CS2(), 3, MoleculeFactory.O2(), 1, MoleculeFactory.CO2(), 2, MoleculeFactory.SO2() );
    },

    // SO2 + 2 H2 -> S + 2 H2O
    create_SO2_2H2_S_2H2O: function() {
      return new DisplacementEquation( 1, MoleculeFactory.SO2(), 2, MoleculeFactory.H2(), 1, MoleculeFactory.S(), 2, MoleculeFactory.H2O() );
    },

    // SO2 + 3 H2 -> H2S + 2 H2O
    create_SO2_3H2_H2S_2H2O: function() {
      return new DisplacementEquation( 1, MoleculeFactory.SO2(), 3, MoleculeFactory.H2(), 1, MoleculeFactory.H2S(), 2, MoleculeFactory.H2O() );
    },

    // 2 F2 + H2O -> OF2 + 2 HF
    create_2F2_H2O_OF2_2HF: function() {
      return new DisplacementEquation( 2, MoleculeFactory.F2(), 1, MoleculeFactory.H2O(), 1, MoleculeFactory.OF2(), 2, MoleculeFactory.HF() );
    },

    // OF2 + H2O -> O2 + 2 HF
    create_OF2_H2O_O2_2HF: function() {
      return new DisplacementEquation( 1, MoleculeFactory.OF2(), 1, MoleculeFactory.H2O(), 1, MoleculeFactory.O2(), 2, MoleculeFactory.HF() );
    },

    // 2 C2H6 + 7 O2 -> 4 CO2 + 6 H2O
    create_2C2H6_7O2_4CO2_6H2O: function() {
      return new DisplacementEquation( 2, MoleculeFactory.C2H6(), 7, MoleculeFactory.O2(), 4, MoleculeFactory.CO2(), 6, MoleculeFactory.H2O() );
    },

    // 4 CO2 + 6 H2O -> 2 C2H6 + 7 O2
    create_4CO2_6H2O_2C2H6_7O2: function() {
      return new DisplacementEquation( 4, MoleculeFactory.CO2(), 6, MoleculeFactory.H2O(), 2, MoleculeFactory.C2H6(), 7, MoleculeFactory.O2() );
    },

    // 2 C2H2 + 5 O2 -> 4 CO2 + 2 H2O
    create_2C2H2_5O2_4CO2_2H2O: function() {
      return new DisplacementEquation( 2, MoleculeFactory.C2H2(), 5, MoleculeFactory.O2(), 4, MoleculeFactory.CO2(), 2, MoleculeFactory.H2O() );
    },

    // 4 CO2 + 2 H2O -> 2 C2H2 + 5 O2
    create_4CO2_2H2O_2C2H2_5O2: function() {
      return new DisplacementEquation( 4, MoleculeFactory.CO2(), 2, MoleculeFactory.H2O(), 2, MoleculeFactory.C2H2(), 5, MoleculeFactory.O2() );
    },

    // C2H5OH + 3 O2 -> 2 CO2 + 3 H2O
    create_C2H5OH_3O2_2CO2_3H2O: function() {
      return new DisplacementEquation( 1, MoleculeFactory.C2H5OH(), 3, MoleculeFactory.O2(), 2, MoleculeFactory.CO2(), 3, MoleculeFactory.H2O() );
    },

    // 2 CO2 + 3 H2O -> C2H5OH + 3 O2
    create_2CO2_3H2O_C2H5OH_3O2: function() {
      return new DisplacementEquation( 2, MoleculeFactory.CO2(), 3, MoleculeFactory.H2O(), 1, MoleculeFactory.C2H5OH(), 3, MoleculeFactory.O2() );
    },

    // 4 NH3 + 3 O2 -> 2 N2 + 6 H2O
    create_4NH3_3O2_2N2_6H2O: function() {
      return new DisplacementEquation( 4, MoleculeFactory.NH3(), 3, MoleculeFactory.O2(), 2, MoleculeFactory.N2(), 6, MoleculeFactory.H2O() );
    },

    // 2 N2 + 6 H2O -> 4 NH3 + 3 O2
    create_2N2_6H2O_4NH3_3O2: function() {
      return new DisplacementEquation( 2, MoleculeFactory.N2(), 6, MoleculeFactory.H2O(), 4, MoleculeFactory.NH3(), 3, MoleculeFactory.O2() );
    },

    // 4 NH3 + 5 O2 -> 4 NO + 6 H2O
    create_4NH3_5O2_4NO_6H2O: function() {
      return new DisplacementEquation( 4, MoleculeFactory.NH3(), 5, MoleculeFactory.O2(), 4, MoleculeFactory.NO(), 6, MoleculeFactory.H2O() );
    },

    // 4 NO + 6 H2O -> 4 NH3 + 5 O2
    create_4NO_6H2O_4NH3_5O2: function() {
      return new DisplacementEquation( 4, MoleculeFactory.NO(), 6, MoleculeFactory.H2O(), 4, MoleculeFactory.NH3(), 5, MoleculeFactory.O2() );
    },

    // 4 NH3 + 7 O2 -> 4 NO2 + 6 H2O
    create_4NH3_7O2_4NO2_6H2O: function() {
      return new DisplacementEquation( 4, MoleculeFactory.NH3(), 7, MoleculeFactory.O2(), 4, MoleculeFactory.NO2(), 6, MoleculeFactory.H2O() );
    },

    // 4 NO2 + 6 H2O -> 4 NH3 + 7 O2
    create_4NO2_6H2O_4NH3_7O2: function() {
      return new DisplacementEquation( 4, MoleculeFactory.NO2(), 6, MoleculeFactory.H2O(), 4, MoleculeFactory.NH3(), 7, MoleculeFactory.O2() );
    },

    // 4 NH3 + 6 NO -> 5 N2 + 6 H2O
    create_4NH3_6NO_5N2_6H2O: function() {
      return new DisplacementEquation( 4, MoleculeFactory.NH3(), 6, MoleculeFactory.NO(), 5, MoleculeFactory.N2(), 6, MoleculeFactory.H2O() );
    },

    // 5 N2 + 6 H2O -> 4 NH3 + 6 NO
    create_5N2_6H2O_4NH3_6NO: function() {
      return new DisplacementEquation( 5, MoleculeFactory.N2(), 6, MoleculeFactory.H2O(), 4, MoleculeFactory.NH3(), 6, MoleculeFactory.NO() );
    }
  } );
} );