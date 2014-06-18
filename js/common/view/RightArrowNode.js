// Copyright 2002-2014, University of Colorado

/** A fancy arrow node, points to the right, for use in equations.
 *
 * @author Vasily Shakhov (mlearner.com)
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Vector2 = require( 'DOT/Vector2' );
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  var BCEConstants = require( 'BALANCING_CHEMICAL_EQUATIONS/common/BCEConstants' );

  var TAIL_LOCATION = new Vector2( 0, 0 );
  var TIP_LOCATION = new Vector2( 75, 0 );
  var HEAD_HEIGHT = 30;
  var HEAD_WIDTH = 35;
  var TAIL_WIDTH = 15;

  /**
   * @param {Boolean} highlighted if arrow highlighted
   * @constructor
   */

  function RightArrowNode( highlighted ) {
    ArrowNode.call( this, TAIL_LOCATION.x, TAIL_LOCATION.y, TIP_LOCATION.x, TIP_LOCATION.y, {
      tailWidth: TAIL_WIDTH,
      headWidth: HEAD_WIDTH,
      headHeight: HEAD_HEIGHT
    } );

    this.setHighlighted( highlighted );

  }

  return inherit( ArrowNode, RightArrowNode, {
    setHighlighted: function( highlighted ) {
      this.fill = highlighted ? BCEConstants.BALANCED_HIGHLIGHT_COLOR : BCEConstants.UNBALANCED_COLOR;
    }
  } );
} );
