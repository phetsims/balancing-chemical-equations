// Copyright 2002-2014, University of Colorado

/**
 * An arrow that points left to right, from reactants to products.
 * Highlights when the equation is balanced.
 *
 * @author Vasily Shakhov (mlearner.com)
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Vector2 = require( 'DOT/Vector2' );
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  var BCEConstants = require( 'BALANCING_CHEMICAL_EQUATIONS/common/BCEConstants' );

  // constants
  var TAIL_LOCATION = new Vector2( 0, 0 );
  var TIP_LOCATION = new Vector2( 75, 0 );
  var HEAD_HEIGHT = 30;
  var HEAD_WIDTH = 35;
  var TAIL_WIDTH = 15;
  var SCALE = 0.95;

  /**
   * @param {Property<Equation>} equationProperty
   * @param {*} options
   * @constructor
   */
  function RightArrowNode( equationProperty, options ) {

    options = _.extend( {
      tailWidth: TAIL_WIDTH,
      headWidth: HEAD_WIDTH,
      headHeight: HEAD_HEIGHT,
      scale: SCALE
    }, options );

    this.equationProperty = equationProperty; // @private
    this._highlightEnabled = true; // @private

    ArrowNode.call( this, TAIL_LOCATION.x, TAIL_LOCATION.y, TIP_LOCATION.x, TIP_LOCATION.y, options );

    // Wire observer to current equation.
    var self = this;
    equationProperty.link( function( newEquation, oldEquation ) {
      if ( oldEquation ) { oldEquation.balancedProperty.unlink( self.updateHighlight.bind( self ) ); }
      newEquation.balancedProperty.link( self.updateHighlight.bind( self ) );
    } );
  }

  return inherit( ArrowNode, RightArrowNode, {

    // @private Highlights the arrow if the equation is balanced.
    updateHighlight: function() {
      this.fill = ( this.equationProperty.get().balanced && this._highlightEnabled ) ? BCEConstants.BALANCED_HIGHLIGHT_COLOR : BCEConstants.UNBALANCED_COLOR;
    },

    set highlightEnabled( value ) {
      this._highlightEnabled = value;
      this.updateHighlight();
    },

    get highlightEnabled() { return this._highlightEnabled; }
  } );
} );
