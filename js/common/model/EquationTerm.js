// Copyright 2002-2014, University of Colorado Boulder

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
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );

  /**
   * @param {Number} balancedCoefficient balanced coefficient for molecule
   * @param {Molecule} molecule
   * @param {Number} actualCoefficient actual coefficient for molecule
   * @constructor
   */

  function EquationTerm( balancedCoefficient, molecule, actualCoefficient ) {
    this.molecule = molecule;
    this.balancedCoefficient = balancedCoefficient;
    PropertySet.call( this, {
      userCoefficient: actualCoefficient || 0
    } );
  }

  return inherit( PropertySet, EquationTerm );
} );