// Copyright 2025, University of Colorado Boulder

/**
 * GameLevel2 is level 2 in the Game screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import GameLevel, { EquationGenerator } from './GameLevel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import DisplacementEquation from '../../common/model/DisplacementEquation.js';
import RandomStrategy from './RandomStrategy.js';

const EQUATION_GENERATORS: EquationGenerator[] = [
  DisplacementEquation.create_2C_2H2O_CH4_CO2,
  DisplacementEquation.create_CH4_H2O_3H2_CO,
  DisplacementEquation.create_CH4_2O2_CO2_2H2O,
  DisplacementEquation.create_C2H4_3O2_2CO2_2H2O,
  DisplacementEquation.create_C2H6_Cl2_C2H5Cl_HCl,
  DisplacementEquation.create_CH4_4S_CS2_2H2S,
  DisplacementEquation.create_CS2_3O2_CO2_2SO2,
  DisplacementEquation.create_SO2_2H2_S_2H2O,
  DisplacementEquation.create_SO2_3H2_H2S_2H2O,
  DisplacementEquation.create_2F2_H2O_OF2_2HF,
  DisplacementEquation.create_OF2_H2O_O2_2HF
];

export default class GameLevel2 extends GameLevel {

  public constructor( tandem: Tandem ) {
    super( {
      levelNumber: 2,
      getBalancedRepresentation: () => dotRandom.nextDouble() < 0.5 ? 'balanceScales' : 'barCharts',
      equationGenerators: EQUATION_GENERATORS,
      equationGeneratorsSelectionStrategy: new RandomStrategy( EQUATION_GENERATORS, true ),
      tandem: tandem
    } );
  }
}

balancingChemicalEquations.register( 'GameLevel2', GameLevel2 );