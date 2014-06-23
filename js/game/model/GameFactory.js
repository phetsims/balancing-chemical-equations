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

  // modules
  var SynthesisEquation = require( 'BALANCING_CHEMICAL_EQUATIONS/common/model/SynthesisEquation' );
  var DecompositionEquation = require( 'BALANCING_CHEMICAL_EQUATIONS/common/model/DecompositionEquation' );
  var DisplacementEquation = require( 'BALANCING_CHEMICAL_EQUATIONS/common/model/DisplacementEquation' );

  /**
   * @constructor
   */

  var GameFactory = function() {

    // Level 1 pool
    this.LEVEL1_POOL = [
      SynthesisEquation.create_2H2_O2_2H2O,
      SynthesisEquation.create_H2_F2_2HF,
      DecompositionEquation.create_2HCl_H2_Cl2,
      DecompositionEquation.create_CH3OH_CO_2H2,
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
      DecompositionEquation.create_PCl5_PCl3_Cl2,
      DecompositionEquation.create_2SO3_2SO2_O2
    ];

    // Level 2 pool
    this.LEVEL2_POOL = [
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

    // Level 3 pool
    this.LEVEL3_POOL = [
      DisplacementEquation.create_2C2H6_7O2_4CO2_6H2O,
      DisplacementEquation.create_4CO2_6H2O_2C2H6_7O2,
      DisplacementEquation.create_2C2H2_5O2_4CO2_2H2O,
      DisplacementEquation.create_4CO2_2H2O_2C2H2_5O2,
      DisplacementEquation.create_C2H5OH_3O2_2CO2_3H2O,
      DisplacementEquation.create_2CO2_3H2O_C2H5OH_3O2,
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

    // map of game levels to strategies for selecting equations
    this.STRATEGIES = [
      new RandomStrategy( this.LEVEL1_POOL, false ), //level 1
      new RandomStrategy( this.LEVEL2_POOL, true ), //level 2
      new RandomWithExclusionsStrategy( this.LEVEL3_POOL, this.LEVEL3_EXCLUSIONS, true ) //level 3
    ];

  };

  /**
   * Creates a set of equations to be used in the game.
   * @param numberOfEquations
   * @param level 1-N
   */
  GameFactory.prototype.createEquations = function( numberOfEquations, level ) {
    var equationClasses = this.STRATEGIES[level].getEquationClasses( numberOfEquations );
    var equations = [];

    equationClasses.forEach( function( equationClass ) {
      equations.push( equationClass() );
    } );
    return equations;
  };

  /**
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
      //function for


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
                throw new Error( 'first equation contains big molecules because we ran out of equations' );
              }
            }
          }
        }

        // add the equation to the game
        equationClasses.push( equationClass );

        // remove the equation from the pool so it won't be selected again
        poolCopy.splice( poolCopy.indexOf( equationClass ), 1 );

        // if the selected equation has exclusions, remove them from the pool
        var exclusedEquations;
        //trying to find exclusedEquations from comparing equationClass with DisplacementEquation[keys in exclusions]
        //if functions the same - we've found key and exclusions[key] target exclused list
        for ( var exclusionClassName in exclusions ) {
          if ( exclusions.hasOwnProperty( exclusionClassName ) ) {
            if ( DisplacementEquation[exclusionClassName] === equationClass ) {
              exclusedEquations = exclusions[ exclusionClassName];
            }
          }
        }
        if ( exclusedEquations !== undefined ) {
          _.remove( poolCopy, function( equationClass ) {
            return exclusedEquations.indexOf( equationClass ) !== -1;
          }, this );
        }
      }
      return equationClasses;
    };
  };

  /**
   * Selects a random set from a pool of equations, with no duplicates.
   * Use the firstBigMolecule flag to specify whether it's OK if the first
   * equation in the set contains a "big" molecule.
   */
  var RandomStrategy = function( pool, firstBigMolecules ) {
    RandomWithExclusionsStrategy.call( this, pool, {}, firstBigMolecules );
  };


  return GameFactory;

} );