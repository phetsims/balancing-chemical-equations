// Copyright 2002-2014, University of Colorado Boulder

/**
 * Base type for synthesis equations.
 * In a synthesis reaction two or more chemical species combine to form a more complex product.
 * All synthesis equations in this sim have 2 reactants and 1 product.
 * This base type adds no new functionality to Equation, it simply provides convenient factory functions.
 *
 * @author Vasily Shakhov (mlearner.com)
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Equation = require( 'BALANCING_CHEMICAL_EQUATIONS/common/model/Equation' );
  var EquationTerm = require( 'BALANCING_CHEMICAL_EQUATIONS/common/model/EquationTerm' );
  var MoleculeFactory = require( 'BALANCING_CHEMICAL_EQUATIONS/common/model/MoleculeFactory' );

  /**
   * Convenience constructor.
   *
   * @param {Number} r1 balanced coefficient for reactant1
   * @param {Molecule} reactant1
   * @param {Number} r2 balanced coefficient for reactant2
   * @param {Molecule} reactant2
   * @param {Number} p1 balanced coefficient for product1
   * @param {Molecule} product1
   * @param {Object} [options]
   * @constructor
   */
  function SynthesisEquation( r1, reactant1, r2, reactant2, p1, product1, options ) {
    Equation.call( this, [new EquationTerm( r1, reactant1 ), new EquationTerm( r2, reactant2 )], [ new EquationTerm( p1, product1 )], options );
  }

  return inherit( Equation, SynthesisEquation, {}, {

    // 2 H2 + O2 -> 2 H2O
    create_2H2_O2_2H2O: function() {
      return new SynthesisEquation( 2, MoleculeFactory.H2(), 1, MoleculeFactory.O2(), 2, MoleculeFactory.H2O() );
    },

    // H2 + F2 -> 2 HF
    create_H2_F2_2HF: function() {
      return new SynthesisEquation( 1, MoleculeFactory.H2(), 1, MoleculeFactory.F2(), 2, MoleculeFactory.HF() );
    },

    // CH2O + H2 -> CH3OH
    create_CH2O_H2_CH3OH: function() {
      return new SynthesisEquation( 1, MoleculeFactory.CH2O(), 1, MoleculeFactory.H2(), 1, MoleculeFactory.CH3OH() );
    },

    // C2H2 + 2 H2 -> C2H6
    create_C2H2_2H2_C2H6: function() {
      return new SynthesisEquation( 1, MoleculeFactory.C2H2(), 2, MoleculeFactory.H2(), 1, MoleculeFactory.C2H6() );
    },

    // C + O2 -> CO2
    create_C_O2_CO2: function() {
      return new SynthesisEquation( 1, MoleculeFactory.C(), 1, MoleculeFactory.O2(), 1, MoleculeFactory.CO2() );
    },

    // 2 C + O2 -> 2 CO
    create_2C_O2_2CO: function() {
      return new SynthesisEquation( 2, MoleculeFactory.C(), 1, MoleculeFactory.O2(), 2, MoleculeFactory.CO() );
    },

    // C + 2 S -> CS2
    create_C_2S_CS2: function() {
      return new SynthesisEquation( 1, MoleculeFactory.C(), 2, MoleculeFactory.S(), 1, MoleculeFactory.CS2() );
    },

    // N2 + 3 H2 -> 2 NH3
    create_N2_3H2_2NH3: function() {
      return new SynthesisEquation( 1, MoleculeFactory.N2(), 3, MoleculeFactory.H2(), 2, MoleculeFactory.NH3() );
    },

    // 2 N2 + O2 -> 2 N2O
    create_2N2_O2_2N2O: function() {
      return new SynthesisEquation( 2, MoleculeFactory.N2(), 1, MoleculeFactory.O2(), 2, MoleculeFactory.N2O() );
    },

    // P4 + 6 H2 -> 4 PH3
    create_P4_6H2_4PH3: function() {
      return new SynthesisEquation( 1, MoleculeFactory.P4(), 6, MoleculeFactory.H2(), 4, MoleculeFactory.PH3() );
    },

    // P4 + 6 F2 -> 4 PF3
    create_P4_6F2_4PF3: function() {
      return new SynthesisEquation( 1, MoleculeFactory.P4(), 6, MoleculeFactory.F2(), 4, MoleculeFactory.PF3() );
    }
  } );
} );