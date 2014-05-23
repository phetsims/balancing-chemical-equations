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
  var EquationTerm = require( 'BALANCING_CHEMICAL_EQUATIONS/common/model/EquationTerm' );


  /*
   * Convenience constructor.
   *
   * @param {Integer} r1 balanced coefficient for reactant1
   * @param {Molecule} reactant1
   * @param {Integer} p1 balanced coefficient for product1
   * @param {Molecule} product1
   * @param {Integer} p2 balanced coefficient for product2
   * @param {Molecule} product2
   */
  function DecompositionEquation( r1, reactant1, p1, product1, p2, product2 ) {
    Equation.call( this, [new EquationTerm( r1, reactant1 )], [ new EquationTerm( p1, product1 ), new EquationTerm( p2, product2 )] );
  }

  inherit( Equation, DecompositionEquation );




  return {
    // 2 H2O -> 2 H2 + O2
    Decomposition_2H2O_2H2_O2: function() {
      var equation = new DecompositionEquation( 2, 'H2O', 2, 'H2', 1, 'O2' );

      //@Override
      //TODO do we need this getName at all?
      equation.getName = function() {
        //return makeAmmoniaString;
      };
      return equation;
    }
  };

} );