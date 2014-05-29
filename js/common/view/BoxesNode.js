// Copyright 2002-2014, University of Colorado Boulder

/**
 * A pair of boxes that show the number of molecules indicated by the equation's user coefficients.
 * Left box is for the reactants, right box is for the products.
 *
 * @author Vasily Shakhov (mlearner.com)
 */

define( function( require ) {
  'use strict';

  //modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var BoxNode = require( 'BALANCING_CHEMICAL_EQUATIONS/common/view/BoxNode' );
  var RightArrowNode = require( 'BALANCING_CHEMICAL_EQUATIONS/common/view/RightArrowNode' );
  var Vector2 = require( 'DOT/Vector2' );

  //strings
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
    this.reactantsBoxNode = new BoxNode( aligner,coefficientRange, {
      fill: boxColorProperty,
      title: reactantsString,
      x: aligner.centerXOffset - aligner.boxSize.width - aligner.boxSeparation / 2,
      width: aligner.boxSize.width,
      y: 0,
      height: aligner.boxSize.height
    } );
    this.addChild( this.reactantsBoxNode );

    this.productsBoxNode = new BoxNode(aligner, coefficientRange, {
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


    //if coefficient changes
    var coefficientsObserver = function() {
      self.updateNode();
    };

    // if the equation changes...
    equationProperty.link( function( newEquation, oldEquation ) {
      if ( oldEquation ) {
        oldEquation.removeCoefficientsObserver( coefficientsObserver );
      }
      self.equation = newEquation;
      self.equation.addCoefficientsObserver( coefficientsObserver );
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

/*
 // molecules
 moleculesParentNode = new PComposite();
 addChild( moleculesParentNode );

 // layout
 double x = 0;
 double y = 0;
 reactantsBoxNode.setOffset( x, y );
 moleculesParentNode.setOffset( x, y );
 x = aligner.getCenterXOffset() - ( arrowNode.getFullBoundsReference().getWidth() / 2 );
 y = reactantsBoxNode.getFullBoundsReference().getCenterY() - ( arrowNode.getFullBoundsReference().getHeight() / 2 );
 arrowNode.setOffset( x, y );
 x = reactantsBoxNode.getFullBoundsReference().getMaxX() + aligner.getBoxSeparation();
 y = reactantsBoxNode.getYOffset();
 productsBoxNode.setOffset( x, y );
 x = reactantsBoxNode.getFullBoundsReference().getCenterX() - ( moleculesHiddenLeftNode.getFullBoundsReference().getWidth() / 2 );
 y = reactantsBoxNode.getFullBoundsReference().getCenterY() - ( moleculesHiddenLeftNode.getFullBoundsReference().getHeight() / 2 );
 moleculesHiddenLeftNode.setOffset( x, y );
 x = productsBoxNode.getFullBoundsReference().getCenterX() - ( moleculesHiddenRightNode.getFullBoundsReference().getWidth() / 2 );
 y = productsBoxNode.getFullBoundsReference().getCenterY() - ( moleculesHiddenRightNode.getFullBoundsReference().getHeight() / 2 );
 moleculesHiddenRightNode.setOffset( x, y );


 *//*
 * Updates the number of molecules and whether the arrow is highlighted.
 *//*
 private void updateNode() {
 moleculesParentNode.removeAllChildren();
 createMolecules( equation.getReactants(), aligner.getReactantXOffsets( equation ) );
 createMolecules( equation.getProducts(), aligner.getProductXOffsets( equation ) );
 }

 *//*
 * Creates molecules in the boxes for one set of terms (reactants or products).
 *//*
 private void createMolecules( EquationTerm[] terms, double[] xOffsets ) {
 assert( terms.length == xOffsets.length );
 final double yMargin = 10;
 final double rowHeight = ( aligner.getBoxSizeReference().getHeight() - ( 2 * yMargin ) ) / ( coefficientRange.getMax() );
 for ( int i = 0; i < terms.length; i++ ) {
 int numberOfMolecules = terms[i].getUserCoefficient();
 Image moleculeImage = terms[i].getMolecule().getImage();
 double y = 0;
 if ( TOP_DOWN_STACKS ) {
 y = yMargin + ( rowHeight / 2 );
 }
 else {
 y = aligner.getBoxSizeReference().getHeight() - yMargin - ( rowHeight / 2 );
 }
 for ( int j = 0; j < numberOfMolecules; j++ ) {
 PImage imageNode = new PImage( moleculeImage );
 moleculesParentNode.addChild( imageNode );
 imageNode.setOffset( xOffsets[i] - ( imageNode.getFullBoundsReference().getWidth() / 2 ), y - ( imageNode.getFullBoundsReference().getHeight()  / 2 ) );
 if ( TOP_DOWN_STACKS ) {
 y += rowHeight;
 }
 else {
 y -= rowHeight;
 }
 }
 }
 }

 *//*
 * A simple box.
 *//*
 private static class BoxNode extends PPath {
 public BoxNode( Dimension boxSize ) {
 super( new Rectangle2D.Double( 0, 0, boxSize.getWidth(), boxSize.getHeight() ) );
 setStrokePaint( Color.BLACK );
 setStroke( new BasicStroke( 1f ) );
 }
 }


 }*/
