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

  //modules
  var Property = require( 'AXON/Property' );

  function EquationTerm( balancedCoefficient, molecule, actualCoefficient ) {
    this.molecule = molecule;
    this.balancedCoefficient = balancedCoefficient;
    this.userCoefficient = new Property( actualCoefficient || 0 );
  }

  EquationTerm.prototype.reset = function() {
    this.userCoefficient.reset();
  };

  return EquationTerm;
} );