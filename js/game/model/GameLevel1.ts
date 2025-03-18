// Copyright 2025, University of Colorado Boulder

/**
 * GameLevel1 is level 1 in the Game screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import GameLevel from './GameLevel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Range from '../../../../dot/js/Range.js';
import DecompositionEquation from '../../common/model/DecompositionEquation.js';
import SynthesisEquation from '../../common/model/SynthesisEquation.js';
import RandomStrategy from './RandomStrategy.js';
import Molecule from '../../common/model/Molecule.js';
import Equation from '../../common/model/Equation.js';

export default class GameLevel1 extends GameLevel {

  public constructor( coefficientsRange: Range, tandem: Tandem ) {

    const equationPoolTandem = tandem.createTandem( GameLevel.EQUATION_POOL_TANDEM_NAME );
    let equationIndex = 0;

    const equationPool: Equation[] = [
      // This is the largest molecule. Put it first to simplify layout testing with ?playAll.
      new DecompositionEquation( 1, Molecule.PCl5, 1, Molecule.PCl3, 1, Molecule.Cl2, coefficientsRange,
        equationPoolTandem.createTandem( `equation${equationIndex++}` ) ),
      // This equation requires maxX adjustment in EquationNode. Put it here to simplify layout testing with ?playAll.
      new DecompositionEquation( 1, Molecule.CH3OH, 1, Molecule.CO, 2, Molecule.H2, coefficientsRange,
        equationPoolTandem.createTandem( `equation${equationIndex++}` ) ),
      new SynthesisEquation( 2, Molecule.H2, 1, Molecule.O2, 2, Molecule.H2O, coefficientsRange,
        equationPoolTandem.createTandem( `equation${equationIndex++}` ) ),
      new SynthesisEquation( 1, Molecule.H2, 1, Molecule.F2, 2, Molecule.HF, coefficientsRange,
        equationPoolTandem.createTandem( `equation${equationIndex++}` ) ),
      new DecompositionEquation( 2, Molecule.HCl, 1, Molecule.H2, 1, Molecule.Cl2, coefficientsRange,
        equationPoolTandem.createTandem( `equation${equationIndex++}` ) ),
      new SynthesisEquation( 1, Molecule.CH2O, 1, Molecule.H2, 1, Molecule.CH3OH, coefficientsRange,
        equationPoolTandem.createTandem( `equation${equationIndex++}` ) ),
      new DecompositionEquation( 1, Molecule.C2H6, 1, Molecule.C2H4, 1, Molecule.H2, coefficientsRange,
        equationPoolTandem.createTandem( `equation${equationIndex++}` ) ),
      new SynthesisEquation( 1, Molecule.C2H2, 2, Molecule.H2, 1, Molecule.C2H6, coefficientsRange,
        equationPoolTandem.createTandem( `equation${equationIndex++}` ) ),
      new SynthesisEquation( 1, Molecule.C, 1, Molecule.O2, 1, Molecule.CO2, coefficientsRange,
        equationPoolTandem.createTandem( `equation${equationIndex++}` ) ),
      new SynthesisEquation( 2, Molecule.C, 1, Molecule.O2, 2, Molecule.CO, coefficientsRange,
        equationPoolTandem.createTandem( `equation${equationIndex++}` ) ),
      new DecompositionEquation( 2, Molecule.CO2, 2, Molecule.CO, 1, Molecule.O2, coefficientsRange,
        equationPoolTandem.createTandem( `equation${equationIndex++}` ) ),
      new DecompositionEquation( 2, Molecule.CO, 1, Molecule.C, 1, Molecule.CO2, coefficientsRange,
        equationPoolTandem.createTandem( `equation${equationIndex++}` ) ),
      new SynthesisEquation( 1, Molecule.C, 2, Molecule.S, 1, Molecule.CS2, coefficientsRange,
        equationPoolTandem.createTandem( `equation${equationIndex++}` ) ),
      new DecompositionEquation( 2, Molecule.NH3, 1, Molecule.N2, 3, Molecule.H2, coefficientsRange,
        equationPoolTandem.createTandem( `equation${equationIndex++}` ) ),
      new DecompositionEquation( 2, Molecule.NO, 1, Molecule.N2, 1, Molecule.O2, coefficientsRange,
        equationPoolTandem.createTandem( `equation${equationIndex++}` ) ),
      new DecompositionEquation( 2, Molecule.NO2, 2, Molecule.NO, 1, Molecule.O2, coefficientsRange,
        equationPoolTandem.createTandem( `equation${equationIndex++}` ) ),
      new SynthesisEquation( 2, Molecule.N2, 1, Molecule.O2, 2, Molecule.N2O, coefficientsRange,
        equationPoolTandem.createTandem( `equation${equationIndex++}` ) ),
      new SynthesisEquation( 1, Molecule.P4, 6, Molecule.H2, 4, Molecule.PH3, coefficientsRange,
        equationPoolTandem.createTandem( `equation${equationIndex++}` ) ),
      new SynthesisEquation( 1, Molecule.P4, 6, Molecule.F2, 4, Molecule.PF3, coefficientsRange,
        equationPoolTandem.createTandem( `equation${equationIndex++}` ) ),
      new DecompositionEquation( 4, Molecule.PCl3, 1, Molecule.P4, 6, Molecule.Cl2, coefficientsRange,
        equationPoolTandem.createTandem( `equation${equationIndex++}` ) ),
      new DecompositionEquation( 2, Molecule.SO3, 2, Molecule.SO2, 1, Molecule.O2, coefficientsRange,
        equationPoolTandem.createTandem( `equation${equationIndex++}` ) )
    ];

    super( {
      levelNumber: 1,
      iconMolecule: Molecule.HCl,
      coefficientsRange: coefficientsRange,
      getBalancedRepresentation: () => 'balanceScales',
      equationPool: equationPool,
      equationSelectionStrategy: new RandomStrategy( equationPool, {
        firstBigMolecule: false
      } ),
      tandem: tandem
    } );
  }
}

balancingChemicalEquations.register( 'GameLevel1', GameLevel1 );