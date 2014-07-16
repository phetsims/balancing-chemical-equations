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
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var BCEQueryParameters = require( 'BALANCING_CHEMICAL_EQUATIONS/common/BCEQueryParameters' );

  // constants
  var DEBUG_BOUNDS = true; // if true and running in 'dev' mode, draw the bounds of each scale with a 'red' stroke

  /**
   * @param {Property<Equation>} equationProperty the equation that the scales are representing
   * @param {HorizontalAligner} aligner provides layout information to ensure horizontal alignment with other user-interface elements
   * @param {*} options
   * @constructor
   */
  function BalanceScalesNode( equationProperty, aligner, options ) {

    var self = this;
    Node.call( this );

    this.equationProperty = equationProperty;
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
    } );

    this.mutate( options );
  }

  return inherit( Node, BalanceScalesNode, {

    /**
     * Update the node when it becomes visible.
     * @param visible
     * @override
     */
    setVisible: function( visible ) {
      var wasVisible = this.visible;
      Node.prototype.setVisible.call( this, visible );
      if ( !wasVisible && visible ) {
        this.updateNode();
        this.centerX = this.aligner.getScreenCenterX();
      }
    },

    /**
     * Updates this node's entire geometry and layout.
     */
    updateNode: function() {
      if ( this.visible ) {
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
          if ( DEBUG_BOUNDS && BCEQueryParameters.DEV ) {
            self.addChild( new Rectangle( scaleNode.bounds.minX, scaleNode.bounds.minY, scaleNode.bounds.width, scaleNode.bounds.height, { stroke: 'red' } ) );
          }
          x += dx;
        } );
      }
    }
  } );
} );