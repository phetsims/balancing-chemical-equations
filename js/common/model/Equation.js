// Copyright 2014-2015, University of Colorado Boulder

/**
 * Base type for all chemical equations.
 * A chemical equation has 2 sets of terms, reactants and products.
 * During the chemical reaction represented by the equation, reactants are transformed into products.
 * <p/>
 * An equation is "balanced" when each term's user coefficient is an integer multiple N of
 * the balanced coefficient, N is the same for all terms in the equation, and N >= 1.
 * An equation is "balanced and simplified" when it is balanced and N=1.
 *
 * @author Vasily Shakhov (mlearner.com)
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var AtomCount = require( 'BALANCING_CHEMICAL_EQUATIONS/common/model/AtomCount' );
  var balancingChemicalEquations = require( 'BALANCING_CHEMICAL_EQUATIONS/balancingChemicalEquations' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );

  /**
   * @param {EquationTerm[]} reactants terms on the left side of the equation
   * @param {EquationTerm[]} products terms on the right side of the equation
   * @constructor
   */
  function Equation( reactants, products ) {
    var self = this;

    this.reactants = reactants; // @public
    this.products = products; // @public

    // @public
    this.balancedProperty = new Property( false );
    this.coefficientsSumProperty = new Property( 0 );

    this.balancedAndSimplified = false; // @public balanced with the lowest possible coefficients

    this.addCoefficientsObserver( self.updateBalanced.bind( self ) );

    // keep a sum of all coefficients, so we know when the sum is non-zero
    this.addCoefficientsObserver( function() {
      var coefficientsSum = 0;
      var addCoefficients = function( equationTerm ) {
        coefficientsSum += equationTerm.userCoefficientProperty.get();
      };
      self.reactants.forEach( addCoefficients );
      self.products.forEach( addCoefficients );
      self.coefficientsSumProperty.set( coefficientsSum );
    } );
  }

  balancingChemicalEquations.register( 'Equation', Equation );

  return inherit( Object, Equation, {

    //TODO #96 does this type need a dispose function? Game creates 5 of these when level selection button is pressed.

    // @public
    reset: function() {

      this.balancedProperty.reset();
      this.coefficientsSumProperty.reset();

      this.reactants.forEach( function( reactant ) {
        reactant.reset();
      } );

      this.products.forEach( function( product ) {
        product.reset();
      } );
    },

    /**
     * An equation is balanced if all of its terms have a coefficient that is the
     * same integer multiple of the term's balanced coefficient.  If the integer
     * multiple is 1, then the term is "balanced and simplified" (balanced with
     * lowest possible coefficients).
     * @private
     */
    updateBalanced: function() {

      // Get integer multiplier from the first reactant term.
      var multiplier = this.reactants[ 0 ].userCoefficientProperty.get() / this.reactants[ 0 ].balancedCoefficient;
      var balanced = ( multiplier > 0 );

      // Check each term to see if the actual coefficient is the same integer multiple of the balanced coefficient.
      this.reactants.forEach( function( reactant ) {
        balanced = balanced && ( reactant.userCoefficientProperty.get() === multiplier * reactant.balancedCoefficient );
      } );
      this.products.forEach( function( product ) {
        balanced = balanced && ( product.userCoefficientProperty.get() === multiplier * product.balancedCoefficient );
      } );

      this.balancedAndSimplified = balanced && ( multiplier === 1 ); // set the more specific value first
      this.balancedProperty.set( balanced );
    },

    /**
     * Convenience method for adding an observer to all coefficients.
     * @public
     */
    addCoefficientsObserver: function( observer ) {
      this.reactants.forEach( function( reactant ) {
        reactant.userCoefficientProperty.lazyLink( observer );
      } );
      this.products.forEach( function( product ) {
        product.userCoefficientProperty.lazyLink( observer );
      } );
      observer();
    },

    /**
     * Convenience method for removing an observer from all coefficients.
     * @public
     */
    removeCoefficientsObserver: function( observer ) {
      this.reactants.forEach( function( reactant ) {
        reactant.userCoefficientProperty.unlink( observer );
      } );
      this.products.forEach( function( product ) {
        product.userCoefficientProperty.unlink( observer );
      } );
    },

    /**
     * Returns a count of each type of atom, based on the user coefficients.
     * See AtomCount.countAtoms for details.
     *
     * @param {Equation} equation
     * @return {AtomCount[]}
     * @public
     */
    getAtomCounts: function() {
      return AtomCount.countAtoms( this );
    },

    /**
     * Does this equation contain at least one "big" molecule?
     * This affects degree of difficulty in the Game.
     * @return {boolean}
     * @public
     */
    hasBigMolecule: function() {
      this.reactants.forEach( function( reactant ) {
        if ( reactant.molecule.isBig() ) {
          return true;
        }
      } );
      this.products.forEach( function( product ) {
        if ( product.molecule.isBig() ) {
          return true;
        }
      } );
      return false;
    },

    /**
     * Balances the equation by copying the balanced coefficient value to
     * the user coefficient value for each term in the equation.
     * @public
     */
    balance: function() {
      this.reactants.forEach( function( term ) {
        term.userCoefficientProperty.set( term.balancedCoefficient );
      } );
      this.products.forEach( function( term ) {
        term.userCoefficientProperty.set( term.balancedCoefficient );
      } );
    },

    /**
     * Gets a string that shows just the coefficients of the equations.
     * This is used to show game answers when running in 'dev' mode.
     * @returns {string}
     * @public
     */
    getCoefficientsString: function() {
      var string = '';
      for ( var i = 0; i < this.reactants.length; i++ ) {
        string += this.reactants[ i ].balancedCoefficient;
        string += ( i < this.reactants.length - 1 ) ? ' + ' : ' ';
      }
      string += '\u2192 '; // right arrow
      for ( i = 0; i < this.products.length; i++ ) {
        string += this.products[ i ].balancedCoefficient;
        string += ( i < this.products.length - 1 ) ? ' + ' : '';
      }
      return string;
    },

    /**
     * String value of an equation, shows balanced coefficients, for debugging.
     * @return {string}
     * @public
     */
    toString: function() {
      var string = '';
      // reactants
      for ( var i = 0; i < this.reactants.length; i++ ) {
        string += this.reactants[ i ].balancedCoefficient;
        string += ' ';
        string += this.reactants[ i ].molecule.symbol;
        if ( i < this.reactants.length - 1 ) {
          string += ' + ';
        }
      }
      // right arrow
      string += ' \u2192 ';
      // products
      for ( i = 0; i < this.products.length; i++ ) {
        string += this.products[ i ].balancedCoefficient;
        string += ' ';
        string += this.products[ i ].molecule.symbol;
        if ( i < this.products.length - 1 ) {
          string += ' + ';
        }
      }
      // strip out HTML tags to improve readability
      string = string.replace( /<sub>/g, '' );
      string = string.replace( /<\/sub>/g, '' );
      return string;
    }
  } );
} );