// Copyright 2002-2014, University of Colorado Boulder

/**
 * Base class for displacement equations.
 * In a displacement reactions, compounds exchange bonds or ions to form different compounds.
 * All displacement equations in this sim have 2 reactants and 2 products.
 * This base class adds no new functionality to Equation, it simply provides convenient constructors.
 *
 * @author Vasily Shakhov (mlearner.com)
 */

define( function( require ) {
  'use strict';

  // imports
  var inherit = require( 'PHET_CORE/inherit' );
  var Equation = require( 'BALANCING_CHEMICAL_EQUATIONS/common/model/equation' );

  function DisplacementEquation() {

  }


  return inherit( Equation, DisplacementEquation );
} );