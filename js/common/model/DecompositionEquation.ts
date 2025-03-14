// Copyright 2014-2025, University of Colorado Boulder

/**
 * DecompositionEquation is the model for decomposition equations.
 * In a decomposition reaction, a more complex substance breaks down into its more simple parts.
 * All decomposition equations in this sim have 1 reactant and 2 products.
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

export default class DecompositionEquation extends Equation {

  /**
   * Constructor is private because the factory methods are used to create instances.
   * @param r1 - balanced coefficient for reactant1
   * @param reactant1
   * @param p1 - balanced coefficient for product1
   * @param product1
   * @param p2 - balanced coefficient for product2
   * @param product2
   * @param tandem
   */
  private constructor( r1: number, reactant1: Molecule, p1: number, product1: Molecule, p2: number, product2: Molecule, tandem = Tandem.OPT_OUT ) {

    const termsTandem = tandem.createTandem( 'terms' );

    super(
      [
        new EquationTerm( r1, reactant1, { tandem: termsTandem.createTandem( reactant1.symbolPlainText ) } )
      ],
      [
        new EquationTerm( p1, product1, { tandem: termsTandem.createTandem( product1.symbolPlainText ) } ),
        new EquationTerm( p2, product2, { tandem: termsTandem.createTandem( product2.symbolPlainText ) } )
      ],
      tandem
    );
  }

  // 2 H2O -> 2 H2 + O2 (Separate Water)
  public static create_2H2O_2H2_O2( tandem = Tandem.OPT_OUT ): DecompositionEquation {
    return new DecompositionEquation( 2, Molecule.H2O, 2, Molecule.H2, 1, Molecule.O2, tandem );
  }

  // 2 HCl -> H2 + Cl2
  public static create_2HCl_H2_Cl2(): DecompositionEquation {
    return new DecompositionEquation( 2, Molecule.HCl, 1, Molecule.H2, 1, Molecule.Cl2 );
  }

  // CH3OH -> CO + 2 H2
  public static create_CH3OH_CO_2H2(): DecompositionEquation {
    return new DecompositionEquation( 1, Molecule.CH3OH, 1, Molecule.CO, 2, Molecule.H2 );
  }

  // C2H6 -> C2H4 + H2
  public static create_C2H6_C2H4_H2(): DecompositionEquation {
    return new DecompositionEquation( 1, Molecule.C2H6, 1, Molecule.C2H4, 1, Molecule.H2 );
  }

  // 2 CO2 -> 2 CO + O2
  public static create_2CO2_2CO_O2(): DecompositionEquation {
    return new DecompositionEquation( 2, Molecule.CO2, 2, Molecule.CO, 1, Molecule.O2 );
  }

  // 2 CO -> C + CO2
  public static create_2CO_C_CO2(): DecompositionEquation {
    return new DecompositionEquation( 2, Molecule.CO, 1, Molecule.C, 1, Molecule.CO2 );
  }

  // 2 NH3 -> N2 + 3 H2
  public static create_2NH3_N2_3H2(): DecompositionEquation {
    return new DecompositionEquation( 2, Molecule.NH3, 1, Molecule.N2, 3, Molecule.H2 );
  }

  // 2 NO -> N2 + O2
  public static create_2NO_N2_O2(): DecompositionEquation {
    return new DecompositionEquation( 2, Molecule.NO, 1, Molecule.N2, 1, Molecule.O2 );
  }

  // 2 NO2 -> 2 NO + O2
  public static create_2NO2_2NO_O2(): DecompositionEquation {
    return new DecompositionEquation( 2, Molecule.NO2, 2, Molecule.NO, 1, Molecule.O2 );
  }

  // 4 PCl3 -> P4 + 6 Cl2
  public static create_4PCl3_P4_6Cl2(): DecompositionEquation {
    return new DecompositionEquation( 4, Molecule.PCl3, 1, Molecule.P4, 6, Molecule.Cl2 );
  }

  // PCl5 -> PCl3 + Cl2
  public static create_PCl5_PCl3_Cl2(): DecompositionEquation {
    return new DecompositionEquation( 1, Molecule.PCl5, 1, Molecule.PCl3, 1, Molecule.Cl2 );
  }

  // 2 SO3 -> 2 SO2 + O2
  public static create_2SO3_2SO2_O2(): DecompositionEquation {
    return new DecompositionEquation( 2, Molecule.SO3, 2, Molecule.SO2, 1, Molecule.O2 );
  }
}

balancingChemicalEquations.register( 'DecompositionEquation', DecompositionEquation );