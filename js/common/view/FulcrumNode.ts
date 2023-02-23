// Copyright 2014-2023, University of Colorado Boulder

/**
 * Fulcrum on which the scale balances. This is a triangle that is labeled with the atom symbol.
 *
 * @author Vasily Shakhov (mlearner.com)
 */

import Element from '../../../../nitroglycerin/js/Element.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import { Shape } from '../../../../kite/js/imports.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { LinearGradient, Node, Path, Text } from '../../../../scenery/js/imports.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';

const FONT = new PhetFont( 22 );

export default class FulcrumNode extends Node {

  public constructor( element: Element, fulcrumSize: Dimension2 ) {

    // triangle, start at tip and move clockwise
    const triangleShape = new Shape()
      .moveTo( 0, 0 )
      .lineTo( fulcrumSize.width / 2, fulcrumSize.height )
      .lineTo( -fulcrumSize.width / 2, fulcrumSize.height )
      .close();
    const triangleNode = new Path( triangleShape, {
      fill: new LinearGradient( 0, 0, 0, fulcrumSize.height ).addColorStop( 0, 'white' ).addColorStop( 1, 'rgb(192, 192, 192)' ),
      lineWidth: 1,
      stroke: 'black'
    } );

    // atom symbol, centered in triangle
    const symbolNode = new Text( element.symbol, {
      font: FONT,
      centerX: triangleNode.centerX,
      centerY: triangleNode.centerY + 8
    } );

    super( {
      children: [ triangleNode, symbolNode ]
    } );
  }
}

balancingChemicalEquations.register( 'FulcrumNode', FulcrumNode );