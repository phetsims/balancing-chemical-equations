// Copyright 2002-2014, University of Colorado

/**
 * Encapsulates the strategy used to horizontally aligning terms in an equation
 * with columns of molecules in the "boxes" view.  Based on knowledge of the
 * size and separation of the boxes, we determine the x-axis offset for each
 * term in the equation.  This offset is relative to a local coordinate system
 * where the origin is at (0,0).
 *
 * @author Vasily Shakhov (mlearner.com)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   * @param {DOT.Dimension2} boxSize size of one of the 2 boxes (both boxes are assumed to be the same size)
   * @param {Number} boxSeparation horizontal separation between the left and right boxes
   * @param {Number} centerXOffset distance from left side of the screen to center
   * @param {Number} minX for Screen
   * @param {Number} maxX for Screen
   * @constructor
   */
  var HorizontalAligner = function( boxSize, boxSeparation, centerXOffset, minX, maxX ) {
    this.boxSize = boxSize;
    this.boxSeparation = boxSeparation;
    this.centerXOffset = centerXOffset;
    this.minX = minX;
    this.maxX = maxX;
  };

  return inherit( Object, HorizontalAligner, {

    /**
     * Gets the offsets for an equation's reactant terms.
     * Reactants are on the left-hand side of the equation.
     * @param equation
     */
    getReactantXOffsets: function( equation ) {
      return this.getXOffsets( equation.reactants, false /*right justified */, this.centerXOffset - this.boxSize.width - this.boxSeparation / 2/* left edge of left box */ );
    },

    /**
     * Gets the offsets for an equation's product terms.
     * Products are on the right-hand side of the equation.
     * @param equation
     */
    getProductXOffsets: function( equation ) {
      return this.getXOffsets( equation.products, true /*left justified */, this.centerXOffset + this.boxSeparation / 2/* left edge of right box */ );
    },

    /**
     * Gets the x offsets for a set of terms.
     * The box is divided up into columns and terms are centered in the columns.
     * @param terms
     * @param leftJustified
     * @param xAdjustment
     */
    getXOffsets: function( terms, leftJustified, xAdjustment ) {
      var numberOfTerms = terms.length;
      var xOffsets = [];
      if ( numberOfTerms === 1 ) {
        /* In the special case of 1 term, the box is divided into 2 columns,
         * and the single term is centered in the column that corresponds to alignment.*/
        if ( leftJustified ) {
          xOffsets[0] = xAdjustment + ( 0.25 * this.boxSize.width );
        }
        else {
          xOffsets[0] = xAdjustment + ( 0.75 * this.boxSize.width );
        }
      }
      else {
        /*
         * In the general case of N terms, the box is divided into N columns,
         * and one term is centered in each column.
         */
        var columnWidth = this.boxSize.width / numberOfTerms;
        var x = xAdjustment + columnWidth / 2;
        for ( var i = 0; i < numberOfTerms; i++ ) {
          xOffsets[i] = x;
          x += columnWidth;
        }
      }
      return xOffsets;
    }
  } );
} );
