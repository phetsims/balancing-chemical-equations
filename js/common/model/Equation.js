// Copyright 2002-2014, University of Colorado Boulder

/**
 * Base class for all chemical equations.
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
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );
  var AtomCount = require( 'BALANCING_CHEMICAL_EQUATIONS/common/model/AtomCount' );

  /**
   * @param {[EquationTerm]} reactants terms on the left side of the equation
   * @param {[EquationTerm]} products terms on the right side of the equation
   * @constructor
   */
  function Equation( reactants, products ) {
    var self = this;

    this.reactants = reactants;
    this.products = products;

    PropertySet.call( this, {
      balanced: false,
      coefficientsSum: 0
    } );

    this.balancedAndSimplified = false; // balanced with the lowest possible coefficients

    this.addCoefficientsObserver( self.updateBalanced.bind( self ) );

    // keep a sum of all coefficients, so we know when the sum is non-zero
    this.addCoefficientsObserver( function() {
      var coefficientsSum = 0;
      var addCoefficients = function( equationTerm ) {
        coefficientsSum += equationTerm.userCoefficientProperty.get();
      };
      self.reactants.forEach( addCoefficients );
      self.products.forEach( addCoefficients );
      self.coefficientsSum = coefficientsSum;
    } );
  }

  return inherit( PropertySet, Equation, {

    // @override
    reset: function() {
      PropertySet.prototype.reset.call( this );
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
      var multiplier = this.reactants[0].userCoefficient / this.reactants[0].balancedCoefficient;
      var balanced = ( multiplier > 0 );

      // Check each term to see if the actual coefficient is the same integer multiple of the balanced coefficient.
      this.reactants.forEach( function( reactant ) {
        balanced = balanced && ( reactant.userCoefficient === multiplier * reactant.balancedCoefficient );
      } );
      this.products.forEach( function( product ) {
        balanced = balanced && ( product.userCoefficient === multiplier * product.balancedCoefficient );
      } );

      this.balancedAndSimplified = balanced && ( multiplier === 1 ); // set the more specific value first
      this.balanced = balanced;
    },

    /**
     * Convenience method for adding an observer to all coefficients.
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
     * @return {[AtomCount]}
     */
    getAtomCounts: function() {
      return AtomCount.countAtoms( this );
    },

    /**
     * Does this equation contain at least one "big" molecule?
     * This affects degree of difficulty in the Game.
     * @return {Boolean}
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
     */
    balance: function() {
      this.reactants.forEach( function( term ) {
        term.userCoefficient = term.balancedCoefficient;
      } );
      this.products.forEach( function( term ) {
        term.userCoefficient = term.balancedCoefficient;
      } );
    },

    /**
     * Gets a string that shows just the coefficients of the equations.
     * This is used to show game answers when running in 'dev' mode.
     * @returns {string}
     */
    getCoefficientsString: function() {
      var string = '';
      for ( var i = 0; i < this.reactants.length; i++ ) {
        string += this.reactants[i].balancedCoefficient;
        string += ( i < this.reactants.length - 1 ) ? ' + ' : ' ';
      }
      string += '\u2192 '; // right arrow
      for ( i = 0; i < this.products.length; i++ ) {
        string += this.products[i].balancedCoefficient;
        string += ( i < this.products.length - 1 ) ? ' + ' : '';
      }
      return string;
    }
  } );
} );