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
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );

  /**
   * @param {[EquationTerm]} reactants
   * @param {[EquationTerm]} products
   */

  function Equation( reactants, products ) {
    var self = this;

    this.reactants = reactants;
    this.products = products;

    PropertySet.call( this, {
      balanced: false,
      balancedAndSimplified: false
    } );

    //equation is balanced if all terms are balanced.
    this.reactants.forEach( function( reactant ) {
      reactant.userCoefficient.link( self.updateBalancedProperties.bind( self ) );
    } );
    this.products.forEach( function( product ) {
      product.userCoefficient.link( self.updateBalancedProperties.bind( self ) );
    } );

  }

  inherit( PropertySet, Equation, {
    reset: function() {
      this.reactants.forEach( function( reactant ) {
        reactant.reset();
      } );
      this.products.forEach( function( product ) {
        product.reset();
      } );
    },
    /*
     * An equation is balanced if all of its terms have a coefficient that is the
     * same integer multiple of the term's balanced coefficient.  If the integer
     * multiple is 1, then the term is balanced with lowest possible coefficients.
     */
    updateBalancedProperties: function() {
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

      this.balancedAndSimplified = balanced && ( multiplier === 1 ); // set the more specific property first
      this.balanced = balanced;
    }
  } );

  return Equation;
} );