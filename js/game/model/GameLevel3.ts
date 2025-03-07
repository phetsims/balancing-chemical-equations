// Copyright 2025, University of Colorado Boulder

/**
 * GameLevel3 is level 3 in the Game screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import GameLevel, { EquationGenerator } from './GameLevel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import RandomStrategy, { ExclusionsMap } from './RandomStrategy.js';
import DisplacementEquation from '../../common/model/DisplacementEquation.js';

const EQUATION_GENERATORS: EquationGenerator[] = [
  // This is the longest equation, and requires minX adjustment in EquationNode. Put it first to simplify layout testing with ?playAll.
  DisplacementEquation.create_C2H5OH_3O2_2CO2_3H2O,
  // This is the reverse of the previous equation. Put it here to simplify layout testing with ?playAll.
  DisplacementEquation.create_2CO2_3H2O_C2H5OH_3O2,
  DisplacementEquation.create_2C2H6_7O2_4CO2_6H2O,
  DisplacementEquation.create_4CO2_6H2O_2C2H6_7O2,
  DisplacementEquation.create_2C2H2_5O2_4CO2_2H2O,
  DisplacementEquation.create_4CO2_2H2O_2C2H2_5O2,
  DisplacementEquation.create_4NH3_3O2_2N2_6H2O,
  DisplacementEquation.create_2N2_6H2O_4NH3_3O2,
  DisplacementEquation.create_4NH3_5O2_4NO_6H2O,
  DisplacementEquation.create_4NO_6H2O_4NH3_5O2,
  DisplacementEquation.create_4NH3_7O2_4NO2_6H2O,
  DisplacementEquation.create_4NO2_6H2O_4NH3_7O2,
  DisplacementEquation.create_4NH3_6NO_5N2_6H2O,
  DisplacementEquation.create_5N2_6H2O_4NH3_6NO
];

/*
 *  Level 3 exclusions map
 *  This mess deserves some explanation... For level 3, the design team wanted a complicated
 *  strategy for selecting equations, where selection of an equation causes other equations to be
 *  ruled out as possible choices.  For example, if we choose an equation that contains 4NH3 as
 *  a reactant, we don't want to choose any other equations with 4NH3 as a reactant, and we don't
 *  want to choose the reverse equation.  Since this "exclusion" strategy was a moving target and
 *  the rules kept changing, I implemented this general solution, whereby a list of exclusions
 *  can be specified for each equation.
 */
