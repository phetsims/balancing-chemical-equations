[object Promise]

/**
 * Base type for synthesis equations.
 * In a synthesis reaction two or more chemical species combine to form a more complex product.
 * All synthesis equations in this sim have 2 reactants and 1 product.
 * This base type adds no new functionality to Equation, it simply provides convenient factory functions.
 *
 * @author Vasily Shakhov (mlearner.com)
 */

import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import Equation from './Equation.js';
import EquationTerm from './EquationTerm.js';
import MoleculeFactory from './MoleculeFactory.js';

class SynthesisEquation extends Equation {

  /**
   * @param {number} r1 balanced coefficient for reactant1
   * @param {Molecule} reactant1
   * @param {number} r2 balanced coefficient for reactant2
   * @param {Molecule} reactant2
   * @param {number} p1 balanced coefficient for product1
   * @param {Molecule} product1
   * @param {Object} [options]
   */
  constructor( r1, reactant1, r2, reactant2, p1, product1, options ) {
    super(
      [ new EquationTerm( r1, reactant1 ), new EquationTerm( r2, reactant2 ) ],
      [ new EquationTerm( p1, product1 ) ],
      options
    );
  }

  // @public 2 H2 + O2 -> 2 H2O
  static create_2H2_O2_2H2O() {
    return new SynthesisEquation( 2, MoleculeFactory.H2(), 1, MoleculeFactory.O2(), 2, MoleculeFactory.H2O() );
  }

  // @public H2 + F2 -> 2 HF
  static create_H2_F2_2HF() {
    return new SynthesisEquation( 1, MoleculeFactory.H2(), 1, MoleculeFactory.F2(), 2, MoleculeFactory.HF() );
  }

  // @public CH2O + H2 -> CH3OH
  static create_CH2O_H2_CH3OH() {
    return new SynthesisEquation( 1, MoleculeFactory.CH2O(), 1, MoleculeFactory.H2(), 1, MoleculeFactory.CH3OH() );
  }

  // @public C2H2 + 2 H2 -> C2H6
  static create_C2H2_2H2_C2H6() {
    return new SynthesisEquation( 1, MoleculeFactory.C2H2(), 2, MoleculeFactory.H2(), 1, MoleculeFactory.C2H6() );
  }

  // @public C + O2 -> CO2
  static create_C_O2_CO2() {
    return new SynthesisEquation( 1, MoleculeFactory.C(), 1, MoleculeFactory.O2(), 1, MoleculeFactory.CO2() );
  }

  // @public 2 C + O2 -> 2 CO
  static create_2C_O2_2CO() {
    return new SynthesisEquation( 2, MoleculeFactory.C(), 1, MoleculeFactory.O2(), 2, MoleculeFactory.CO() );
  }

  // @public C + 2 S -> CS2
  static create_C_2S_CS2() {
    return new SynthesisEquation( 1, MoleculeFactory.C(), 2, MoleculeFactory.S(), 1, MoleculeFactory.CS2() );
  }

  // @public N2 + 3 H2 -> 2 NH3
  static create_N2_3H2_2NH3() {
    return new SynthesisEquation( 1, MoleculeFactory.N2(), 3, MoleculeFactory.H2(), 2, MoleculeFactory.NH3() );
  }

  // @public 2 N2 + O2 -> 2 N2O
  static create_2N2_O2_2N2O() {
    return new SynthesisEquation( 2, MoleculeFactory.N2(), 1, MoleculeFactory.O2(), 2, MoleculeFactory.N2O() );
  }

  // @public P4 + 6 H2 -> 4 PH3
  static create_P4_6H2_4PH3() {
    return new SynthesisEquation( 1, MoleculeFactory.P4(), 6, MoleculeFactory.H2(), 4, MoleculeFactory.PH3() );
  }

  // @public P4 + 6 F2 -> 4 PF3
  static create_P4_6F2_4PF3() {
    return new SynthesisEquation( 1, MoleculeFactory.P4(), 6, MoleculeFactory.F2(), 4, MoleculeFactory.PF3() );
  }
}

balancingChemicalEquations.register( 'SynthesisEquation', SynthesisEquation );
export default SynthesisEquation;