// Copyright 2014-2023, University of Colorado Boulder

/**
 * HorizontalAligner encapsulates the strategy used to horizontally aligning terms in an equation with columns of
 * molecules in the "boxes" view.  Based on knowledge of the size and separation of the boxes, we determine the
 * x-axis offset for each term in the equation.  This offset is relative to a local coordinate system where the
 * origin is at (0,0).
 *
 * @author Vasily Shakhov (mlearner.com)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import Equation from '../model/Equation.js';
import EquationTerm from '../model/EquationTerm.js';

export default class HorizontalAligner {

  private readonly screenWidth: number;
  private readonly boxWidth: number;
  private readonly boxXSpacing: number;

  /**
   * @param screenWidth screen width
   * @param boxWidth size of one of the 2 boxes (both boxes are assumed to be the same size)
   * @param boxXSpacing horizontal separation between the left and right boxes
   */
  public constructor( screenWidth: number, boxWidth: number, boxXSpacing: number ) {
    this.screenWidth = screenWidth;
    this.boxWidth = boxWidth;
    this.boxXSpacing = boxXSpacing;
  }

  /**
   * Gets the offsets for an equation's reactant terms.
   * Reactants are on the left-hand side of the equation.
   */
  public getReactantXOffsets( equation: Equation ): number[] {
    const boxLeft = this.screenWidth / 2 - this.boxWidth - this.boxXSpacing / 2;
    return getXOffsets( equation.reactants, this.boxWidth, boxLeft, 'right' );
  }

  /**
   * Gets the offsets for an equation's product terms.
   * Products are on the right-hand side of the equation.
   */
  public getProductXOffsets( equation: Equation ): number[] {
    const boxLeft = this.screenWidth / 2 + this.boxXSpacing / 2;
    return getXOffsets( equation.products, this.boxWidth, boxLeft, 'left' );
  }

  public getScreenWidth(): number { return this.screenWidth; }

  public getScreenLeft(): number { return 0; }

  public getScreenRight(): number { return this.screenWidth; }

  public getScreenCenterX(): number { return this.screenWidth / 2; }

  public getReactantsBoxLeft(): number {
    return this.getScreenCenterX() - this.boxXSpacing / 2 - this.boxWidth;
  }

  public getProductsBoxLeft(): number {
    return this.getScreenCenterX() + this.boxXSpacing / 2;
  }

  public getReactantsBoxRight(): number {
    return this.getScreenCenterX() - this.boxXSpacing / 2;
  }

  public getProductsBoxRight(): number {
    return this.getScreenCenterX() + this.boxXSpacing / 2 + this.boxWidth;
  }

  public getReactantsBoxCenterX(): number {
    return this.getScreenCenterX() - this.boxXSpacing / 2 - this.boxWidth / 2;
  }

  public getProductsBoxCenterX(): number {
    return this.getScreenCenterX() + this.boxXSpacing / 2 + this.boxWidth / 2;
  }
}

/**
 * Gets the x offsets for a set of terms.
 * The box is divided up into columns and terms are centered in the columns.
 * @param terms
 * @param boxWidth
 * @param boxLeft - left edge of box
 * @param alignment - alignment for single term, 'left' or 'right'
 * @returns x offset for each term
 */
function getXOffsets( terms: EquationTerm[], boxWidth: number, boxLeft: number, alignment: 'left' | 'right' ): number[] {

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