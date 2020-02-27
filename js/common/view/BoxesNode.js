// Copyright 2014-2019, University of Colorado Boulder

/**
 * A pair of boxes that show the number of molecules indicated by the equation's user coefficients.
 * Left box is for the reactants, right box is for the products.
 *
 * @author Vasily Shakhov (mlearner.com)
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const balancingChemicalEquations = require( 'BALANCING_CHEMICAL_EQUATIONS/balancingChemicalEquations' );
  const BoxNode = require( 'BALANCING_CHEMICAL_EQUATIONS/common/view/BoxNode' );
  const Node = require( 'SCENERY/nodes/Node' );
  const RightArrowNode = require( 'BALANCING_CHEMICAL_EQUATIONS/common/view/RightArrowNode' );
  const Vector2 = require( 'DOT/Vector2' );

  // strings
  const productsString = require( 'string!BALANCING_CHEMICAL_EQUATIONS/products' );
  const reactantsString = require( 'string!BALANCING_CHEMICAL_EQUATIONS/reactants' );

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
        function( equation ) { return equation.reactants; },
        function( equation ) { return aligner.getReactantXOffsets( equation ); },
        coefficientsRange,
        reactantsString, {
          expandedProperty: reactantsBoxExpandedProperty,
          fill: boxColor,
          boxWidth: boxSize.width,
          boxHeight: boxSize.height,
          x: aligner.getReactantsBoxLeft(),
          y: 0
        } );

      // products box, on the right
      const productsBoxNode = new BoxNode( equationProperty,
        function( equation ) { return equation.products; },
        function( equation ) { return aligner.getProductXOffsets( equation ); },
        coefficientsRange,
        productsString, {
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

  return balancingChemicalEquations.register( 'BoxesNode', BoxesNode );
} );