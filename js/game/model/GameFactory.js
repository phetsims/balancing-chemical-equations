[object Promise]

/**
 * Factory that creates a game.
 * A game is a set of equations to be balanced.
 * The equations are chosen from a 'pool', and each game level has its own pool.
 *
 * Equations are instantiated by calling factory functions.
 * We need new equations for each game, and we need to be able to exclude some types of equations
 * during the equation selection process.
 *
 * @author Vasily Shakhov (mlearner.com)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import BCEQueryParameters from '../../common/BCEQueryParameters.js';
import DecompositionEquation from '../../common/model/DecompositionEquation.js';
import DisplacementEquation from '../../common/model/DisplacementEquation.js';
import SynthesisEquation from '../../common/model/SynthesisEquation.js';
import RandomStrategy from './RandomStrategy.js';

// constants
const EQUATIONS_PER_GAME = 5;

// Level 1 equation pool
const LEVEL1_POOL = [
  // this is the largest molecule, put it first to simplify layout testing
  DecompositionEquation.create_PCl5_PCl3_Cl2,
  // this equation requires maxX adjustment in EquationNode, put it here to simplify layout testing
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

// Level 2 equation pool
const LEVEL2_POOL = [
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

// Level 3 equation pool
const LEVEL3_POOL = [
  // this is the longest equation, requires minX adjustment in EquationNode, put it first to simplify layout testing
  DisplacementEquation.create_C2H5OH_3O2_2CO2_3H2O,
  // this is the reverse of the previous equation
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

// all pools, indexed by level
const POOLS = [ LEVEL1_POOL, LEVEL2_POOL, LEVEL3_POOL ];

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
const LEVEL3_EXCLUSIONS = {
  create_2C2H6_7O2_4CO2_6H2O: [
    DisplacementEquation.create_4CO2_6H2O_2C2H6_7O2, /* reverse equation */
    DisplacementEquation.create_2C2H2_5O2_4CO2_2H2O
  ],
  create_4CO2_6H2O_2C2H6_7O2: [
    DisplacementEquation.create_2C2H6_7O2_4CO2_6H2O, /* reverse equation */
    DisplacementEquation.create_4CO2_2H2O_2C2H2_5O2
  ],
  create_2C2H2_5O2_4CO2_2H2O: [
    DisplacementEquation.create_4CO2_2H2O_2C2H2_5O2, /* reverse equation */
    DisplacementEquation.create_2C2H6_7O2_4CO2_6H2O
  ],
  create_4CO2_2H2O_2C2H2_5O2: [
    DisplacementEquation.create_2C2H2_5O2_4CO2_2H2O, /* reverse equation */
    DisplacementEquation.create_4CO2_6H2O_2C2H6_7O2
  ],
  create_C2H5OH_3O2_2CO2_3H2O: [
    DisplacementEquation.create_2CO2_3H2O_C2H5OH_3O2 /* reverse equation */
  ],
  create_2CO2_3H2O_C2H5OH_3O2: [
    DisplacementEquation.create_C2H5OH_3O2_2CO2_3H2O /* reverse equation */
  ],
  create_4NH3_3O2_2N2_6H2O: [
    DisplacementEquation.create_2N2_6H2O_4NH3_3O2, /* reverse equation */
    DisplacementEquation.create_4NH3_5O2_4NO_6H2O, /* other equations with reactant 4NH3 */
    DisplacementEquation.create_4NH3_7O2_4NO2_6H2O,
    DisplacementEquation.create_4NH3_6NO_5N2_6H2O
  ],
  create_4NH3_5O2_4NO_6H2O: [
    DisplacementEquation.create_4NO_6H2O_4NH3_5O2, /* reverse equation */
    DisplacementEquation.create_4NH3_3O2_2N2_6H2O, /* other equations with reactant 4NH3 */
    DisplacementEquation.create_4NH3_7O2_4NO2_6H2O,
    DisplacementEquation.create_4NH3_6NO_5N2_6H2O
  ],
  create_4NH3_7O2_4NO2_6H2O: [
    DisplacementEquation.create_4NO2_6H2O_4NH3_7O2, /* reverse equation */
    DisplacementEquation.create_4NH3_3O2_2N2_6H2O, /* other equations with reactant 4NH3 */
    DisplacementEquation.create_4NH3_5O2_4NO_6H2O,
    DisplacementEquation.create_4NH3_6NO_5N2_6H2O
  ],
  create_4NH3_6NO_5N2_6H2O: [
    DisplacementEquation.create_5N2_6H2O_4NH3_6NO, /* reverse equation */
    DisplacementEquation.create_4NH3_3O2_2N2_6H2O, /* other equations with reactant 4NH3 */
    DisplacementEquation.create_4NH3_5O2_4NO_6H2O,
    DisplacementEquation.create_4NH3_7O2_4NO2_6H2O
  ],
  create_2N2_6H2O_4NH3_3O2: [
    DisplacementEquation.create_4NH3_3O2_2N2_6H2O, /* reverse equation */
    DisplacementEquation.create_4NO_6H2O_4NH3_5O2, /* other equations with product 4NH3 */
    DisplacementEquation.create_4NO2_6H2O_4NH3_7O2,
    DisplacementEquation.create_5N2_6H2O_4NH3_6NO
  ],
  create_4NO_6H2O_4NH3_5O2: [
    DisplacementEquation.create_4NH3_5O2_4NO_6H2O, /* reverse equation */
    DisplacementEquation.create_2N2_6H2O_4NH3_3O2, /* other equations with product 4NH3 */
    DisplacementEquation.create_4NO2_6H2O_4NH3_7O2,
    DisplacementEquation.create_5N2_6H2O_4NH3_6NO
  ],
  create_4NO2_6H2O_4NH3_7O2: [
    DisplacementEquation.create_4NH3_7O2_4NO2_6H2O, /* reverse equation */
    DisplacementEquation.create_2N2_6H2O_4NH3_3O2, /* other equations with product 4NH3 */
    DisplacementEquation.create_4NO_6H2O_4NH3_5O2,
    DisplacementEquation.create_5N2_6H2O_4NH3_6NO
  ],
  create_5N2_6H2O_4NH3_6NO: [
    DisplacementEquation.create_4NH3_6NO_5N2_6H2O, /* reverse equation */
    DisplacementEquation.create_2N2_6H2O_4NH3_3O2, /* other equations with product 4NH3 */
    DisplacementEquation.create_4NO_6H2O_4NH3_5O2,
    DisplacementEquation.create_4NO2_6H2O_4NH3_7O2
  ]
};

