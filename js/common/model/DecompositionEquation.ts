// Copyright 2014-2023, University of Colorado Boulder

// @ts-nocheck
/**
 * DecompositionEquation is the class for decomposition equations.
 * In a decomposition reaction, a more complex substance breaks down into its more simple parts.
 * All decomposition equations in this sim have 1 reactant and 2 products.
 * This base type adds no new functionality to Equation, it simply provides convenient factory functions.
 *
 * @author Vasily Shakhov (mlearner.com)
 */

import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import Equation from './Equation.js';
import EquationTerm from './EquationTerm.js';
import Molecule from './Molecule.js';

export default class DecompositionEquation extends Equation {

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

  // @public 2 H2O -> 2 H2 + O2
  static create_2H2O_2H2_O2() {
    return new DecompositionEquation( 2, Molecule.H2O, 2, Molecule.H2, 1, Molecule.O2 );
  }

  // @public 2 HCl -> H2 + Cl2
  static create_2HCl_H2_Cl2() {
    return new DecompositionEquation( 2, Molecule.HCl, 1, Molecule.H2, 1, Molecule.Cl2 );
  }

  // @public CH3OH -> CO + 2 H2
  static create_CH3OH_CO_2H2() {
    return new DecompositionEquation( 1, Molecule.CH3OH, 1, Molecule.CO, 2, Molecule.H2 );
  }

  // @public C2H6 -> C2H4 + H2
  static create_C2H6_C2H4_H2() {
    return new DecompositionEquation( 1, Molecule.C2H6, 1, Molecule.C2H4, 1, Molecule.H2 );
  }

  // @public 2 CO2 -> 2 CO + O2
  static create_2CO2_2CO_O2() {
    return new DecompositionEquation( 2, Molecule.CO2, 2, Molecule.CO, 1, Molecule.O2 );
  }

  // @public 2 CO -> C + CO2
  static create_2CO_C_CO2() {
    return new DecompositionEquation( 2, Molecule.CO, 1, Molecule.C, 1, Molecule.CO2 );
  }

  // @public 2 NH3 -> N2 + 3 H2
  static create_2NH3_N2_3H2() {
    return new DecompositionEquation( 2, Molecule.NH3, 1, Molecule.N2, 3, Molecule.H2 );
  }

  // @public 2 NO -> N2 + O2
  static create_2NO_N2_O2() {
    return new DecompositionEquation( 2, Molecule.NO, 1, Molecule.N2, 1, Molecule.O2 );
  }

  // @public 2 NO2 -> 2 NO + O2
  static create_2NO2_2NO_O2() {
    return new DecompositionEquation( 2, Molecule.NO2, 2, Molecule.NO, 1, Molecule.O2 );
  }

  // @public 4 PCl3 -> P4 + 6 Cl2
  static create_4PCl3_P4_6Cl2() {
    return new DecompositionEquation( 4, Molecule.PCl3, 1, Molecule.P4, 6, Molecule.Cl2 );
  }

  // @public PCl5 -> PCl3 + Cl2
  static create_PCl5_PCl3_Cl2() {
    return new DecompositionEquation( 1, Molecule.PCl5, 1, Molecule.PCl3, 1, Molecule.Cl2 );
  }

  // @public 2 SO3 -> 2 SO2 + O2
  static create_2SO3_2SO2_O2() {
    return new DecompositionEquation( 2, Molecule.SO3, 2, Molecule.SO2, 1, Molecule.O2 );
  }
}

balancingChemicalEquations.register( 'DecompositionEquation', DecompositionEquation );