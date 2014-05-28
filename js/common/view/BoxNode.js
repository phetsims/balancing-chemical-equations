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
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var AccordionBox = require( 'SUN/AccordionBox' );


  /**
   * Constructor
   * @param {[EquationTerm]} terms of the equation
   * @param coefficientRange range of the coefficients
   * @param aligner provides layout information to ensure horizontal alignment with other user-interface elements
   * @param {Object} options
   */

  function BoxNode( terms, coefficientRange, offsets, options ) {
    this.coefficientRange = coefficientRange;

    var contentNode = new Node();
    contentNode.addChild( new Rectangle( 0, 0, options.width, options.height, {fill: 'white', lineWidth: 1, stroke: 'black'} ) );

    Node.call( this, options );
    this.addChild( contentNode );
  }


  return inherit( Node, BoxNode, {} );

} );

/*
 // boxes
 final BoxNode reactantsBoxNode = new BoxNode( aligner.getBoxSizeReference() );
 addChild( reactantsBoxNode );
 final BoxNode productsBoxNode = new BoxNode( aligner.getBoxSizeReference() );
 addChild( productsBoxNode );

 // right-pointing arrow
 arrowNode = new RightArrowNode( equationProperty.get().isBalanced() );
 addChild( arrowNode );

 // molecules
 moleculesParentNode = new PComposite();
 addChild( moleculesParentNode );

 // "molecules are hidden" message
 moleculesHiddenLeftNode = new MoleculesAreHiddenNode();
 addChild( moleculesHiddenLeftNode );
 moleculesHiddenRightNode = new MoleculesAreHiddenNode();
 addChild( moleculesHiddenRightNode );

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

 // coefficient changes
 coefficientsObserver = new SimpleObserver() {
 public void update() {
 updateNode();
 }
 };
 // equation changes
 this.equation = equationProperty.get();
 equationProperty.addObserver( new SimpleObserver() {
 public void update() {
 BoxesNode.this.equation.removeCoefficientsObserver( coefficientsObserver );
 BoxesNode.this.equation = equationProperty.get();
 BoxesNode.this.equation.addCoefficientsObserver( coefficientsObserver );
 }
 } );
 // box color changes
 boxColorProperty.addObserver( new SimpleObserver() {
 public void update() {
 reactantsBoxNode.setPaint( boxColorProperty.get() );
 productsBoxNode.setPaint( boxColorProperty.get() );
 }
 } );
 // molecules visibility
 moleculesVisibleProperty.addObserver( new SimpleObserver() {
 public void update() {
 setMoleculesVisible( moleculesVisibleProperty.get() );
 }
 } );
 }

 *//*
 * Shows or hides the molecules in the boxes.
 *//*
 private void setMoleculesVisible( boolean moleculesVisible ) {
 moleculesParentNode.setVisible( moleculesVisible );
 moleculesHiddenLeftNode.setVisible( !moleculesVisible );
 moleculesHiddenRightNode.setVisible( !moleculesVisible );
 }

 *//**
 * Enables or disables the highlighting feature.
 * When enabled, the arrow between the boxes will light up when the equation is balanced.
 * This is enabled by default, but we want to disable in the Game until the user presses the "Check" button.
 * @param enabled
 *//*
 public void setBalancedHighlightEnabled( boolean enabled ) {
 if ( enabled != balancedHighlightEnabled ) {
 balancedHighlightEnabled = enabled;
 arrowNode.setHighlighted( equation.isBalanced() && balancedHighlightEnabled );
 }
 }

 *//*
 * Updates the number of molecules and whether the arrow is highlighted.
 *//*
 private void updateNode() {
 moleculesParentNode.removeAllChildren();
 createMolecules( equation.getReactants(), aligner.getReactantXOffsets( equation ) );
 createMolecules( equation.getProducts(), aligner.getProductXOffsets( equation ) );
 arrowNode.setHighlighted( equation.isBalanced() && balancedHighlightEnabled );
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

 *//*
 * The "molecules are hidden" message.
 *//*
 private static class MoleculesAreHiddenNode extends HTMLNode {
 public MoleculesAreHiddenNode() {
 super( BCEStrings.MOLECULES_ARE_HIDDEN, Color.WHITE, new PhetFont( 18 ) );
 }
 }
 }*/
