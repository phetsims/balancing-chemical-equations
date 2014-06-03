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
  var AtomCount = require( 'BALANCING_CHEMICAL_EQUATIONS/common/model/AtomCount' );

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
    this.addCoefficientsObserver( self.updateBalancedProperties.bind( self ) );
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
    },
    /**
     * Convenience method for adding an observer to all coefficients.
     */
    addCoefficientsObserver: function( observer ) {
      this.reactants.forEach( function( reactant ) {
        reactant.userCoefficientProperty.link( observer );
      } );
      this.products.forEach( function( product ) {
        product.userCoefficientProperty.link( observer );
      } );
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
     * <p/>
     * The order of atoms will be the same order that they are encountered in the reactant terms.
     * For example, if the left-hand side of the equation is CH4 + O2, then the order of atoms
     * will be [C,H,O].
     */
    getAtomCounts: function() {
      var atomCounts = []; //array of AtomCounts
      this.setAtomCounts( atomCounts, this.reactants, true /* isReactants */ );
      this.setAtomCounts( atomCounts, this.products, false /* isReactants */ );
      return atomCounts;
    },

    /*
     * Some of our visual representations of "balanced" (ie, balance scales and bar charts)
     * compare the number of atoms on the left and right side of the equation.
     * <p>
     * This algorithm supports those representations by computing the atom counts.
     * It examines a collection of terms in the equation (either reactants or products),
     * examines those terms' molecules, and counts the number of each atom type.
     * <p>
     * This is a brute force algorithm, but our number of terms is always small,
     * and this is easy to implement and understand.
     *
     * @param atomCounts
     * @param terms
     * @param isReactants true if the terms are the reactants, false if they are the products
     */
    setAtomCounts: function( atomCounts, terms, isReactants ) {
      terms.forEach( function( term ) {
        term.molecule.atoms.forEach( function( atom ) {

          var found = false;
          for ( var i = 0; i < atomCounts.length; i++ ) {
            var atomCount = atomCounts[i];
            // add to an existing count
            if ( atomCount.element === atom.element ) {
              if ( isReactants ) {
                atomCount.reactantsCount += term.userCoefficient;
              }
              else {
                atomCount.productsCount += term.userCoefficient;
              }
              found = true;
              break;
            }
          }

          // if no existing count was found, create one.
          if ( !found ) {
            if ( isReactants ) {
              atomCounts.push( new AtomCount( atom.element, term.userCoefficient, 0 ) );
            }
            else {
              atomCounts.push( new AtomCount( atom.element, 0, term.userCoefficient ) );
            }
          }
        } );
      } );
    },
    /**
     * Does this equation contain at least one "big" molecule?
     * This affects degree of difficulty in the Game.
     *
     * @return
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
    }
  } );
} )
;