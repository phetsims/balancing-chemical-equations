// Copyright 2014, University of Colorado Boulder

/**
 * Fulcrum on which the scale balances.
 * Labeled with the atom symbol.
 *
 * @author Vasily Shakhov (mlearner.com)
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
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );

  /**
   * @param {NITROGLYCERIN.Element} element to show
   * @param {DOT.Dimension2} fulcrumSize width and height
   * @param {Object} [options]
   * @constructor
   */
  function FulcrumNode( element, fulcrumSize, options ) {

    options = _.extend( {
      fill: new LinearGradient( 0, 0, 0, fulcrumSize.height ).addColorStop( 0, 'white' ).addColorStop( 1, 'rgb(192, 192, 192)' ),
      font: new PhetFont( 22 )
    }, options );

    // triangle, start at tip and move clockwise
    var triangleNode = new Path( new Shape()
        .moveTo( 0, 0 )
        .lineTo( fulcrumSize.width / 2, fulcrumSize.height )
        .lineTo( -fulcrumSize.width / 2, fulcrumSize.height )
        .close(),
      { fill: options.fill, lineWidth: 1, stroke: 'black' }
    );

    // atom symbol, centered in triangle
    var symbolNode = new Text( element.symbol,
      { font: options.font, centerX: triangleNode.centerX, centerY: triangleNode.centerY + 8 }
    );

    options.children = [ triangleNode, symbolNode ];
    Node.call( this, options );
  }

  return inherit( Node, FulcrumNode );
} );