const EXCLUSIONS_MAP: ExclusionsMap = new Map<EquationGenerator, EquationGenerator[]>();
EXCLUSIONS_MAP.set( DisplacementEquation.create_2C2H6_7O2_4CO2_6H2O, [
  DisplacementEquation.create_4CO2_6H2O_2C2H6_7O2, /* reverse equation */
  DisplacementEquation.create_2C2H2_5O2_4CO2_2H2O
] );
EXCLUSIONS_MAP.set( DisplacementEquation.create_4CO2_6H2O_2C2H6_7O2, [
  DisplacementEquation.create_2C2H6_7O2_4CO2_6H2O, /* reverse equation */
  DisplacementEquation.create_4CO2_2H2O_2C2H2_5O2
] );
EXCLUSIONS_MAP.set( DisplacementEquation.create_2C2H2_5O2_4CO2_2H2O, [
  DisplacementEquation.create_4CO2_2H2O_2C2H2_5O2, /* reverse equation */
  DisplacementEquation.create_2C2H6_7O2_4CO2_6H2O
] );
EXCLUSIONS_MAP.set( DisplacementEquation.create_4CO2_2H2O_2C2H2_5O2, [
  DisplacementEquation.create_2C2H2_5O2_4CO2_2H2O, /* reverse equation */
  DisplacementEquation.create_4CO2_6H2O_2C2H6_7O2
] );
EXCLUSIONS_MAP.set( DisplacementEquation.create_C2H5OH_3O2_2CO2_3H2O, [
  DisplacementEquation.create_2CO2_3H2O_C2H5OH_3O2 /* reverse equation */
] );
EXCLUSIONS_MAP.set( DisplacementEquation.create_2CO2_3H2O_C2H5OH_3O2, [
  DisplacementEquation.create_C2H5OH_3O2_2CO2_3H2O /* reverse equation */
] );
EXCLUSIONS_MAP.set( DisplacementEquation.create_4NH3_3O2_2N2_6H2O, [
  DisplacementEquation.create_2N2_6H2O_4NH3_3O2, /* reverse equation */
  DisplacementEquation.create_4NH3_5O2_4NO_6H2O, /* other equations with reactant 4NH3 */
  DisplacementEquation.create_4NH3_7O2_4NO2_6H2O,
  DisplacementEquation.create_4NH3_6NO_5N2_6H2O
] );
EXCLUSIONS_MAP.set( DisplacementEquation.create_4NH3_5O2_4NO_6H2O, [
  DisplacementEquation.create_4NO_6H2O_4NH3_5O2, /* reverse equation */
  DisplacementEquation.create_4NH3_3O2_2N2_6H2O, /* other equations with reactant 4NH3 */
  DisplacementEquation.create_4NH3_7O2_4NO2_6H2O,
  DisplacementEquation.create_4NH3_6NO_5N2_6H2O
] );
EXCLUSIONS_MAP.set( DisplacementEquation.create_4NH3_7O2_4NO2_6H2O, [
  DisplacementEquation.create_4NO2_6H2O_4NH3_7O2, /* reverse equation */
  DisplacementEquation.create_4NH3_3O2_2N2_6H2O, /* other equations with reactant 4NH3 */
  DisplacementEquation.create_4NH3_5O2_4NO_6H2O,
  DisplacementEquation.create_4NH3_6NO_5N2_6H2O
] );
EXCLUSIONS_MAP.set( DisplacementEquation.create_4NH3_6NO_5N2_6H2O, [
  DisplacementEquation.create_5N2_6H2O_4NH3_6NO, /* reverse equation */
  DisplacementEquation.create_4NH3_3O2_2N2_6H2O, /* other equations with reactant 4NH3 */
  DisplacementEquation.create_4NH3_5O2_4NO_6H2O,
  DisplacementEquation.create_4NH3_7O2_4NO2_6H2O
] );
EXCLUSIONS_MAP.set( DisplacementEquation.create_2N2_6H2O_4NH3_3O2, [
  DisplacementEquation.create_4NH3_3O2_2N2_6H2O, /* reverse equation */
  DisplacementEquation.create_4NO_6H2O_4NH3_5O2, /* other equations with product 4NH3 */
  DisplacementEquation.create_4NO2_6H2O_4NH3_7O2,
  DisplacementEquation.create_5N2_6H2O_4NH3_6NO
] );
EXCLUSIONS_MAP.set( DisplacementEquation.create_4NO_6H2O_4NH3_5O2, [
  DisplacementEquation.create_4NH3_5O2_4NO_6H2O, /* reverse equation */
  DisplacementEquation.create_2N2_6H2O_4NH3_3O2, /* other equations with product 4NH3 */
  DisplacementEquation.create_4NO2_6H2O_4NH3_7O2,
  DisplacementEquation.create_5N2_6H2O_4NH3_6NO
] );
EXCLUSIONS_MAP.set( DisplacementEquation.create_4NO2_6H2O_4NH3_7O2, [
  DisplacementEquation.create_4NH3_7O2_4NO2_6H2O, /* reverse equation */
  DisplacementEquation.create_2N2_6H2O_4NH3_3O2, /* other equations with product 4NH3 */
  DisplacementEquation.create_4NO_6H2O_4NH3_5O2,
  DisplacementEquation.create_5N2_6H2O_4NH3_6NO
] );
EXCLUSIONS_MAP.set( DisplacementEquation.create_5N2_6H2O_4NH3_6NO, [
  DisplacementEquation.create_4NH3_6NO_5N2_6H2O, /* reverse equation */
  DisplacementEquation.create_2N2_6H2O_4NH3_3O2, /* other equations with product 4NH3 */
  DisplacementEquation.create_4NO_6H2O_4NH3_5O2,
  DisplacementEquation.create_4NO2_6H2O_4NH3_7O2
] );

export default class GameLevel3 extends GameLevel {

  public constructor( tandem: Tandem ) {
    super( {
      levelNumber: 3,
      getBalancedRepresentation: () => 'barCharts',
      equationGenerators: EQUATION_GENERATORS,
      equationGeneratorsSelectionStrategy: new RandomStrategy( EQUATION_GENERATORS, true, {
        exclusionsMap: EXCLUSIONS_MAP
      } ),
      tandem: tandem
    } );
  }
}

balancingChemicalEquations.register( 'GameLevel3', GameLevel3 );