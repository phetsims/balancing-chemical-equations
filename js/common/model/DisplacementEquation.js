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

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Equation = require( 'BALANCING_CHEMICAL_EQUATIONS/common/model/equation' );
  var EquationTerm = require( 'BALANCING_CHEMICAL_EQUATIONS/common/model/EquationTerm' );
  var MoleculeFactory = require( 'BALANCING_CHEMICAL_EQUATIONS/common/model/MoleculeFactory' );

  /*
   * Convenience constructor.
   *
   * @param {Integer} r1 balanced coefficient for reactant1
   * @param {Molecule} reactant1
   * @param {Integer} r2 balanced coefficient for reactant1
   * @param {Molecule} reactant2
   * @param {Integer} p1 balanced coefficient for product1
   * @param {Molecule} product1
   * @param {Integer} p2 balanced coefficient for product2
   * @param {Molecule} product2
   */
  function DisplacementEquation( r1, reactant1, r2, reactant2, p1, product1, p2, product2 ) {
    Equation.call( this, [new EquationTerm( r1, reactant1 ), new EquationTerm( r2, reactant2 )], [ new EquationTerm( p1, product1 ), new EquationTerm( p2, product2 )] );
  }

  inherit( Equation, DisplacementEquation );


  return {
    // 2 H2O -> 2 H2 + O2
    Displacement_CH4_2O2_CO2_2H2O: function() {
      var equation = new DisplacementEquation( 1, MoleculeFactory.CH4(), 2, MoleculeFactory.O2(), 1, MoleculeFactory.CO2(), 2, MoleculeFactory.H2O() );

      //@Override
      //TODO do we need this getName at all?
      equation.getName = function() {
        //return COMBUST_METHANE;
      };
      return equation;
    }
  };

} );