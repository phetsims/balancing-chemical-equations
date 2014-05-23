// Copyright 2002-2014, University of Colorado Boulder

/**
 * Base class for synthesis equations.
 * In a synthesis reaction two or more chemical species combine to form a more complex product.
 * All synthesis equations in this sim have 2 reactants and 1 product.
 * This base class adds no new functionality to Equation, it simply provides convenient constructors.
 *
 * @author Vasily Shakhov (mlearner.com)
 */

define( function( require ) {
  'use strict';

  // imports
  var inherit = require( 'PHET_CORE/inherit' );
  var Equation = require( 'BALANCING_CHEMICAL_EQUATIONS/common/model/equation' );

  function SynthesisEquation() {

  }


  return inherit( Equation, SynthesisEquation );
} );