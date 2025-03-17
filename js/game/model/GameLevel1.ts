// Copyright 2025, University of Colorado Boulder

/**
 * GameLevel1 is level 1 in the Game screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import GameLevel, { EquationGenerator } from './GameLevel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Range from '../../../../dot/js/Range.js';
import DecompositionEquation from '../../common/model/DecompositionEquation.js';
import SynthesisEquation from '../../common/model/SynthesisEquation.js';
import RandomStrategy from './RandomStrategy.js';
import Molecule from '../../common/model/Molecule.js';

const EQUATION_GENERATORS: EquationGenerator[] = [
  // This is the largest molecule. Put it first to simplify layout testing with ?playAll.
  DecompositionEquation.create_PCl5_PCl3_Cl2,
  // This equation requires maxX adjustment in EquationNode. Put it here to simplify layout testing with ?playAll.
  DecompositionEquation.create_CH3OH_CO_2H2,
  SynthesisEquation.create_CH2O_H2_CH3OH,
  SynthesisEquation.create_2H2_O2_2H2O,
  SynthesisEquation.create_H2_F2_2HF,
  DecompositionEquation.create_2HCl_H2_Cl2,
  SynthesisEquation.create_CH2O_H2_CH3OH,
  DecompositionEquation.create_C2H6_C2H4_H2,
  SynthesisEquation.create_C2H2_2H2_C2H6,
  SynthesisEquation.create_C_O2_CO2,
  SynthesisEquation.create_2C_O2_2CO,
  DecompositionEquation.create_2CO2_2CO_O2,
  DecompositionEquation.create_2CO_C_CO2,
  SynthesisEquation.create_C_2S_CS2,
  DecompositionEquation.create_2NH3_N2_3H2,
  DecompositionEquation.create_2NO_N2_O2,
  DecompositionEquation.create_2NO2_2NO_O2,
  SynthesisEquation.create_2N2_O2_2N2O,
  SynthesisEquation.create_P4_6H2_4PH3,
  SynthesisEquation.create_P4_6F2_4PF3,
  DecompositionEquation.create_4PCl3_P4_6Cl2,
  DecompositionEquation.create_2SO3_2SO2_O2
];

export default class GameLevel1 extends GameLevel {

  public constructor( coefficientRange: Range, tandem: Tandem ) {
    super( {
      levelNumber: 1,
      iconMolecule: Molecule.HCl,
      coefficientRange: coefficientRange,
      getBalancedRepresentation: () => 'balanceScales',
      equationGenerators: EQUATION_GENERATORS,
      equationGeneratorsSelectionStrategy: new RandomStrategy( EQUATION_GENERATORS, coefficientRange, {
        firstBigMolecule: false
      } ),
      tandem: tandem
    } );
  }
}

balancingChemicalEquations.register( 'GameLevel1', GameLevel1 );