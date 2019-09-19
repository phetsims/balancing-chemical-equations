// Copyright 2014-2015, University of Colorado Boulder

/**
 * Fulcrum on which the scale balances.
 * Labeled with the atom symbol.
 *
 * @author Vasily Shakhov (mlearner.com)
 */
define( require => {
  'use strict';

  // modules
  const balancingChemicalEquations = require( 'BALANCING_CHEMICAL_EQUATIONS/balancingChemicalEquations' );
  const inherit = require( 'PHET_CORE/inherit' );
  const LinearGradient = require( 'SCENERY/util/LinearGradient' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Path = require( 'SCENERY/nodes/Path' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Shape = require( 'KITE/Shape' );
  const Text = require( 'SCENERY/nodes/Text' );

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
    const triangleNode = new Path( new Shape()
        .moveTo( 0, 0 )
        .lineTo( fulcrumSize.width / 2, fulcrumSize.height )
        .lineTo( -fulcrumSize.width / 2, fulcrumSize.height )
        .close(),
      { fill: options.fill, lineWidth: 1, stroke: 'black' }
    );

    // atom symbol, centered in triangle
    const symbolNode = new Text( element.symbol,
      { font: options.font, centerX: triangleNode.centerX, centerY: triangleNode.centerY + 8 }
    );

    options.children = [ triangleNode, symbolNode ];
    Node.call( this, options );
  }

  balancingChemicalEquations.register( 'FulcrumNode', FulcrumNode );

  return inherit( Node, FulcrumNode );
} );