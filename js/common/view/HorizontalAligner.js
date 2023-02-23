// Copyright 2014-2023, University of Colorado Boulder

// @ts-nocheck
/**
 * Encapsulates the strategy used to horizontally aligning terms in an equation
 * with columns of molecules in the "boxes" view.  Based on knowledge of the
 * size and separation of the boxes, we determine the x-axis offset for each
 * term in the equation.  This offset is relative to a local coordinate system
 * where the origin is at (0,0).
 *
 * @author Vasily Shakhov (mlearner.com)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import balancingChemicalEquations from '../../balancingChemicalEquations.js';

export default class HorizontalAligner {

  /**
   * @param {number} screenWidth screen width
   * @param {DOT.Dimension2} boxWidth size of one of the 2 boxes (both boxes are assumed to be the same size)
   * @param {number} boxXSpacing horizontal separation between the left and right boxes
   */
  constructor( screenWidth, boxWidth, boxXSpacing ) {
    this.screenWidth = screenWidth; // @private
    this.boxWidth = boxWidth; // @private
    this.boxXSpacing = boxXSpacing; // @private
  }

  /**
   * Gets the offsets for an equation's reactant terms.
   * Reactants are on the left-hand side of the equation.
   * @param equation
   * @public
   */
  getReactantXOffsets( equation ) {
    const boxLeft = this.screenWidth / 2 - this.boxWidth - this.boxXSpacing / 2;
    return getXOffsets( equation.reactants, this.boxWidth, boxLeft, 'right' );
  }

  /**
   * Gets the offsets for an equation's product terms.
   * Products are on the right-hand side of the equation.
   * @param equation
   * @public
   */
  getProductXOffsets( equation ) {
    const boxLeft = this.screenWidth / 2 + this.boxXSpacing / 2;
    return getXOffsets( equation.products, this.boxWidth, boxLeft, 'left' );
  }

  // @public
  getScreenWidth() { return this.screenWidth; }

  // @public
  getScreenLeft() { return 0; }

  // @public
  getScreenRight() { return this.screenWidth; }

  // @public
  getScreenCenterX() { return this.screenWidth / 2; }

  // @public
  getReactantsBoxLeft() {
    return this.getScreenCenterX() - this.boxXSpacing / 2 - this.boxWidth;
  }

  // @public
  getProductsBoxLeft() {
    return this.getScreenCenterX() + this.boxXSpacing / 2;
  }

  // @public
  getReactantsBoxRight() {
    return this.getScreenCenterX() - this.boxXSpacing / 2;
  }

  // @public
  getProductsBoxRight() {
    return this.getScreenCenterX() + this.boxXSpacing / 2 + this.boxWidth;
  }

  // @public
  getReactantsBoxCenterX() {
    return this.getScreenCenterX() - this.boxXSpacing / 2 - this.boxWidth / 2;
  }

  // @public
  getProductsBoxCenterX() {
    return this.getScreenCenterX() + this.boxXSpacing / 2 + this.boxWidth / 2;
  }
}

/**
 * Gets the x offsets for a set of terms.
 * The box is divided up into columns and terms are centered in the columns.
 * @param terms
 * @param {number} boxWidth
 * @param {number} boxLeft left edge of box
 * @param alignment alignment for single term, 'left' or 'right'
 * @returns [{number}] x offset for each term
 */
function getXOffsets( terms, boxWidth, boxLeft, alignment ) {

  assert && assert( alignment === 'left' || alignment === 'right' );

  const numberOfTerms = terms.length;
  const xOffsets = [];
  if ( numberOfTerms === 1 ) {
    /*
     * In the special case of 1 term, the box is divided into 2 columns,
     * and the single term is centered in the column that corresponds to alignment.
     */
    if ( alignment === 'left' ) {
      xOffsets[ 0 ] = boxLeft + ( 0.25 * boxWidth );
    }
    else {
      xOffsets[ 0 ] = boxLeft + ( 0.75 * boxWidth );
    }
  }
  else {
    /*
     * In the general case of N terms, the box is divided into N columns,
     * and one term is centered in each column.
     */
    const columnWidth = boxWidth / numberOfTerms;
    let x = boxLeft + columnWidth / 2;
    for ( let i = 0; i < numberOfTerms; i++ ) {
      xOffsets[ i ] = x;
      x += columnWidth;
    }
  }
  return xOffsets;
}

balancingChemicalEquations.register( 'HorizontalAligner', HorizontalAligner );