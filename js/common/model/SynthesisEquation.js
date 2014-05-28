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

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Equation = require( 'BALANCING_CHEMICAL_EQUATIONS/common/model/equation' );
  var EquationTerm = require( 'BALANCING_CHEMICAL_EQUATIONS/common/model/EquationTerm' );
  var MoleculeFactory = require( 'BALANCING_CHEMICAL_EQUATIONS/common/model/MoleculeFactory' );

  //strings
  var makeAmmoniaString = require( 'string!BALANCING_CHEMICAL_EQUATIONS/makeAmmonia' );


  /*
   * Convenience constructor.
   *
   * @param {Integer} r1 balanced coefficient for reactant1
   * @param {Molecule} reactant1
   * @param {Integer} r2 balanced coefficient for reactant2
   * @param {Molecule} reactant2
   * @param {Integer} p1 balanced coefficient for product1
   * @param {Molecule} product1
   */
  function SynthesisEquation( r1, reactant1, r2, reactant2, p1, product1 ) {
    Equation.call( this, [new EquationTerm( r1, reactant1 ), new EquationTerm( r2, reactant2 )], [ new EquationTerm( p1, product1 )] );
  }

  inherit( Equation, SynthesisEquation );

  return {
    // N2 + 3 H2 -> 2 NH3
    Synthesis_N2_3H2_2NH3: function() {
      var equation = new SynthesisEquation( 1, MoleculeFactory.N2(), 3, MoleculeFactory.H2(), 2, MoleculeFactory.NH3() );

      //@Override
      //TODO do we need this getName at all?
      equation.getName = function() {
        return makeAmmoniaString;
      };
      return equation;
    }
  };

} );