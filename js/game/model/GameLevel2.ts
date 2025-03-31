// Copyright 2025, University of Colorado Boulder

/**
 * GameLevel2 is level 2 in the Game screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import GameLevel from './GameLevel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Range from '../../../../dot/js/Range.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import DisplacementEquation from '../../common/model/DisplacementEquation.js';
import RandomStrategy from './RandomStrategy.js';
import Molecule from '../../common/model/Molecule.js';
import Equation from '../../common/model/Equation.js';

export default class GameLevel2 extends GameLevel {

  public constructor( coefficientsRange: Range, tandem: Tandem ) {

    const equationPoolTandem = tandem.createTandem( GameLevel.EQUATION_POOL_TANDEM_NAME );
    let equationIndex = 0;

    const equationPool: Equation[] = [
      new DisplacementEquation( 2, Molecule.C, 2, Molecule.H2O, 1, Molecule.CH4, 1, Molecule.CO2, coefficientsRange,
        equationPoolTandem.createTandem( `equation${equationIndex++}` ) ),
      new DisplacementEquation( 1, Molecule.CH4, 1, Molecule.H2O, 3, Molecule.H2, 1, Molecule.CO, coefficientsRange,
        equationPoolTandem.createTandem( `equation${equationIndex++}` ) ),
      new DisplacementEquation( 1, Molecule.CH4, 2, Molecule.O2, 1, Molecule.CO2, 2, Molecule.H2O, coefficientsRange,
        equationPoolTandem.createTandem( `equation${equationIndex++}` ) ),
      new DisplacementEquation( 1, Molecule.C2H4, 3, Molecule.O2, 2, Molecule.CO2, 2, Molecule.H2O, coefficientsRange,
        equationPoolTandem.createTandem( `equation${equationIndex++}` ) ),
      new DisplacementEquation( 1, Molecule.C2H6, 1, Molecule.Cl2, 1, Molecule.C2H5Cl, 1, Molecule.HCl, coefficientsRange,
        equationPoolTandem.createTandem( `equation${equationIndex++}` ) ),
      new DisplacementEquation( 1, Molecule.CH4, 4, Molecule.S, 1, Molecule.CS2, 2, Molecule.H2S, coefficientsRange,
        equationPoolTandem.createTandem( `equation${equationIndex++}` ) ),
      new DisplacementEquation( 1, Molecule.CS2, 3, Molecule.O2, 1, Molecule.CO2, 2, Molecule.SO2, coefficientsRange,
        equationPoolTandem.createTandem( `equation${equationIndex++}` ) ),
      new DisplacementEquation( 1, Molecule.SO2, 2, Molecule.H2, 1, Molecule.S, 2, Molecule.H2O, coefficientsRange,
        equationPoolTandem.createTandem( `equation${equationIndex++}` ) ),
      new DisplacementEquation( 1, Molecule.SO2, 3, Molecule.H2, 1, Molecule.H2S, 2, Molecule.H2O, coefficientsRange,
        equationPoolTandem.createTandem( `equation${equationIndex++}` ) ),
      new DisplacementEquation( 2, Molecule.F2, 1, Molecule.H2O, 1, Molecule.OF2, 2, Molecule.HF, coefficientsRange,
        equationPoolTandem.createTandem( `equation${equationIndex++}` ) ),
      new DisplacementEquation( 1, Molecule.OF2, 1, Molecule.H2O, 1, Molecule.O2, 2, Molecule.HF, coefficientsRange,
        equationPoolTandem.createTandem( `equation${equationIndex++}` ) )
    ];

    super( {
      levelNumber: 2,
      iconMolecule: Molecule.H2O,
      coefficientsRange: coefficientsRange,
      getBalancedRepresentation: () => dotRandom.nextDouble() < 0.5 ? 'balanceScales' : 'barChart',
      equationPool: equationPool,
      equationSelectionStrategy: new RandomStrategy( equationPool ),
      tandem: tandem
    } );
  }
}

balancingChemicalEquations.register( 'GameLevel2', GameLevel2 );