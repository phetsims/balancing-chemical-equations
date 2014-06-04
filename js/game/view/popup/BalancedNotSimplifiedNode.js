// Copyright 2002-2014, University of Colorado Boulder

/**
 * Indicator that an equation is balanced, but not simplified (not lowest coefficients).
 * This looks like a dialog, and contains:
 * frowny face
 * check mark for "balanced"
 * big "X" for "not simplified"
 *
 * Author: Vasily Shakhov (mlearner.com)
 */

define( function( require ) {
  'use strict';

  //modules
  var inherit = require( 'PHET_CORE/inherit' );
  var GamePopupNode = require( 'BALANCING_CHEMICAL_EQUATIONS/game/view/popup/GamePopupNode' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Image = require( 'SCENERY/nodes/Image' );

  // strings
  var balancedString = require( 'string!BALANCING_CHEMICAL_EQUATIONS/balanced' );
  var notSimplifiedString = require( 'string!BALANCING_CHEMICAL_EQUATIONS/notSimplified' );

  // images
  var correctImage = require( 'image!BALANCING_CHEMICAL_EQUATIONS/Check-Mark-u2713.png' );
  var incorrectImage = require( 'image!BALANCING_CHEMICAL_EQUATIONS/Heavy-Ballot-X-u2718.png' );

  var BalancedNotSimplifiedNode = function() {
    GamePopupNode.call( this, true, function( phetFont ) {

      // balanced icon and text
      var balancedHBox = new HBox( {
        children: [
          new Image( correctImage ),
          new Text( balancedString, {font: phetFont} )
        ],
        spacing: 0
      } );

      // not simplified icon and text
      var notSimplifiedHBox = new HBox( {
        children: [
          new Image( incorrectImage ),
          new Text( notSimplifiedString, {font: phetFont} )
        ],
        spacing: 0
      } );

      return new VBox( {
        children: [
          balancedHBox,
          notSimplifiedHBox
        ],
        spacing: 15
      } );
    } );
  };

  return inherit( GamePopupNode, BalancedNotSimplifiedNode );

} );