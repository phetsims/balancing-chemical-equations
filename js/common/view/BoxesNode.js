// Copyright 2002-2014, University of Colorado Boulder

/**
 * A pair of boxes that show the number of molecules indicated by the equation's user coefficients.
 * Left box is for the reactants, right box is for the products.
 *
 * @author Vasily Shakhov (mlearner.com)
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
   * Constructor
   * @param equationProperty the equation
   * @param coefficientRange range of the coefficients
   * @param aligner provides layout information to ensure horizontal alignment with other user-interface elements
   * @param boxColorProperty fill color of the boxes
   */

  function BoxesNode( equationProperty, coefficientRange, aligner, boxColorProperty, options ) {
    var self = this;
    Node.call( this, options );

    this.coefficientRange = coefficientRange;
    this.aligner = aligner;
    this.equation = equationProperty.get();
    this.balancedHighlightEnabled = true;

    //boxes
    this.reactantsBoxNode = new BoxNode( aligner, coefficientRange, {
      fill: boxColorProperty,
      title: reactantsString,
      x: aligner.centerXOffset - aligner.boxSize.width - aligner.boxSeparation / 2,
      width: aligner.boxSize.width,
      y: 0,
      height: aligner.boxSize.height
    } );
    this.addChild( this.reactantsBoxNode );

    this.productsBoxNode = new BoxNode( aligner, coefficientRange, {
      fill: boxColorProperty,
      title: productsString,
      x: aligner.centerXOffset + aligner.boxSeparation / 2,
      width: aligner.boxSize.width,
      y: 0,
      height: aligner.boxSize.height
    } );
    this.addChild( this.productsBoxNode );

    // right-pointing arrow
    this.arrowNode = new RightArrowNode( equationProperty.balanced );
    this.arrowNode.center = new Vector2( aligner.centerXOffset, aligner.boxSize.height / 2 );
    this.addChild( this.arrowNode );

    // if the equation changes...
    equationProperty.link( function( newEquation, oldEquation ) {
      if ( oldEquation ) {
        oldEquation.removeCoefficientsObserver( self.updateNode.bind( self ) );
      }
      if ( newEquation ) {
        self.equation = newEquation;
        //observer for coefficients
        self.equation.addCoefficientsObserver( self.updateNode.bind( self ) );
      }
    } );
  }

  return inherit( Node, BoxesNode, {
    /**
     * Enables or disables the highlighting feature.
     * When enabled, the arrow between the boxes will light up when the equation is balanced.
     * This is enabled by default, but we want to disable in the Game until the user presses the "Check" button.
     * @param enabled
     */
    setBalancedHighlightEnabled: function( enabled ) {
      if ( enabled !== this.balancedHighlightEnabled ) {
        this.balancedHighlightEnabled = enabled;
        this.arrowNode.setHighlighted( this.equation.isBalanced() && this.balancedHighlightEnabled );
      }
    },
    /*
     *Updates the number of molecules and whether the arrow is highlighted.
     */
    updateNode: function() {
      this.arrowNode.setHighlighted( this.equation.balanced && this.balancedHighlightEnabled );
      this.reactantsBoxNode.createMolecules( this.equation.reactants, this.aligner.getReactantXOffsets( this.equation ) );
      this.productsBoxNode.createMolecules( this.equation.products, this.aligner.getProductXOffsets( this.equation ) );
    }
  } );

} );