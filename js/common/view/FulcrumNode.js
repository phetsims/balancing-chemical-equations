// Copyright 2002-2014, University of Colorado Boulder

/**
 *  * Fulcrum on which the scale balances.
 * Labeled with the atom symbol.
 * Origin is at the tip of the fulcrum.
 * Author: Vasily Shakhov (mlearner.com)
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );
  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );

  /**
   * @param {NITROGLYCERIN.Element} element to show
   * @param {DOT.Dimension2} fulcrumSize width and height
   * @param {String} fulcrumFill color of filling
   * @constructor
   */

  var FulcrumNode = function( element, fulcrumSize, fulcrumFill ) {
    Node.call( this );

    var triangle = new Path( new Shape().
      moveTo( 0, 0 ).
      lineTo( fulcrumSize.width / 2, fulcrumSize.height ).
      lineTo( -fulcrumSize.width / 2, fulcrumSize.height ).
      close(),
      {
        fill: fulcrumFill,
        lineWidth: 1,
        stroke: 'black'
      }
    );
    this.addChild( triangle );

    var text = new Text( element.symbol, {
      font: new PhetFont( 22 ),
      centerX: 0,
      centerY: this.centerY + 8
    } );
    this.addChild( text );
  };
  return inherit( Node, FulcrumNode );

} );