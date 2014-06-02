// Copyright 2002-2014, University of Colorado Boulder

/**
 * Visual representation of an equation as a pair of bar charts, for left and right side of equation.
 * An indicator between the charts (equals or not equals) indicates whether they are balanced.
 * <p>
 * This implementation is very brute force, just about everything is recreated each time
 * a coefficient is changed in the equations.  But we have a small number of coefficients,
 * and nothing else is happening in the sim.  So we're trading efficiency for simplicity of
 * implementation.
 *
 * @author Vasily Shakhov (mlearner.com)
 */

define( function( require ) {
  'use strict';

// modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var BarNode = require( 'BALANCING_CHEMICAL_EQUATIONS/common/view/BarNode' );

  /**
   * Constructor
   * @param {Equation} equationProperty the equation that the chart is representing
   * @param {HorizontalAligner} aligner provides layout information to ensure horizontal alignment with other user-interface elements
   * @param {Object} options
   */
  function BarChartsNode( equationProperty, aligner, maxY) {
    var self = this;
    Node.call( this );

    this.maxY = maxY;
    this.aligner = aligner;

    this.reactantsChartParent = new Node();
    this.addChild( this.reactantsChartParent );

    this.productsChartParent = new Node();
    this.addChild( this.productsChartParent );


    //TODO
    /*this.equalsSignNode = new EqualsSignNode( equationProperty.get().isBalanced() );
     addChild( equalsSignNode );

     notEqualsSignNode = new NotEqualsSignNode();
     addChild( notEqualsSignNode );*/

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

  return inherit( Node, BarChartsNode, {
    /*
     * Updates this node's entire geometry and layout
     */
    updateNode: function() {
      this.updateChart( this.reactantsChartParent, true /* isReactants */ );
      this.updateChart( this.productsChartParent, false /* isReactants */ );
      this.updateEqualitySign();
      this.updateLayout();
    },
    updateChart: function( parentNode, isReactants ) {
      parentNode.removeAllChildren();
      var x = 0;
      var atomCounts = this.equation.getAtomCounts();

      atomCounts.forEach( function( atomCount ) {
        var count = ( isReactants ? atomCount.reactantsCount : atomCount.productsCount );
        var barNode = new BarNode( atomCount.element, count, {x: x} );
        parentNode.addChild( barNode );
        x = barNode.bounds.maxX + 50;
      } );

      if ( isReactants ) {
        parentNode.centerX = this.aligner.centerXOffset - this.aligner.boxSeparation / 2 - this.aligner.boxSize.width / 2;
      }
      else {
        parentNode.centerX = this.aligner.centerXOffset + this.aligner.boxSeparation / 2 + this.aligner.boxSize.width / 2;
      }

    },
    updateEqualitySign: function() {},
    updateLayout: function() {
      this.bottom = this.maxY;
    }
  } );

} );

/*
 * Updates the equality sign.
 *//*

 private void updateEqualitySign() {
 // visibility
 equalsSignNode.setVisible( equation.isBalanced() );
 notEqualsSignNode.setVisible( !equalsSignNode.getVisible() );
 // highlight
 equalsSignNode.setHighlighted( equation.isBalanced() );
 }

 */
/*
 * Updates the layout.
 *//*

 private void updateLayout() {

 final double xSpacing = 120;

 // equals sign at center
 double x = aligner.getCenterXOffset() - ( equalsSignNode.getFullBoundsReference().getWidth() / 2 );
 double y = -equalsSignNode.getFullBoundsReference().getHeight() / 2;
 equalsSignNode.setOffset( x, y );
 notEqualsSignNode.setOffset( x, y );

 // reactants chart to the left
 x = equalsSignNode.getFullBoundsReference().getMinX() - reactantsChartParent.getFullBoundsReference().getWidth() - PNodeLayoutUtils.getOriginXOffset( reactantsChartParent ) - xSpacing;
 y = 0;
 reactantsChartParent.setOffset( x, y );

 // products chart to the right
 x = equalsSignNode.getFullBoundsReference().getMaxX() - PNodeLayoutUtils.getOriginXOffset( productsChartParent ) + xSpacing;
 y = 0;
 productsChartParent.setOffset( x, y );
 }

 */
/*
 * Equals sign, drawn using Piccolo nodes so that we can put a stroke around it.
 * This will prevent it from disappearing on light-colored background when it "lights up" to indicate "balanaced".
 *//*

 private static class EqualsSignNode extends PComposite {

 private static final double BAR_WIDTH = 50;
 private static final double BAR_HEIGHT = 10;
 private static final double BAR_Y_SPACING = 10;

 private final PPath topBarNode, bottomBarNode;

 public EqualsSignNode( boolean highlighted ) {

 Rectangle2D shape = new Rectangle2D.Double( 0, 0, BAR_WIDTH, BAR_HEIGHT );
 Stroke stroke = new BasicStroke( 1.5f );
 Color strokeColor = Color.BLACK;

 topBarNode = new PPath( shape );
 topBarNode.setStroke( stroke );
 topBarNode.setStrokePaint( strokeColor );
 addChild( topBarNode );

 bottomBarNode = new PPath( shape );
 bottomBarNode.setStroke( stroke );
 bottomBarNode.setStrokePaint( strokeColor );
 addChild( bottomBarNode );

 // layout
 topBarNode.setOffset( 0, 0 );
 bottomBarNode.setOffset( 0, BAR_HEIGHT + BAR_Y_SPACING );

 setHighlighted( highlighted );
 }

 public void setHighlighted( boolean highlighted ) {
 topBarNode.setPaint( highlighted ? BCEConstants.BALANCED_HIGHLIGHT_COLOR : BCEConstants.UNBALANCED_COLOR );
 bottomBarNode.setPaint( highlighted ? BCEConstants.BALANCED_HIGHLIGHT_COLOR : BCEConstants.UNBALANCED_COLOR );
 }
 }

 */
/*
 * Not-equals sign, drawn using constructive-area geometry so that we can put a stroke around it.
 *//*

 private static class NotEqualsSignNode extends PPath {
 public NotEqualsSignNode() {
 super();
 setStroke( new BasicStroke( 1f ) );
 setStrokePaint( Color.BLACK );
 setPaint( BCEConstants.UNBALANCED_COLOR );

 Shape topBarShape = new Rectangle2D.Double( 0, 0, EqualsSignNode.BAR_WIDTH, EqualsSignNode.BAR_HEIGHT );
 Shape bottomBarShape = new Rectangle2D.Double( 0, EqualsSignNode.BAR_HEIGHT + EqualsSignNode.BAR_Y_SPACING, EqualsSignNode.BAR_WIDTH, EqualsSignNode.BAR_HEIGHT );

 Rectangle2D r = new Rectangle2D.Double( 0, EqualsSignNode.BAR_HEIGHT + ( ( EqualsSignNode.BAR_Y_SPACING - EqualsSignNode.BAR_HEIGHT ) / 2 ), EqualsSignNode.BAR_WIDTH, EqualsSignNode.BAR_HEIGHT );
 AffineTransform t2 = AffineTransform.getRotateInstance( Math.toRadians( -75 ), EqualsSignNode.BAR_WIDTH / 2, EqualsSignNode.BAR_HEIGHT + ( EqualsSignNode.BAR_Y_SPACING / 2 ) );
 Shape slashShape = t2.createTransformedShape( r );

 Area area = new Area( topBarShape );
 area.add( new Area( slashShape ) );
 area.add( new Area( bottomBarShape ) );
 setPathTo( area );
 }
 }
 }
 */
