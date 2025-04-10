// Copyright 2025, University of Colorado Boulder

/**
 * EquationPool2 is the pool of equations for Game level 2.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Range from '../../../../dot/js/Range.js';
import EquationPool from './EquationPool.js';
import Molecule from '../../common/model/Molecule.js';
import Equation from '../../common/model/Equation.js';

export default class EquationPool2 extends EquationPool {

  public constructor( coefficientsRange: Range, tandem: Tandem ) {

    let equationIndex = 0;

    // Factors out the duplication for creating an Equation with 2 reactants and 2 products.
    const create2Reactants2Products = ( r1: number, reactant1: Molecule, r2: number, reactant2: Molecule,
                                        p1: number, product1: Molecule, p2: number, product2: Molecule ) =>
      Equation.create2Reactants2Products( r1, reactant1, r2, reactant2, p1, product1, p2, product2, coefficientsRange,
        tandem.createTandem( `equation${equationIndex++}` ), EquationPool.coefficientPropertyPhetioReadOnly );

    // The equations in the pool.
    const equations: Equation[] = [
      create2Reactants2Products( 2, Molecule.C, 2, Molecule.H2O, 1, Molecule.CH4, 1, Molecule.CO2 ),
      create2Reactants2Products( 1, Molecule.CH4, 1, Molecule.H2O, 3, Molecule.H2, 1, Molecule.CO ),
      create2Reactants2Products( 1, Molecule.CH4, 2, Molecule.O2, 1, Molecule.CO2, 2, Molecule.H2O ),
      create2Reactants2Products( 1, Molecule.C2H4, 3, Molecule.O2, 2, Molecule.CO2, 2, Molecule.H2O ),
      create2Reactants2Products( 1, Molecule.C2H6, 1, Molecule.Cl2, 1, Molecule.C2H5Cl, 1, Molecule.HCl ),
      create2Reactants2Products( 1, Molecule.CH4, 4, Molecule.S, 1, Molecule.CS2, 2, Molecule.H2S ),
      create2Reactants2Products( 1, Molecule.CS2, 3, Molecule.O2, 1, Molecule.CO2, 2, Molecule.SO2 ),
      create2Reactants2Products( 1, Molecule.SO2, 2, Molecule.H2, 1, Molecule.S, 2, Molecule.H2O ),
      create2Reactants2Products( 1, Molecule.SO2, 3, Molecule.H2, 1, Molecule.H2S, 2, Molecule.H2O ),
      create2Reactants2Products( 2, Molecule.F2, 1, Molecule.H2O, 1, Molecule.OF2, 2, Molecule.HF ),
      create2Reactants2Products( 1, Molecule.OF2, 1, Molecule.H2O, 1, Molecule.O2, 2, Molecule.HF )
    ];

    super( equations, {
      tandem: tandem
    } );
  }
}

balancingChemicalEquations.register( 'EquationPool2', EquationPool2 );