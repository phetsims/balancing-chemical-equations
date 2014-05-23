// Copyright 2002-2014, University of Colorado Boulder

/**
 * Base class for decomposition equations.
 * In a decomposition reaction, a more complex substance breaks down into its more simple parts.
 * All decomposition equations in this sim have 1 reactant and 2 products.
 * This base class adds no new functionality to Equation, it simply provides convenient constructors.
 *
 * @author Vasily Shakhov (mlearner.com)
 */

define( function( require ) {
  'use strict';

  // imports
  var inherit = require( 'PHET_CORE/inherit' );
  var Equation = require( 'BALANCING_CHEMICAL_EQUATIONS/common/model/equation' );

  function DecompositionEquation() {

  }


  return inherit( Equation, DecompositionEquation );
} );