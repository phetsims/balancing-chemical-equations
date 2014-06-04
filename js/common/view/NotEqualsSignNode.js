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

  var EqualsSignNode = function( barWidth, barHeight, barYSpacing, options ) {
    options = _.extend( {
      stroke: 'black',
      lineWidth: 1,
      fill: BCEConstants.UNBALANCED_COLOR
    }, options );
    Node.call( this );

    this.topBarNode = new Rectangle( 0, 0, barWidth, barHeight, options );
    this.addChild( this.topBarNode );

    this.bottomBarNode = new Rectangle( 0, 0, barWidth, barHeight, options );
    this.bottomBarNode.y = barHeight + barYSpacing;
    this.addChild( this.bottomBarNode );

    this.slashShape = new Rectangle( 0, barHeight + (barYSpacing - barHeight) / 2, barWidth, barHeight, options );
    this.slashShape.rotateAround(this.slashShape.center,-75 * Math.PI / 180);
    this.addChild( this.slashShape );

    //add two rect to clear intersection lines
    this.addChild(  new Rectangle( options.lineWidth, options.lineWidth, barWidth-2*options.lineWidth, barHeight-2*options.lineWidth, _.extend(options,{lineWidth:0}) ) );

    this.addChild(  new Rectangle( options.lineWidth, barHeight + barYSpacing+options.lineWidth, barWidth-2*options.lineWidth, barHeight-2*options.lineWidth, _.extend(options,{lineWidth:0}) ) );

  };

  return inherit( Node, EqualsSignNode );

} )
;