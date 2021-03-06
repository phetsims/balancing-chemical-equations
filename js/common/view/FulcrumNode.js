// Copyright 2014-2021, University of Colorado Boulder

/**
 * Fulcrum on which the scale balances.
 * Labeled with the atom symbol.
 *
 * @author Vasily Shakhov (mlearner.com)
 */

import Shape from '../../../../kite/js/Shape.js';
import merge from '../../../../phet-core/js/merge.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import LinearGradient from '../../../../scenery/js/util/LinearGradient.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';

class FulcrumNode extends Node {

  /**
   * @param {NITROGLYCERIN.Element} element to show
   * @param {DOT.Dimension2} fulcrumSize width and height
   * @param {Object} [options]
   */
  constructor( element, fulcrumSize, options ) {

    options = merge( {
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
    super( options );
  }
}

balancingChemicalEquations.register( 'FulcrumNode', FulcrumNode );
export default FulcrumNode;