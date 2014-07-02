// Copyright 2002-2014, University of Colorado Boulder

/**
 * Indicator that an equation is not balanced, by any definition of balanced.
 * This looks like a dialog, and contains:
 * frowny face
 * big "X" for "not balanced"
 * "Hide Why" button
 * alternate representation (bar chart or balance scale) of "balanced"
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
  var BalancedRepresentation = require( 'BALANCING_CHEMICAL_EQUATIONS/common/model/BalancedRepresentation' );
  var BarChartsNode = require( 'BALANCING_CHEMICAL_EQUATIONS/common/view/BarChartsNode' );
  var BalanceScalesNode = require( 'BALANCING_CHEMICAL_EQUATIONS/common/view/BalanceScalesNode' );
  var TextPushButton = require( 'SUN/buttons/TextPushButton' );
  var Text = require( 'SCENERY/nodes/Text' );
  var BCEConstants = require( 'BALANCING_CHEMICAL_EQUATIONS/common/BCEConstants' );

  // strings
  var notBalancedString = require( 'string!BALANCING_CHEMICAL_EQUATIONS/notBalanced' );
  var hideWhyString = require( 'string!BALANCING_CHEMICAL_EQUATIONS/hideWhy' );

  /**
   * @param {Equation} equationProperty the equation
   * @param whyButtonListener notified when the "Hide Why" button is pressed
   * @param balancedRepresentation which representation of "balanced" should we show?
   * @param {HorizontalAligner} aligner specifies horizontal layout, for aligning with other user-interface components
   * @constructor
   */
  var NotBalancedVerboseNode = function( equationProperty, whyButtonListener, balancedRepresentation, aligner ) {
    GamePopupNode.call( this, false, function( phetFont ) {

      // icon and text
      var hBox = new HBox( {
        children: [
          BCEConstants.INCORRECT_ICON,
          new Text( notBalancedString, {font: phetFont} )
        ],
        spacing: 0
      } );

      // representation of "balanced"
      var balanceRepresentationNode;
      if ( balancedRepresentation === BalancedRepresentation.BALANCE_SCALES ) {
        balanceRepresentationNode = new BalanceScalesNode( equationProperty, aligner );
      }
      else if ( balancedRepresentation === BalancedRepresentation.BAR_CHARTS ) {
        balanceRepresentationNode = new BarChartsNode( equationProperty, aligner );
      }
      balanceRepresentationNode.setScaleMagnitude( 0.65 ); // issue #29, shrink size so that it doesn't cover so much of the screen

      return new VBox( {
        children: [
          hBox,
          new TextPushButton( hideWhyString, { // "Hide Why" button
            listener: whyButtonListener,
            baseColor: '#d9d9d9'
          } ),
          balanceRepresentationNode
        ],
        spacing: 5
      } );
    } );
  };

  return inherit( GamePopupNode, NotBalancedVerboseNode );
} );