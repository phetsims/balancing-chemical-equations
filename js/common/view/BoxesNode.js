// Copyright 2002-2014, University of Colorado Boulder

/**
 * A pair of boxes that show the number of molecules indicated by the equation's user coefficients.
 * Left box is for the reactants, right box is for the products.
 *
 * @author Vasily Shakhov (mlearner.com)
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var BoxNode = require( 'BALANCING_CHEMICAL_EQUATIONS/common/view/BoxNode' );
  var RightArrowNode = require( 'BALANCING_CHEMICAL_EQUATIONS/common/view/RightArrowNode' );
  var Vector2 = require( 'DOT/Vector2' );

  // strings
  var reactantsString = require( 'string!BALANCING_CHEMICAL_EQUATIONS/reactants' );
  var productsString = require( 'string!BALANCING_CHEMICAL_EQUATIONS/products' );

  /**
   * @param {Property.<Equation>} equationProperty the equation displayed in the boxes
   * @param {Range} coefficientsRange
   * @param {HorizontalAligner} aligner provides layout information to ensure horizontal alignment with other user-interface elements
   * @param {Dimension2} boxSize
   * @param {string} boxColor fill color of the boxes
   * @param {Property.<boolean>} reactantsBoxExpandedProperty
   * @param {Property.<boolean>} productsBoxExpandedProperty
   * @param {Object} [options]
   * @constructor
   */
  function BoxesNode( equationProperty, coefficientsRange, aligner, boxSize, boxColor, reactantsBoxExpandedProperty, productsBoxExpandedProperty, options ) {

    // reactants box, on the left
    var reactantsBoxNode = new BoxNode( equationProperty,
      function( equation ) { return equation.reactants; },
      function( equation ) { return aligner.getReactantXOffsets( equation ); },
      coefficientsRange,
      reactantsBoxExpandedProperty,
      {
        fill: boxColor,
        title: reactantsString,
        boxWidth: boxSize.width,
        boxHeight: boxSize.height,
        x: aligner.getReactantsBoxLeft(),
        y: 0
      } );

    // products box, on the right
    var productsBoxNode = new BoxNode( equationProperty,
      function( equation ) { return equation.products; },
      function( equation ) { return aligner.getProductXOffsets( equation ); },
      coefficientsRange,
      productsBoxExpandedProperty,
      {
        fill: boxColor,
        title: productsString,
        boxWidth: boxSize.width,
        boxHeight: boxSize.height,
        x: aligner.getProductsBoxLeft(),
        y: 0
      } );

    // @private right-pointing arrow, in the middle
    this.arrowNode = new RightArrowNode( equationProperty,
      { center: new Vector2( aligner.getScreenCenterX(), boxSize.height / 2 ) } );

    options.children = [ reactantsBoxNode, productsBoxNode, this.arrowNode ];
    Node.call( this, options );
  }

  return inherit( Node, BoxesNode, {

    /**
     * Enables or disables the highlighting feature.
     * When enabled, the arrow between the boxes will light up when the equation is balanced.
     * This is enabled by default, but we want to disable in the Game until the user presses the "Check" button.
     * @param enabled
     */
    setBalancedHighlightEnabled: function( enabled ) {
      this.arrowNode.highlightEnabled = enabled;
    }
  } );
} );