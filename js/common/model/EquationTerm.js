// Copyright 2014-2019, University of Colorado Boulder

/**
 * A term in a chemical equation.
 * The "balanced coefficient" is the lowest coefficient value that will balance the equation, and is immutable.
 * The "user coefficient" is the coefficient set by the user.
 *
 * @author Vasily Shakhov (mlearner.com)
 */
define( require => {
  'use strict';

  // modules
  const balancingChemicalEquations = require( 'BALANCING_CHEMICAL_EQUATIONS/balancingChemicalEquations' );
  const BCEQueryParameters = require( 'BALANCING_CHEMICAL_EQUATIONS/common/BCEQueryParameters' );
  const merge = require( 'PHET_CORE/merge' );
  const NumberProperty = require( 'AXON/NumberProperty' );

  class EquationTerm {

    /**
     * @param {number} balancedCoefficient balanced coefficient for molecule
     * @param {Molecule} molecule
     * @param {Object} [options]
     */
    constructor( balancedCoefficient, molecule, options ) {

      options = merge( {
        initialCoefficient: 0 // initial value of the coefficient
      }, options );

      // If we're inspecting all game challenges, fill in the correct answer to make our job easier.
      if ( BCEQueryParameters.playAll ) {
        options.initialCoefficient = balancedCoefficient;
      }

      this.molecule = molecule; // @public
      this.balancedCoefficient = balancedCoefficient; // @public
      this.userCoefficientProperty = new NumberProperty( options.initialCoefficient, {
        numberType: 'Integer'
      } ); // @public
    }

    // @public
    reset() {
      this.userCoefficientProperty.reset();
    }
  }

  return balancingChemicalEquations.register( 'EquationTerm', EquationTerm );
} );