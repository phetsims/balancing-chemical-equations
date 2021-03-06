// Copyright 2014-2021, University of Colorado Boulder

/**
 * A pair of boxes that show the number of molecules indicated by the equation's user coefficients.
 * Left box is for the reactants, right box is for the products.
 *
 * @author Vasily Shakhov (mlearner.com)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import balancingChemicalEquationsStrings from '../../balancingChemicalEquationsStrings.js';
import BoxNode from './BoxNode.js';
import RightArrowNode from './RightArrowNode.js';

class BoxesNode extends Node {

  /**
   * @param {Property.<Equation>} equationProperty the equation displayed in the boxes
   * @param {Range} coefficientsRange
   * @param {HorizontalAligner} aligner provides layout information to ensure horizontal alignment with other user-interface elements
   * @param {Dimension2} boxSize
   * @param {string} boxColor fill color of the boxes
   * @param {Property.<boolean>} reactantsBoxExpandedProperty
   * @param {Property.<boolean>} productsBoxExpandedProperty
   * @param {Object} [options]
   */
  constructor( equationProperty, coefficientsRange, aligner, boxSize, boxColor,
               reactantsBoxExpandedProperty, productsBoxExpandedProperty, options ) {

    // reactants box, on the left
    const reactantsBoxNode = new BoxNode( equationProperty,
      equation => equation.reactants,
      equation => aligner.getReactantXOffsets( equation ),
      coefficientsRange,
      balancingChemicalEquationsStrings.reactants, {
        expandedProperty: reactantsBoxExpandedProperty,
        fill: boxColor,
        boxWidth: boxSize.width,
        boxHeight: boxSize.height,
        x: aligner.getReactantsBoxLeft(),
        y: 0
      } );

    // products box, on the right
    const productsBoxNode = new BoxNode( equationProperty,
      equation => equation.products,
      equation => aligner.getProductXOffsets( equation ),
      coefficientsRange,
      balancingChemicalEquationsStrings.products, {
        expandedProperty: productsBoxExpandedProperty,
        fill: boxColor,
        boxWidth: boxSize.width,
        boxHeight: boxSize.height,
        x: aligner.getProductsBoxLeft(),
        y: 0
      } );

    // right-pointing arrow, in the middle
    const arrowNode = new RightArrowNode( equationProperty, {
      center: new Vector2( aligner.getScreenCenterX(), boxSize.height / 2 )
    } );

    options.children = [ reactantsBoxNode, productsBoxNode, arrowNode ];
    super( options );

    // private
    this.arrowNode = arrowNode;
  }

  // No dispose needed, instances of this type persist for lifetime of the sim.

  /**
   * Enables or disables the highlighting feature.
   * When enabled, the arrow between the boxes will light up when the equation is balanced.
   * This is enabled by default, but we want to disable in the Game until the user presses the "Check" button.
   * @param enabled
   * @public
   */
  setBalancedHighlightEnabled( enabled ) {
    this.arrowNode.highlightEnabled = enabled;
  }
}

balancingChemicalEquations.register( 'BoxesNode', BoxesNode );
export default BoxesNode;