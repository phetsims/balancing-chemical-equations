// Copyright 2002-2014, University of Colorado Boulder

/**
 * Data structure for describing how many times an atom appears in an equation.
 * There are separate counts for the left-hand (reactants) and right-hand (products)
 * sides of the equation.
 *
 * @author Vasily Shakhov (cmalley@pixelzoom.com)
 */
define( function() {
  'use strict';

  /**
   * @param {NITROGLYCERIN.Element} element
   * @param {Number} reactantsCount
   * @param {Number} productsCount
   * @constructor
   */
  var AtomCount = function( element, reactantsCount, productsCount ) {
    // the element that describes the atom's chemical properties
    this.element = element;
    this.reactantsCount = reactantsCount;
    this.productsCount = productsCount;
  };

  return AtomCount;
} );