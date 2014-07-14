// Copyright 2002-2014, University of Colorado


/**
 * Visual representation of an equation as a set of balance scales, one for each atom type.
 * The left side of each scale is the reactants, the right side is the products.
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
  var BalanceScaleNode = require( 'BALANCING_CHEMICAL_EQUATIONS/common/view/BalanceScaleNode' );

  /**
   * @param {Property<Equation>} equationProperty the equation that the scales are representing
   * @param {HorizontalAligner} aligner provides layout information to ensure horizontal alignment with other user-interface elements
   * @param {Number} maxY - max bottom y position of node
   * @constructor
   */
  function BalanceScalesNode( equationProperty, aligner, maxY ) {

    var self = this;
    Node.call( this );

    this.equationProperty = equationProperty
    this.maxY = maxY || 0;
    this.aligner = aligner;

    //if coefficient changes
    var coefficientsObserver = function() {
      self.updateNode();
    };

    // if the equation changes...
    equationProperty.link( function( newEquation, oldEquation ) {
      if ( oldEquation ) { oldEquation.removeCoefficientsObserver( coefficientsObserver ); }
      newEquation.addCoefficientsObserver( coefficientsObserver );
      self.centerX = self.aligner.getScreenCenterX();
      self.bottom = self.maxY;
    } );
  }

  return inherit( Node, BalanceScalesNode, {

    /**
     * Updates this node's entire geometry and layout
     */
    updateNode: function() {
      var self = this;

      this.removeAllChildren();
      var atomCounts = this.equationProperty.get().getAtomCounts();
      var xSpacing = 32;
      var dx = BalanceScaleNode.getBeamLength() + xSpacing;
      var x = 0;
      var highlighted = this.equationProperty.get().balanced;
      atomCounts.forEach( function( atomCount ) {
        var scaleNode = new BalanceScaleNode( atomCount.element, atomCount.reactantsCount, atomCount.productsCount, highlighted, {x: x} );
        self.addChild( scaleNode );
        x += dx;
      } );
    }
  } );
} );