// Copyright 2014-2020, University of Colorado Boulder

/**
 * A term in a chemical equation.
 * The "balanced coefficient" is the lowest coefficient value that will balance the equation, and is immutable.
 * The "user coefficient" is the coefficient set by the user.
 *
 * @author Vasily Shakhov (mlearner.com)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import BCEQueryParameters from '../BCEQueryParameters.js';

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

balancingChemicalEquations.register( 'EquationTerm', EquationTerm );
export default EquationTerm;