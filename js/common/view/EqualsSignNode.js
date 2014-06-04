// Copyright 2002-2014, University of Colorado Boulder

/**
 *
 * Equals sign, for BarCharts.
 *
 * Author: Vasily Shakhov (mlearner.com)
 */

define( function( require ) {
  'use strict';

  //modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Node = require( 'SCENERY/nodes/Node' );
  var BCEConstants = require( 'BALANCING_CHEMICAL_EQUATIONS/common/BCEConstants' );

  var EqualsSignNode = function( highlighted, barWidth, barHeight, barYSpacing, options ) {
    options = _.extend( {
      stroke: 'black',
      lineWidth: 1.5
    }, options );
    Node.call( this );

    this.topBarNode = new Rectangle( 0, 0, barWidth, barHeight, options );
    this.addChild(this.topBarNode);

    this.bottomBarNode = new Rectangle( 0, 0, barWidth, barHeight, options );
    this.addChild(this.bottomBarNode);
    this.bottomBarNode.y = barHeight + barYSpacing;

    this.setHighlighted( highlighted );
  };

  return inherit( Node, EqualsSignNode, {
    setHighlighted: function( highlighted ) {
      this.topBarNode.fill = ( highlighted ? BCEConstants.BALANCED_HIGHLIGHT_COLOR : BCEConstants.UNBALANCED_COLOR );
      this.bottomBarNode.fill = ( highlighted ? BCEConstants.BALANCED_HIGHLIGHT_COLOR : BCEConstants.UNBALANCED_COLOR );
    }
  } );

} )
;