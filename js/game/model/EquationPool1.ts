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

    const equations: Equation[] = [
      // This is the largest molecule. Put it first to simplify layout testing with ?playAll.
      Equation.create1Reactant2Products( 1, Molecule.PCl5, 1, Molecule.PCl3, 1, Molecule.Cl2, coefficientsRange,
        tandem.createTandem( `equation${equationIndex++}` ), EquationPool.coefficientPropertyPhetioReadOnly ),
      // This equation requires maxX adjustment in EquationNode. Put it here to simplify layout testing with ?playAll.
      Equation.create1Reactant2Products( 1, Molecule.CH3OH, 1, Molecule.CO, 2, Molecule.H2, coefficientsRange,
        tandem.createTandem( `equation${equationIndex++}` ), EquationPool.coefficientPropertyPhetioReadOnly ),
      Equation.create2Reactants1Product( 2, Molecule.H2, 1, Molecule.O2, 2, Molecule.H2O, coefficientsRange,
        tandem.createTandem( `equation${equationIndex++}` ), EquationPool.coefficientPropertyPhetioReadOnly ),
      Equation.create2Reactants1Product( 1, Molecule.H2, 1, Molecule.F2, 2, Molecule.HF, coefficientsRange,
        tandem.createTandem( `equation${equationIndex++}` ), EquationPool.coefficientPropertyPhetioReadOnly ),
      Equation.create1Reactant2Products( 2, Molecule.HCl, 1, Molecule.H2, 1, Molecule.Cl2, coefficientsRange,
        tandem.createTandem( `equation${equationIndex++}` ), EquationPool.coefficientPropertyPhetioReadOnly ),
      Equation.create2Reactants1Product( 1, Molecule.CH2O, 1, Molecule.H2, 1, Molecule.CH3OH, coefficientsRange,
        tandem.createTandem( `equation${equationIndex++}` ), EquationPool.coefficientPropertyPhetioReadOnly ),
      Equation.create1Reactant2Products( 1, Molecule.C2H6, 1, Molecule.C2H4, 1, Molecule.H2, coefficientsRange,
        tandem.createTandem( `equation${equationIndex++}` ), EquationPool.coefficientPropertyPhetioReadOnly ),
      Equation.create2Reactants1Product( 1, Molecule.C2H2, 2, Molecule.H2, 1, Molecule.C2H6, coefficientsRange,
        tandem.createTandem( `equation${equationIndex++}` ), EquationPool.coefficientPropertyPhetioReadOnly ),
      Equation.create2Reactants1Product( 1, Molecule.C, 1, Molecule.O2, 1, Molecule.CO2, coefficientsRange,
        tandem.createTandem( `equation${equationIndex++}` ), EquationPool.coefficientPropertyPhetioReadOnly ),
      Equation.create2Reactants1Product( 2, Molecule.C, 1, Molecule.O2, 2, Molecule.CO, coefficientsRange,
        tandem.createTandem( `equation${equationIndex++}` ), EquationPool.coefficientPropertyPhetioReadOnly ),
      Equation.create1Reactant2Products( 2, Molecule.CO2, 2, Molecule.CO, 1, Molecule.O2, coefficientsRange,
        tandem.createTandem( `equation${equationIndex++}` ), EquationPool.coefficientPropertyPhetioReadOnly ),
      Equation.create1Reactant2Products( 2, Molecule.CO, 1, Molecule.C, 1, Molecule.CO2, coefficientsRange,
        tandem.createTandem( `equation${equationIndex++}` ), EquationPool.coefficientPropertyPhetioReadOnly ),
      Equation.create2Reactants1Product( 1, Molecule.C, 2, Molecule.S, 1, Molecule.CS2, coefficientsRange,
        tandem.createTandem( `equation${equationIndex++}` ), EquationPool.coefficientPropertyPhetioReadOnly ),
      Equation.create1Reactant2Products( 2, Molecule.NH3, 1, Molecule.N2, 3, Molecule.H2, coefficientsRange,
        tandem.createTandem( `equation${equationIndex++}` ), EquationPool.coefficientPropertyPhetioReadOnly ),
      Equation.create1Reactant2Products( 2, Molecule.NO, 1, Molecule.N2, 1, Molecule.O2, coefficientsRange,
        tandem.createTandem( `equation${equationIndex++}` ), EquationPool.coefficientPropertyPhetioReadOnly ),
      Equation.create1Reactant2Products( 2, Molecule.NO2, 2, Molecule.NO, 1, Molecule.O2, coefficientsRange,
        tandem.createTandem( `equation${equationIndex++}` ), EquationPool.coefficientPropertyPhetioReadOnly ),
      Equation.create2Reactants1Product( 2, Molecule.N2, 1, Molecule.O2, 2, Molecule.N2O, coefficientsRange,
        tandem.createTandem( `equation${equationIndex++}` ), EquationPool.coefficientPropertyPhetioReadOnly ),
      Equation.create2Reactants1Product( 1, Molecule.P4, 6, Molecule.H2, 4, Molecule.PH3, coefficientsRange,
        tandem.createTandem( `equation${equationIndex++}` ), EquationPool.coefficientPropertyPhetioReadOnly ),
      Equation.create2Reactants1Product( 1, Molecule.P4, 6, Molecule.F2, 4, Molecule.PF3, coefficientsRange,
        tandem.createTandem( `equation${equationIndex++}` ), EquationPool.coefficientPropertyPhetioReadOnly ),
      Equation.create1Reactant2Products( 4, Molecule.PCl3, 1, Molecule.P4, 6, Molecule.Cl2, coefficientsRange,
        tandem.createTandem( `equation${equationIndex++}` ), EquationPool.coefficientPropertyPhetioReadOnly ),
      Equation.create1Reactant2Products( 2, Molecule.SO3, 2, Molecule.SO2, 1, Molecule.O2, coefficientsRange,
        tandem.createTandem( `equation${equationIndex++}` ), EquationPool.coefficientPropertyPhetioReadOnly )
    ];

    super( equations, {
      firstBigMolecule: false,
      tandem: tandem
    } );
  }
}

balancingChemicalEquations.register( 'EquationPool1', EquationPool1 );