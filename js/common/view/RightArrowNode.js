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
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  var BCEConstants = require( 'BALANCING_CHEMICAL_EQUATIONS/common/BCEConstants' );

  // constants
  var ARROW_LENGTH = 70;

  /**
   * @param {Property<Equation>} equationProperty
   * @param {Object} options
   * @constructor
   */
  function RightArrowNode( equationProperty, options ) {

    options = _.extend( {
      tailWidth: 15,
      headWidth: 35,
      headHeight: 30
    }, options );

    this.equationProperty = equationProperty; // @private
    this._highlightEnabled = true; // @private

    ArrowNode.call( this, 0, 0, ARROW_LENGTH, 0, options );

    // Wire observer to current equation.
    var self = this;
    var balancedObserver = self.updateHighlight.bind( self );
    equationProperty.link( function( newEquation, oldEquation ) {
      if ( oldEquation ) { oldEquation.balancedProperty.unlink( balancedObserver ); }
      newEquation.balancedProperty.link( balancedObserver );
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
