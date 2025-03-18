// Copyright 2014-2025, University of Colorado Boulder

/**
 * BalanceFulcrumNode is the fulcrum on which the scale balances. This is a triangle that is labeled with the atom symbol.
 *
 * @author Vasily Shakhov (mlearner.com)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Dimension2 from '../../../../dot/js/Dimension2.js';
import Shape from '../../../../kite/js/Shape.js';
import optionize from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Node, { NodeOptions, NodeTranslationOptions } from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import LinearGradient from '../../../../scenery/js/util/LinearGradient.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';

const FONT = new PhetFont( 22 );

type SelfOptions = {
  size: Dimension2;
  lineWidth?: number;
  symbol?: string;
};

type BalanceFulcrumNodeOptions = SelfOptions & NodeTranslationOptions;

export default class BalanceFulcrumNode extends Node {

  public constructor( providedOptions: BalanceFulcrumNodeOptions ) {

    const options = optionize<BalanceFulcrumNodeOptions, StrictOmit<SelfOptions, 'symbol'>, NodeOptions>()( {
      lineWidth: 1
    }, providedOptions );

    const children = [];

    // triangle, start at tip and move clockwise
    const triangleShape = new Shape()
      .moveTo( 0, 0 )
      .lineTo( options.size.width / 2, options.size.height )
      .lineTo( -options.size.width / 2, options.size.height )
      .close();
    const triangleNode = new Path( triangleShape, {
      fill: new LinearGradient( 0, 0, 0, options.size.height )
        .addColorStop( 0, 'white' )
        .addColorStop( 1, 'rgb( 192, 192, 192 )' ),
      lineWidth: options.lineWidth,
      stroke: 'black'
    } );
    children.push( triangleNode );

    // atom symbol, centered in triangle
    if ( options.symbol ) {
      const symbolNode = new Text( options.symbol, {
        font: FONT,
        centerX: triangleNode.centerX,
        centerY: triangleNode.centerY + 8
      } );
      children.push( symbolNode );
    }

    super( {
      children: children
    } );
  }
}

balancingChemicalEquations.register( 'BalanceFulcrumNode', BalanceFulcrumNode );