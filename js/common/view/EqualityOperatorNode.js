// Copyright 2002-2014, University of Colorado Boulder

/**
 * Equality operator between 2 sides of equation: equals (balanced) or not equals (not balanced).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var BCEConstants = require( 'BALANCING_CHEMICAL_EQUATIONS/common/BCEConstants' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );

  /**
   * @param {Property.<Equation>} equationProperty
   * @param {Object} [options]
   * @constructor
   */
  function EqualityOperatorNode( equationProperty, options ) {

    options = _.extend( {}, options );

    var textOptions = {
      font: new PhetFont( 80 ),
      stroke: 'black'
    };

    // nodes
    var equalsSignNode = new Text( '\u003D',
      _.extend( { fill: BCEConstants.BALANCED_HIGHLIGHT_COLOR }, textOptions ) );
    var notEqualsSignNode = new Text( '\u2260',
      _.extend( { fill: BCEConstants.UNBALANCED_COLOR, center: equalsSignNode.center }, textOptions ) );

    options.children = [ equalsSignNode, notEqualsSignNode ];
    Node.call( this, options );

    // show the correct operator, based on whether the equation is balanced
    var balancedObserver = function( balanced ) {
      equalsSignNode.visible = balanced;
      notEqualsSignNode.visible = !balanced;
    };
    equationProperty.link( function( newEquation, oldEquation ) {
      if ( oldEquation ) { oldEquation.balancedProperty.unlink( balancedObserver ); }
      newEquation.balancedProperty.link( balancedObserver );
    } );
  }

  return inherit( Node, EqualityOperatorNode );
} );
