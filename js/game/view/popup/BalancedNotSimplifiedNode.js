// Copyright 2002-2014, University of Colorado Boulder

/**
 * Indicator that an equation is balanced, but not simplified (not lowest coefficients).
 * This looks like a dialog, and contains:
 * frowny face
 * check mark for "balanced"
 * big "X" for "not simplified"
 *
 * @author Vasily Shakhov (mlearner.com)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var GamePopupNode = require( 'BALANCING_CHEMICAL_EQUATIONS/game/view/popup/GamePopupNode' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var Text = require( 'SCENERY/nodes/Text' );
  var BCEConstants = require( 'BALANCING_CHEMICAL_EQUATIONS/common/BCEConstants' );

  // strings
  var balancedString = require( 'string!BALANCING_CHEMICAL_EQUATIONS/balanced' );
  var notSimplifiedString = require( 'string!BALANCING_CHEMICAL_EQUATIONS/notSimplified' );

  /**
   * @param {Property<Vector2>} locationProperty
   * @param {Bounds2} dragBounds
   * @constructor
   */
  function BalancedNotSimplifiedNode( locationProperty, dragBounds ) {
    GamePopupNode.call( this, locationProperty, dragBounds, true, function( phetFont ) {

      // balanced icon and text
      var balancedHBox = new HBox( {
        children: [
          BCEConstants.CORRECT_ICON,
          new Text( balancedString, {font: phetFont} )
        ],
        spacing: 0
      } );

      // not simplified icon and text
      var notSimplifiedHBox = new HBox( {
        children: [
          BCEConstants.INCORRECT_ICON,
          new Text( notSimplifiedString, {font: phetFont} )
        ],
        spacing: 0
      } );

      return new VBox( {
        children: [
          balancedHBox,
          notSimplifiedHBox
        ],
        spacing: 5
      } );
    } );
  }

  return inherit( GamePopupNode, BalancedNotSimplifiedNode );
} );