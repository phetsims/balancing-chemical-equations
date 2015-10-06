// Copyright 2002-2014, University of Colorado Boulder

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
  var Property = require( 'AXON/Property' );

  /**
   * @param {Property.<Equation>} equationProperty the equation that the scales are representing
   * @param {HorizontalAligner} aligner provides layout information to ensure horizontal alignment with other user-interface elements
   * @param {Object} [options]
   * @constructor
   */
  function BalanceScalesNode( equationProperty, aligner, options ) {

    options = _.extend( {
      bottom: 0,
      fulcrumSpacing: 237, // horizontal spacing between the tips of the fulcrums
      dualFulcrumSpacing: 237 // horizontal spacing when we have 2 scales, see issue #91
    }, options );

    var self = this;

    this.equationProperty = equationProperty; // @private
    this.aligner = aligner; // @private
    this.constantBottom = options.bottom; // @private
    this.reactantCountProperties = {}; // @private maps {string} Element.symbol to {Property.<number>} count of the element
    this.productCountProperties = {}; // @private maps {string} Element.symbol to {Property.<number>} counts of the element
    this.fulcrumSpacing = options.fulcrumSpacing; // @private
    this.dualFulcrumSpacing = options.dualFulcrumSpacing; // @private

    Node.call( this );

    // Wire coefficients observer to current equation.
    var coefficientsObserver = this.updateCounts.bind( this );
    equationProperty.link( function( newEquation, oldEquation ) {
      self.updateNode();
      if ( oldEquation ) { oldEquation.removeCoefficientsObserver( coefficientsObserver ); }
      newEquation.addCoefficientsObserver( coefficientsObserver );
    } );

    this.mutate( options );
  }

  return inherit( Node, BalanceScalesNode, {

    // No dispose needed, instances of this type persist for lifetime of the sim.

    /**
     * Update the node when it becomes visible.
     * @param visible
     * @override
     * @public
     */
    setVisible: function( visible ) {
      var wasVisible = this.visible;
      Node.prototype.setVisible.call( this, visible );
      if ( !wasVisible && visible ) {
        this.updateNode();
      }
    },

    /**
     * Updates this node's entire geometry and layout.
     * @private
     */
    updateNode: function() {
      if ( this.visible ) {

        // dispose of children before calling removeAllChildren
        this.getChildren().forEach( function( child ) {
          if ( child.dispose ) {
            child.dispose();
          }
        } );

        // remove all nodes and clear the maps
        this.removeAllChildren();
        this.reactantCountProperties = {};
        this.productCountProperties = {};

        var atomCounts = this.equationProperty.get().getAtomCounts(); // [AtomCount]
        var fulcrumSpacing = ( atomCounts.length === 2 ) ? this.dualFulcrumSpacing : this.fulcrumSpacing;
        var x = 0;
        for ( var i = 0; i < atomCounts.length; i++ ) {

          var atomCount = atomCounts[ i ];

          // populate the maps
          var leftCountProperty = new Property( atomCount.reactantsCount );
          var rightCountProperty = new Property( atomCount.productsCount );
          this.reactantCountProperties[ atomCount.element.symbol ] = leftCountProperty;
          this.productCountProperties[ atomCount.element.symbol ] = rightCountProperty;

          // add a scale node
          var scaleNode = new BalanceScaleNode( atomCount.element, leftCountProperty, rightCountProperty, this.equationProperty.get().balancedProperty, { x: x } );
          this.addChild( scaleNode );

          x += fulcrumSpacing;
        }

        this.centerX = this.aligner.getScreenCenterX();
        this.bottom = this.constantBottom;
        this.updateCounts();
      }
    },

    /**
     * Updates the atom counts for each scale.
     * @private
     */
    updateCounts: function() {
      if ( this.visible ) {
        var atomCounts = this.equationProperty.get().getAtomCounts();
        for ( var i = 0; i < atomCounts.length; i++ ) {
          var atomCount = atomCounts[ i ];
          this.reactantCountProperties[ atomCount.element.symbol ].set( atomCount.reactantsCount );
          this.productCountProperties[ atomCount.element.symbol ].set( atomCount.productsCount );
        }
      }
    }
  } );
} );