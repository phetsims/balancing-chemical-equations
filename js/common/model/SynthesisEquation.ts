// Copyright 2014-2025, University of Colorado Boulder

/**
 * SynthesisEquation is the model for synthesis equations.
 * In a synthesis reaction two or more chemical species combine to form a more complex product.
 * All synthesis equations in this sim have 2 reactants and 1 product.
 * This class adds no new functionality to Equation, it simply provides convenient factory methods.
 *
 * @author Vasily Shakhov (mlearner.com)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import Equation from './Equation.js';
import EquationTerm from './EquationTerm.js';
import Molecule from './Molecule.js';

export default class SynthesisEquation extends Equation {

  /**
   * Constructor is private because the factory methods are used to create instances.
   * @param r1 - balanced coefficient for reactant1
   * @param reactant1
   * @param r2 - balanced coefficient for reactant2
   * @param reactant2
   * @param p1 - balanced coefficient for product1
   * @param product1
   * @param tandem
   */
  private constructor( r1: number, reactant1: Molecule, r2: number, reactant2: Molecule, p1: number, product1: Molecule, tandem = Tandem.OPT_OUT ) {

    const termsTandem = tandem.createTandem( 'terms' );

    super(
      [
        new EquationTerm( r1, reactant1, { tandem: termsTandem.createTandem( reactant1.symbolPlainText ) } ),
        new EquationTerm( r2, reactant2, { tandem: termsTandem.createTandem( reactant2.symbolPlainText ) } )
      ],
      [
        new EquationTerm( p1, product1, { tandem: termsTandem.createTandem( product1.symbolPlainText ) } )
      ],
      tandem
    );
  }

  // 2 H2 + O2 -> 2 H2O
  public static create_2H2_O2_2H2O(): SynthesisEquation {
    return new SynthesisEquation( 2, Molecule.H2, 1, Molecule.O2, 2, Molecule.H2O );
  }

  // H2 + F2 -> 2 HF
  public static create_H2_F2_2HF(): SynthesisEquation {
    return new SynthesisEquation( 1, Molecule.H2, 1, Molecule.F2, 2, Molecule.HF );
  }

  // CH2O + H2 -> CH3OH
  public static create_CH2O_H2_CH3OH(): SynthesisEquation {
    return new SynthesisEquation( 1, Molecule.CH2O, 1, Molecule.H2, 1, Molecule.CH3OH );
  }

  // C2H2 + 2 H2 -> C2H6
  public static create_C2H2_2H2_C2H6(): SynthesisEquation {
    return new SynthesisEquation( 1, Molecule.C2H2, 2, Molecule.H2, 1, Molecule.C2H6 );
  }

  // C + O2 -> CO2
  public static create_C_O2_CO2(): SynthesisEquation {
    return new SynthesisEquation( 1, Molecule.C, 1, Molecule.O2, 1, Molecule.CO2 );
  }

  // 2 C + O2 -> 2 CO
  public static create_2C_O2_2CO(): SynthesisEquation {
    return new SynthesisEquation( 2, Molecule.C, 1, Molecule.O2, 2, Molecule.CO );
  }

  // C + 2 S -> CS2
  public static create_C_2S_CS2(): SynthesisEquation {
    return new SynthesisEquation( 1, Molecule.C, 2, Molecule.S, 1, Molecule.CS2 );
  }

  // N2 + 3 H2 -> 2 NH3 (Make Ammonia)
  public static create_N2_3H2_2NH3( tandem = Tandem.OPT_OUT ): SynthesisEquation {
    return new SynthesisEquation( 1, Molecule.N2, 3, Molecule.H2, 2, Molecule.NH3, tandem );
  }

  // 2 N2 + O2 -> 2 N2O
  public static create_2N2_O2_2N2O(): SynthesisEquation {
    return new SynthesisEquation( 2, Molecule.N2, 1, Molecule.O2, 2, Molecule.N2O );
  }

  // P4 + 6 H2 -> 4 PH3
  public static create_P4_6H2_4PH3(): SynthesisEquation {
    return new SynthesisEquation( 1, Molecule.P4, 6, Molecule.H2, 4, Molecule.PH3 );
  }

  // P4 + 6 F2 -> 4 PF3
  public static create_P4_6F2_4PF3(): SynthesisEquation {
    return new SynthesisEquation( 1, Molecule.P4, 6, Molecule.F2, 4, Molecule.PF3 );
  }
}

balancingChemicalEquations.register( 'SynthesisEquation', SynthesisEquation );