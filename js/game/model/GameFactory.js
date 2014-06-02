// Copyright 2002-2014, University of Colorado Boulder

/**
 * Factory that creates a game.
 * A game is a set of equations to be balanced.
 * The equations are chosen from a "pool", and each game level has its own pool.
 * <p>
 * Equations are instantiated using reflection because we need new equations
 * for each game, and we need to be able to exclude some types of equations
 * during the equation selection process.
 *
 * @author Vasily Shakhov (mlearner.com)
 */

define( function( require ) {
  'use strict';

  //modules
  var SynthesisEquation = require( 'BALANCING_CHEMICAL_EQUATIONS/common/model/SynthesisEquation.SynthesisEquation' );
  var DecompositionEquation = require( 'BALANCING_CHEMICAL_EQUATIONS/common/model/DecompositionEquation.DecompositionEquation' );
  var DisplacementEquation = require( 'BALANCING_CHEMICAL_EQUATIONS/common/model/DisplacementEquation' );

  var GameFactory = function() {

    // Level 1 pool
    this.LEVEL1_POOL = [
      SynthesisEquation.Synthesis_2H2_O2_2H2O,
      SynthesisEquation.Synthesis_H2_F2_2HF,
      DecompositionEquation.Decomposition_2HCl_H2_Cl2,
      DecompositionEquation.Decomposition_CH3OH_CO_2H2,
      SynthesisEquation.Synthesis_CH2O_H2_CH3OH,
      DecompositionEquation.Decomposition_C2H6_C2H4_H2,
      SynthesisEquation.Synthesis_C2H2_2H2_C2H6,
      SynthesisEquation.Synthesis_C_O2_CO2,
      SynthesisEquation.Synthesis_2C_O2_2CO,
      DecompositionEquation.Decomposition_2CO2_2CO_O2,
      DecompositionEquation.Decomposition_2CO_C_CO2,
      SynthesisEquation.Synthesis_C_2S_CS2,
      DecompositionEquation.Decomposition_2NH3_N2_3H2,
      DecompositionEquation.Decomposition_2NO_N2_O2,
      DecompositionEquation.Decomposition_2NO2_2NO_O2,
      SynthesisEquation.Synthesis_2N2_O2_2N2O,
      SynthesisEquation.Synthesis_P4_6H2_4PH3,
      SynthesisEquation.Synthesis_P4_6F2_4PF3,
      DecompositionEquation.Decomposition_4PCl3_P4_6Cl2,
      DecompositionEquation.Decomposition_PCl5_PCl3_Cl2,
      DecompositionEquation.Decomposition_2SO3_2SO2_O2
    ];

    // Level 2 pool
    this.LEVEL2_POOL = [
      DisplacementEquation.Displacement_2C_2H2O_CH4_CO2,
      DisplacementEquation.Displacement_CH4_H2O_3H2_CO,
      DisplacementEquation.Displacement_CH4_2O2_CO2_2H2O,
      DisplacementEquation.Displacement_C2H4_3O2_2CO2_2H2O,
      DisplacementEquation.Displacement_C2H6_Cl2_C2H5Cl_HCl,
      DisplacementEquation.Displacement_CH4_4S_CS2_2H2S,
      DisplacementEquation.Displacement_CS2_3O2_CO2_2SO2,
      DisplacementEquation.Displacement_SO2_2H2_S_2H2O,
      DisplacementEquation.Displacement_SO2_3H2_H2S_2H2O,
      DisplacementEquation.Displacement_2F2_H2O_OF2_2HF,
      DisplacementEquation.Displacement_OF2_H2O_O2_2HF
    ];

    // Level 3 pool
    this.LEVEL3_POOL = [
      DisplacementEquation.Displacement_2C2H6_7O2_4CO2_6H2O,
      DisplacementEquation.Displacement_4CO2_6H2O_2C2H6_7O2,
      DisplacementEquation.Displacement_2C2H2_5O2_4CO2_2H2O,
      DisplacementEquation.Displacement_4CO2_2H2O_2C2H2_5O2,
      DisplacementEquation.Displacement_C2H5OH_3O2_2CO2_3H2O,
      DisplacementEquation.Displacement_2CO2_3H2O_C2H5OH_3O2,
      DisplacementEquation.Displacement_4NH3_3O2_2N2_6H2O,
      DisplacementEquation.Displacement_2N2_6H2O_4NH3_3O2,
      DisplacementEquation.Displacement_4NH3_5O2_4NO_6H2O,
      DisplacementEquation.Displacement_4NO_6H2O_4NH3_5O2,
      DisplacementEquation.Displacement_4NH3_7O2_4NO2_6H2O,
      DisplacementEquation.Displacement_4NO2_6H2O_4NH3_7O2,
      DisplacementEquation.Displacement_4NH3_6NO_5N2_6H2O,
      DisplacementEquation.Displacement_5N2_6H2O_4NH3_6NO
    ];

    /*
     * Maps an equation class to a list of equation classes that should be excluded from the pool.
     * Improves code readability by hiding messy type parameterization.
     */

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
    this.LEVEL3_EXCLUSIONS = {
      Displacement_2C2H6_7O2_4CO2_6H2O: [
        DisplacementEquation.Displacement_4CO2_6H2O_2C2H6_7O2, /* reverse equation */
        DisplacementEquation.Displacement_2C2H2_5O2_4CO2_2H2O
      ],
      Displacement_4CO2_6H2O_2C2H6_7O2: [
        DisplacementEquation.Displacement_2C2H6_7O2_4CO2_6H2O, /* reverse equation */
        DisplacementEquation.Displacement_4CO2_2H2O_2C2H2_5O2
      ],
      Displacement_2C2H2_5O2_4CO2_2H2O: [
        DisplacementEquation.Displacement_4CO2_2H2O_2C2H2_5O2, /* reverse equation */
        DisplacementEquation.Displacement_2C2H6_7O2_4CO2_6H2O
      ],
      Displacement_4CO2_2H2O_2C2H2_5O2: [
        DisplacementEquation.Displacement_2C2H2_5O2_4CO2_2H2O, /* reverse equation */
        DisplacementEquation.Displacement_4CO2_6H2O_2C2H6_7O2
      ],
      Displacement_C2H5OH_3O2_2CO2_3H2O: [
        DisplacementEquation.Displacement_2CO2_3H2O_C2H5OH_3O2 /* reverse equation */
      ],
      Displacement_2CO2_3H2O_C2H5OH_3O2: [
        DisplacementEquation.Displacement_C2H5OH_3O2_2CO2_3H2O /* reverse equation */
      ],
      Displacement_4NH3_3O2_2N2_6H2O: [
        DisplacementEquation.Displacement_2N2_6H2O_4NH3_3O2, /* reverse equation */
        DisplacementEquation.Displacement_4NH3_5O2_4NO_6H2O, /* other equations with reactant 4NH3 */
        DisplacementEquation.Displacement_4NH3_7O2_4NO2_6H2O,
        DisplacementEquation.Displacement_4NH3_6NO_5N2_6H2O
      ],
      Displacement_4NH3_5O2_4NO_6H2O: [
        DisplacementEquation.Displacement_4NO_6H2O_4NH3_5O2, /* reverse equation */
        DisplacementEquation.Displacement_4NH3_3O2_2N2_6H2O, /* other equations with reactant 4NH3 */
        DisplacementEquation.Displacement_4NH3_7O2_4NO2_6H2O,
        DisplacementEquation.Displacement_4NH3_6NO_5N2_6H2O
      ],
      Displacement_4NH3_7O2_4NO2_6H2O: [
        DisplacementEquation.Displacement_4NO2_6H2O_4NH3_7O2, /* reverse equation */
        DisplacementEquation.Displacement_4NH3_3O2_2N2_6H2O, /* other equations with reactant 4NH3 */
        DisplacementEquation.Displacement_4NH3_5O2_4NO_6H2O,
        DisplacementEquation.Displacement_4NH3_6NO_5N2_6H2O
      ],
      Displacement_4NH3_6NO_5N2_6H2O: [
        DisplacementEquation.Displacement_5N2_6H2O_4NH3_6NO, /* reverse equation */
        DisplacementEquation.Displacement_4NH3_3O2_2N2_6H2O, /* other equations with reactant 4NH3 */
        DisplacementEquation.Displacement_4NH3_5O2_4NO_6H2O,
        DisplacementEquation.Displacement_4NH3_7O2_4NO2_6H2O
      ],
      Displacement_2N2_6H2O_4NH3_3O2: [
        DisplacementEquation.Displacement_4NH3_3O2_2N2_6H2O, /* reverse equation */
        DisplacementEquation.Displacement_4NO_6H2O_4NH3_5O2, /* other equations with product 4NH3 */
        DisplacementEquation.Displacement_4NO2_6H2O_4NH3_7O2,
        DisplacementEquation.Displacement_5N2_6H2O_4NH3_6NO
      ],
      Displacement_4NO_6H2O_4NH3_5O2: [
        DisplacementEquation.Displacement_4NH3_5O2_4NO_6H2O, /* reverse equation */
        DisplacementEquation.Displacement_2N2_6H2O_4NH3_3O2, /* other equations with product 4NH3 */
        DisplacementEquation.Displacement_4NO2_6H2O_4NH3_7O2,
        DisplacementEquation.Displacement_5N2_6H2O_4NH3_6NO
      ],
      Displacement_4NO2_6H2O_4NH3_7O2: [
        DisplacementEquation.Displacement_4NH3_7O2_4NO2_6H2O, /* reverse equation */
        DisplacementEquation.Displacement_2N2_6H2O_4NH3_3O2, /* other equations with product 4NH3 */
        DisplacementEquation.Displacement_4NO_6H2O_4NH3_5O2,
        DisplacementEquation.Displacement_5N2_6H2O_4NH3_6NO
      ],
      Displacement_5N2_6H2O_4NH3_6NO: [
        DisplacementEquation.Displacement_4NH3_6NO_5N2_6H2O, /* reverse equation */
        DisplacementEquation.Displacement_2N2_6H2O_4NH3_3O2, /* other equations with product 4NH3 */
        DisplacementEquation.Displacement_4NO_6H2O_4NH3_5O2,
        DisplacementEquation.Displacement_4NO2_6H2O_4NH3_7O2
      ]
    };

    // map of game levels to strategies for selecting equations
    this.STRATEGIES = {
      1: new RandomStrategy( this.LEVEL1_POOL, false ),
      2: new RandomStrategy( this.LEVEL2_POOL, true ),
      3: new RandomWithExclusionsStrategy( this.LEVEL3_POOL, this.LEVEL3_EXCLUSIONS, true )
    };


  };

  /**
   * Creates a set of equations to be used in the game.
   * @param numberOfEquations
   * @param level 1-N
   */
  GameFactory.prototype.createEquations = function( numberOfEquations, level ) {
    var equationClasses = this.STRATEGIES[level].getEquationClasses();
    var equations = [];

    equationClasses.forEach( function( equationClass ) {
      equations.push( equationClass() );
    } );
    return equations;
  };

  /*
   * Selects a random set from a pool of equations, with no duplicates.
   * Selection of an equation may cause other equations to be excluded from the pool.
   * Use the firstBigMolecule flag to specify whether it's OK if the first
   * equation in the set contains a "big" molecule.
   */
  var RandomWithExclusionsStrategy = function( pool, exclusions, firstBigMolecules ) {
    this.pool = pool;
    this.exclusions = exclusions;
    this.firstBigMolecule = firstBigMolecules;  // can the first equation in the set contain a "big" molecule?


    this.hasBigMolecule = function( equationClass ) {
      return equationClass().hasBigMolecule();
    };

    this.getEquationClasses = function( numberOfEquations ) {
      // operate on a copy of the pool, so that we can prune the pool as we select equations
      var poolCopy = _.clone( this.pool );

      var equationClasses = [];
      for ( var i = 0; i < numberOfEquations; i++ ) {

        // randomly select an equation
        var randomIndex = Math.floor( Math.random() * poolCopy.length );
        var equationClass = poolCopy[randomIndex];

        // If the first equation isn't supposed to contain any "big" molecules,
        // then find an equation in the pool that has no big molecules.
        if ( i === 0 && !this.firstBigMolecule && this.hasBigMolecule( equationClass ) ) {

          // start the search at a random index
          var startIndex = Math.floor( Math.random() * poolCopy.length );
          var index = startIndex;
          var done = false;
          while ( !done ) {

            // next equation in the pool
            equationClass = poolCopy.get( index );

            if ( !this.hasBigMolecule( equationClass ) ) {
              done = true; // success, this equation has no big molecules
            }
            else {
              // increment index to point to next in pool
              index++;
              if ( index > poolCopy.size() - 1 ) {
                index = 0;
              }

              // give up if we've examined all equations in the pool
              if ( index === startIndex ) {
                done = true;
                window.console.log( "ERROR: first equation contains big molecules because we ran out of equations" );
              }
            }
          }
        }

        // add the equation to the game
        equationClasses.add( equationClass );

        // remove the equation from the pool so it won't be selected again
        poolCopy.remove( equationClass );

        // if the selected equation has exclusions, remove them from the pool
        var exclusedEquations = exclusions.get( equationClass );
        if ( exclusedEquations !== null ) {
          _.remove( poolCopy, function( equationClass ) {exclusedEquations.indexOf( equationClass !== -1 );}, this );
        }
      }

      return equationClasses;
    };
  };

  /*
   * Selects a random set from a pool of equations, with no duplicates.
   * Use the firstBigMolecule flag to specify whether it's OK if the first
   * equation in the set contains a "big" molecule.
   */
  var RandomStrategy = function( pool, firstBigMolecules ) {
    RandomWithExclusionsStrategy.call( this, pool, {}, firstBigMolecules );
  };


  return GameFactory;

} );