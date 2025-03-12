// Copyright 2014-2025, University of Colorado Boulder

/**
 * DisplacementEquation is the model for displacement equations.
 * In a displacement reactions, compounds exchange bonds or ions to form different compounds.
 * All displacement equations in this sim have 2 reactants and 2 products.
 * This class adds no new functionality to Equation, it simply provides convenient factory methods.
 *
 * @author Vasily Shakhov (mlearner.com)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import Equation from './Equation.js';
import EquationTerm from './EquationTerm.js';
import Molecule from './Molecule.js';

export default class DisplacementEquation extends Equation {

  /**
   * Constructor is private because the factory methods are used to create instances.
   * @param r1 - balanced coefficient for reactant1
   * @param reactant1
   * @param r2 - balanced coefficient for reactant1
   * @param reactant2
   * @param p1 - balanced coefficient for product1
   * @param product1
   * @param p2 - balanced coefficient for product2
   * @param product2
   */
  private constructor( r1: number, reactant1: Molecule, r2: number, reactant2: Molecule,
                       p1: number, product1: Molecule, p2: number, product2: Molecule ) {
    super(
      [ new EquationTerm( r1, reactant1 ), new EquationTerm( r2, reactant2 ) ],
      [ new EquationTerm( p1, product1 ), new EquationTerm( p2, product2 ) ]
    );
  }

  // CH4 + 2 O2 -> CO2 + 2 H2O
  public static create_CH4_2O2_CO2_2H2O(): DisplacementEquation {
    return new DisplacementEquation( 1, Molecule.CH4, 2, Molecule.O2, 1, Molecule.CO2, 2, Molecule.H2O );
  }

  // 2 C + 2 H2O -> CH4 + CO2
  public static create_2C_2H2O_CH4_CO2(): DisplacementEquation {
    return new DisplacementEquation( 2, Molecule.C, 2, Molecule.H2O, 1, Molecule.CH4, 1, Molecule.CO2 );
  }

  // CH4 + H2O -> 3 H2 + CO
  public static create_CH4_H2O_3H2_CO(): DisplacementEquation {
    return new DisplacementEquation( 1, Molecule.CH4, 1, Molecule.H2O, 3, Molecule.H2, 1, Molecule.CO );
  }

  // C2H4 + 3 O2 -> 2 CO2 + 2 H2O
  public static create_C2H4_3O2_2CO2_2H2O(): DisplacementEquation {
    return new DisplacementEquation( 1, Molecule.C2H4, 3, Molecule.O2, 2, Molecule.CO2, 2, Molecule.H2O );
  }

  // C2H6 + Cl2 -> C2H5Cl + HCl
  public static create_C2H6_Cl2_C2H5Cl_HCl(): DisplacementEquation {
    return new DisplacementEquation( 1, Molecule.C2H6, 1, Molecule.Cl2, 1, Molecule.C2H5Cl, 1, Molecule.HCl );
  }

  // CH4 + 4 S -> CS2 + 2 H2S
  public static create_CH4_4S_CS2_2H2S(): DisplacementEquation {
    return new DisplacementEquation( 1, Molecule.CH4, 4, Molecule.S, 1, Molecule.CS2, 2, Molecule.H2S );
  }

  // CS2 + 3 O2 -> CO2 + 2 SO2
  public static create_CS2_3O2_CO2_2SO2(): DisplacementEquation {
    return new DisplacementEquation( 1, Molecule.CS2, 3, Molecule.O2, 1, Molecule.CO2, 2, Molecule.SO2 );
  }

  // SO2 + 2 H2 -> S + 2 H2O
  public static create_SO2_2H2_S_2H2O(): DisplacementEquation {
    return new DisplacementEquation( 1, Molecule.SO2, 2, Molecule.H2, 1, Molecule.S, 2, Molecule.H2O );
  }

  // SO2 + 3 H2 -> H2S + 2 H2O
  public static create_SO2_3H2_H2S_2H2O(): DisplacementEquation {
    return new DisplacementEquation( 1, Molecule.SO2, 3, Molecule.H2, 1, Molecule.H2S, 2, Molecule.H2O );
  }

  // 2 F2 + H2O -> OF2 + 2 HF
  public static create_2F2_H2O_OF2_2HF(): DisplacementEquation {
    return new DisplacementEquation( 2, Molecule.F2, 1, Molecule.H2O, 1, Molecule.OF2, 2, Molecule.HF );
  }

  // OF2 + H2O -> O2 + 2 HF
  public static create_OF2_H2O_O2_2HF(): DisplacementEquation {
    return new DisplacementEquation( 1, Molecule.OF2, 1, Molecule.H2O, 1, Molecule.O2, 2, Molecule.HF );
  }

  // 2 C2H6 + 7 O2 -> 4 CO2 + 6 H2O
  public static create_2C2H6_7O2_4CO2_6H2O(): DisplacementEquation {
    return new DisplacementEquation( 2, Molecule.C2H6, 7, Molecule.O2, 4, Molecule.CO2, 6, Molecule.H2O );
  }

  // 4 CO2 + 6 H2O -> 2 C2H6 + 7 O2
  public static create_4CO2_6H2O_2C2H6_7O2(): DisplacementEquation {
    return new DisplacementEquation( 4, Molecule.CO2, 6, Molecule.H2O, 2, Molecule.C2H6, 7, Molecule.O2 );
  }

  // 2 C2H2 + 5 O2 -> 4 CO2 + 2 H2O
  public static create_2C2H2_5O2_4CO2_2H2O(): DisplacementEquation {
    return new DisplacementEquation( 2, Molecule.C2H2, 5, Molecule.O2, 4, Molecule.CO2, 2, Molecule.H2O );
  }

  // 4 CO2 + 2 H2O -> 2 C2H2 + 5 O2
  public static create_4CO2_2H2O_2C2H2_5O2(): DisplacementEquation {
    return new DisplacementEquation( 4, Molecule.CO2, 2, Molecule.H2O, 2, Molecule.C2H2, 5, Molecule.O2 );
  }

  // C2H5OH + 3 O2 -> 2 CO2 + 3 H2O
  public static create_C2H5OH_3O2_2CO2_3H2O(): DisplacementEquation {
    return new DisplacementEquation( 1, Molecule.C2H5OH, 3, Molecule.O2, 2, Molecule.CO2, 3, Molecule.H2O );
  }

  // 2 CO2 + 3 H2O -> C2H5OH + 3 O2
  public static create_2CO2_3H2O_C2H5OH_3O2(): DisplacementEquation {
    return new DisplacementEquation( 2, Molecule.CO2, 3, Molecule.H2O, 1, Molecule.C2H5OH, 3, Molecule.O2 );
  }

  // 4 NH3 + 3 O2 -> 2 N2 + 6 H2O
  public static create_4NH3_3O2_2N2_6H2O(): DisplacementEquation {
    return new DisplacementEquation( 4, Molecule.NH3, 3, Molecule.O2, 2, Molecule.N2, 6, Molecule.H2O );
  }

  // 2 N2 + 6 H2O -> 4 NH3 + 3 O2
  public static create_2N2_6H2O_4NH3_3O2(): DisplacementEquation {
    return new DisplacementEquation( 2, Molecule.N2, 6, Molecule.H2O, 4, Molecule.NH3, 3, Molecule.O2 );
  }

  // 4 NH3 + 5 O2 -> 4 NO + 6 H2O
  public static create_4NH3_5O2_4NO_6H2O(): DisplacementEquation {
    return new DisplacementEquation( 4, Molecule.NH3, 5, Molecule.O2, 4, Molecule.NO, 6, Molecule.H2O );
  }

  // 4 NO + 6 H2O -> 4 NH3 + 5 O2
  public static create_4NO_6H2O_4NH3_5O2(): DisplacementEquation {
    return new DisplacementEquation( 4, Molecule.NO, 6, Molecule.H2O, 4, Molecule.NH3, 5, Molecule.O2 );
  }

  // 4 NH3 + 7 O2 -> 4 NO2 + 6 H2O
  public static create_4NH3_7O2_4NO2_6H2O(): DisplacementEquation {
    return new DisplacementEquation( 4, Molecule.NH3, 7, Molecule.O2, 4, Molecule.NO2, 6, Molecule.H2O );
  }

  // 4 NO2 + 6 H2O -> 4 NH3 + 7 O2
  public static create_4NO2_6H2O_4NH3_7O2(): DisplacementEquation {
    return new DisplacementEquation( 4, Molecule.NO2, 6, Molecule.H2O, 4, Molecule.NH3, 7, Molecule.O2 );
  }

  // 4 NH3 + 6 NO -> 5 N2 + 6 H2O
  public static create_4NH3_6NO_5N2_6H2O(): DisplacementEquation {
    return new DisplacementEquation( 4, Molecule.NH3, 6, Molecule.NO, 5, Molecule.N2, 6, Molecule.H2O );
  }

  // 5 N2 + 6 H2O -> 4 NH3 + 6 NO
  public static create_5N2_6H2O_4NH3_6NO(): DisplacementEquation {
    return new DisplacementEquation( 5, Molecule.N2, 6, Molecule.H2O, 4, Molecule.NH3, 6, Molecule.NO );
  }
}

balancingChemicalEquations.register( 'DisplacementEquation', DisplacementEquation );