// Copyright 2025, University of Colorado Boulder

/**
* EquationPool1 is the pool of equations for Game level 1.
 *
 * @author Chris Malley (PixelZoom, Inc.)
*/

import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Range from '../../../../dot/js/Range.js';
import EquationPool from './EquationPool.js';
import Molecule from '../../common/model/Molecule.js';
import Equation from '../../common/model/Equation.js';

export default class EquationPool1 extends EquationPool {

  public constructor( coefficientsRange: Range, tandem: Tandem ) {

    let equationIndex = 0;

    // Factors out the duplication for creating an Equation with 1 reactant and 2 products.
    const create1Reactant2Products = ( r1: number, reactant1: Molecule, p1: number, product1: Molecule, p2: number, product2: Molecule ) =>
      Equation.create1Reactant2Products( r1, reactant1, p1, product1, p2, product2, coefficientsRange,
        tandem.createTandem( `equation${equationIndex++}` ), EquationPool.coefficientPropertyPhetioReadOnly );

    // Factors out the duplication for creating an Equation with 2 reactants and 1 product.
    const create2Reactants1Product = ( r1: number, reactant1: Molecule, r2: number, reactant2: Molecule, p1: number, product1: Molecule ) =>
      Equation.create2Reactants1Product( r1, reactant1, r2, reactant2, p1, product1, coefficientsRange,
        tandem.createTandem( `equation${equationIndex++}` ), EquationPool.coefficientPropertyPhetioReadOnly );

    // The equations in the pool.
    const equations: Equation[] = [
      // This is the largest molecule. Put it first to simplify layout testing with ?playAll.
      create1Reactant2Products( 1, Molecule.PCl5, 1, Molecule.PCl3, 1, Molecule.Cl2 ),
      // This equation requires maxX adjustment in EquationNode. Put it here to simplify layout testing with ?playAll.
      create1Reactant2Products( 1, Molecule.CH3OH, 1, Molecule.CO, 2, Molecule.H2 ),
      create2Reactants1Product( 2, Molecule.H2, 1, Molecule.O2, 2, Molecule.H2O ),
      create2Reactants1Product( 1, Molecule.H2, 1, Molecule.F2, 2, Molecule.HF ),
      create1Reactant2Products( 2, Molecule.HCl, 1, Molecule.H2, 1, Molecule.Cl2 ),
      create2Reactants1Product( 1, Molecule.CH2O, 1, Molecule.H2, 1, Molecule.CH3OH ),
      create1Reactant2Products( 1, Molecule.C2H6, 1, Molecule.C2H4, 1, Molecule.H2 ),
      create2Reactants1Product( 1, Molecule.C2H2, 2, Molecule.H2, 1, Molecule.C2H6 ),
      create2Reactants1Product( 1, Molecule.C, 1, Molecule.O2, 1, Molecule.CO2 ),
      create2Reactants1Product( 2, Molecule.C, 1, Molecule.O2, 2, Molecule.CO ),
      create1Reactant2Products( 2, Molecule.CO2, 2, Molecule.CO, 1, Molecule.O2 ),
      create1Reactant2Products( 2, Molecule.CO, 1, Molecule.C, 1, Molecule.CO2 ),
      create2Reactants1Product( 1, Molecule.C, 2, Molecule.S, 1, Molecule.CS2 ),
      create1Reactant2Products( 2, Molecule.NH3, 1, Molecule.N2, 3, Molecule.H2 ),
      create1Reactant2Products( 2, Molecule.NO, 1, Molecule.N2, 1, Molecule.O2 ),
      create1Reactant2Products( 2, Molecule.NO2, 2, Molecule.NO, 1, Molecule.O2 ),
      create2Reactants1Product( 2, Molecule.N2, 1, Molecule.O2, 2, Molecule.N2O ),
      create2Reactants1Product( 1, Molecule.P4, 6, Molecule.H2, 4, Molecule.PH3 ),
      create2Reactants1Product( 1, Molecule.P4, 6, Molecule.F2, 4, Molecule.PF3 ),
      create1Reactant2Products( 4, Molecule.PCl3, 1, Molecule.P4, 6, Molecule.Cl2 ),
      create1Reactant2Products( 2, Molecule.SO3, 2, Molecule.SO2, 1, Molecule.O2 )
    ];

    super( equations, {
      firstBigMolecule: false,
      tandem: tandem
    } );
  }
}

balancingChemicalEquations.register( 'EquationPool1', EquationPool1 );