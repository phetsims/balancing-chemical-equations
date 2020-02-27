// Copyright 2014-2020, University of Colorado Boulder

/**
 * Base type for decomposition equations.
 * In a decomposition reaction, a more complex substance breaks down into its more simple parts.
 * All decomposition equations in this sim have 1 reactant and 2 products.
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
  const MoleculeFactory = require( 'BALANCING_CHEMICAL_EQUATIONS/common/model/MoleculeFactory' );

  class DecompositionEquation extends Equation {

    /**
     * @param {number} r1 balanced coefficient for reactant1
     * @param {Molecule} reactant1
     * @param {number} p1 balanced coefficient for product1
     * @param {Molecule} product1
     * @param {number} p2 balanced coefficient for product2
     * @param {Molecule} product2
     * @param {Object} [options]
     */
    constructor( r1, reactant1, p1, product1, p2, product2, options ) {
      super(
        [ new EquationTerm( r1, reactant1 ) ],
        [ new EquationTerm( p1, product1 ), new EquationTerm( p2, product2 ) ],
        options
      );
    }

    // @public @static

    // 2 H2O -> 2 H2 + O2
    static create_2H2O_2H2_O2() {
      return new DecompositionEquation( 2, MoleculeFactory.H2O(), 2, MoleculeFactory.H2(), 1, MoleculeFactory.O2() );
    }

    // 2 HCl -> H2 + Cl2
    static create_2HCl_H2_Cl2() {
      return new DecompositionEquation( 2, MoleculeFactory.HCl(), 1, MoleculeFactory.H2(), 1, MoleculeFactory.Cl2() );
    }

    // CH3OH -> CO + 2 H2
    static create_CH3OH_CO_2H2() {
      return new DecompositionEquation( 1, MoleculeFactory.CH3OH(), 1, MoleculeFactory.CO(), 2, MoleculeFactory.H2() );
    }

    // C2H6 -> C2H4 + H2
    static create_C2H6_C2H4_H2() {
      return new DecompositionEquation( 1, MoleculeFactory.C2H6(), 1, MoleculeFactory.C2H4(), 1, MoleculeFactory.H2() );
    }

    // 2 CO2 -> 2 CO + O2
    static create_2CO2_2CO_O2() {
      return new DecompositionEquation( 2, MoleculeFactory.CO2(), 2, MoleculeFactory.CO(), 1, MoleculeFactory.O2() );
    }

    // 2 CO -> C + CO2
    static create_2CO_C_CO2() {
      return new DecompositionEquation( 2, MoleculeFactory.CO(), 1, MoleculeFactory.C(), 1, MoleculeFactory.CO2() );
    }

    // 2 NH3 -> N2 + 3 H2
    static create_2NH3_N2_3H2() {
      return new DecompositionEquation( 2, MoleculeFactory.NH3(), 1, MoleculeFactory.N2(), 3, MoleculeFactory.H2() );
    }

    // 2 NO -> N2 + O2
    static create_2NO_N2_O2() {
      return new DecompositionEquation( 2, MoleculeFactory.NO(), 1, MoleculeFactory.N2(), 1, MoleculeFactory.O2() );
    }

    // 2 NO2 -> 2 NO + O2
    static create_2NO2_2NO_O2() {
      return new DecompositionEquation( 2, MoleculeFactory.NO2(), 2, MoleculeFactory.NO(), 1, MoleculeFactory.O2() );
    }

    // 4 PCl3 -> P4 + 6 Cl2
    static create_4PCl3_P4_6Cl2() {
      return new DecompositionEquation( 4, MoleculeFactory.PCl3(), 1, MoleculeFactory.P4(), 6, MoleculeFactory.Cl2() );
    }

    // PCl5 -> PCl3 + Cl2
    static create_PCl5_PCl3_Cl2() {
      return new DecompositionEquation( 1, MoleculeFactory.PCl5(), 1, MoleculeFactory.PCl3(), 1, MoleculeFactory.Cl2() );
    }

    // 2 SO3 -> 2 SO2 + O2
    static create_2SO3_2SO2_O2() {
      return new DecompositionEquation( 2, MoleculeFactory.SO3(), 2, MoleculeFactory.SO2(), 1, MoleculeFactory.O2() );
    }
  }

  return balancingChemicalEquations.register( 'DecompositionEquation', DecompositionEquation );
} );