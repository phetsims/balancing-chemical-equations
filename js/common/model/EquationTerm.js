// Copyright 2014-2018, University of Colorado Boulder

/**
 * A term in a chemical equation.
 * The "balanced coefficient" is the lowest coefficient value that will balance the equation, and is immutable.
 * The "user coefficient" is the coefficient set by the user.
 *
 * @author Vasily Shakhov (mlearner.com)
 */
define( function( require ) {
  'use strict';

  // modules
  var balancingChemicalEquations = require( 'BALANCING_CHEMICAL_EQUATIONS/balancingChemicalEquations' );
  var BCEQueryParameters = require( 'BALANCING_CHEMICAL_EQUATIONS/common/BCEQueryParameters' );
  var inherit = require( 'PHET_CORE/inherit' );
  var NumberProperty = require( 'AXON/NumberProperty' );

  /**
   * @param {number} balancedCoefficient balanced coefficient for molecule
   * @param {Molecule} molecule
   * @param {Object} [options]
   * @constructor
   */
  function EquationTerm( balancedCoefficient, molecule, options ) {

    options = _.extend( {
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

  balancingChemicalEquations.register( 'EquationTerm', EquationTerm );

  return inherit( Object, EquationTerm, {

    // @public
    reset: function() {
      this.userCoefficientProperty.reset();
    }
  } );
} );