// strategies for selecting equations, indexed by game level
const STRATEGIES = [
  new RandomStrategy( LEVEL1_POOL, false ),
  new RandomStrategy( LEVEL2_POOL, true ),
  new RandomStrategy( LEVEL3_POOL, true, { exclusions: LEVEL3_EXCLUSIONS } )
];

const GameFactory = {

  /**
   * Gets the number of equations for a level.
   * If we're playing all equations for testing purposes, return the entire pool length.
   * @param {number} level
   * @returns {Window.length|*}
   */
  getNumberOfEquations: function( level ) {
    return BCEQueryParameters.playAll ? POOLS[ level ].length : EQUATIONS_PER_GAME;
  },

  /**
   * Creates a set of equations to be used in the game.
   * If 'playAll' query parameter is defined, return all equations for the level.
   * @param {number} level
   * @returns {Equation}
   */
  createEquations: function( level ) {

    // Get an array of Equation factory functions.
    const factoryFunctions = BCEQueryParameters.playAll ?
                             _.clone( POOLS[ level ] ) :
                             STRATEGIES[ level ].getEquationFactoryFunctions( EQUATIONS_PER_GAME );

    // Instantiate one instance of each Equation type.
    const equations = [];
    factoryFunctions.forEach( factoryFunction => equations.push( factoryFunction() ) );
    return equations;
  }
};

balancingChemicalEquations.register( 'GameFactory', GameFactory );
export default GameFactory;