// Copyright 2014-2025, University of Colorado Boulder

/**
 * BarNode is a bar that displays some number of atoms for a specified atom. The bar is capable of displaying some
 * maximum number of atoms. If the number of atoms exceeds that maximum, then an upward-pointing arrow appears at
 * the top of the bar.
 *
 * The origin is at the bottom center of the bar.
 *
 * @author Vasily Shakhov(mlearner.com)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Shape from '../../../../kite/js/Shape.js';
import Element from '../../../../nitroglycerin/js/Element.js';
import AtomNode from '../../../../nitroglycerin/js/nodes/AtomNode.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import HStrut from '../../../../scenery/js/nodes/HStrut.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import BCEConstants from '../BCEConstants.js';

const MAX_NUMBER_OF_ATOMS = 12; // bar changes to an arrow above this number
const MAX_BAR_SIZE = new Dimension2( 40, 60 );
const BAR_LINE_WIDTH = 1.5;
const ARROW_SIZE = new Dimension2( 1.5 * MAX_BAR_SIZE.width, 15 );
const NUMBER_FONT = new PhetFont( 18 );
const SYMBOL_FONT = new PhetFont( 24 );

export default class BarNode extends VBox {

  public static readonly MAX_BAR_SIZE = MAX_BAR_SIZE;

  private readonly disposeBarNode: () => void;

  /**
   * @param element the atom that we're displaying on the bar
   * @param numberOfAtomsProperty number of elements
   */
  public constructor( element: Element, numberOfAtomsProperty: TReadOnlyProperty<number> ) {

    // number of atoms
    const numberNode = new Text( '?', { font: NUMBER_FONT } );

    // bar
    const barNode = new Path( Shape.rect( 0, 0, 1, 1 ), {
      fill: element.color,
      stroke: 'black',
      lineWidth: BAR_LINE_WIDTH
    } );

    // atom symbol
    const symbolNode = new Text( element.symbol, { font: SYMBOL_FONT } );

    // atom icon
    const iconNode = new AtomNode( element, BCEConstants.ATOM_NODE_OPTIONS );
    iconNode.scale( BCEConstants.PARTICLES_SCALE_FACTOR );

    // horizontal strut, to prevent resizing
    const hStrut = new HStrut( MAX_BAR_SIZE.width + BAR_LINE_WIDTH );

    super( {
      excludeInvisibleChildrenFromBounds: false,
      children: [ hStrut, numberNode, barNode,
        new HBox( {
          children: [ iconNode, symbolNode ],
          spacing: 3
        } )
      ]
    } );

    const numberOfAtomsListener = ( numberOfAtoms: number ) => {

      // number of atoms
      numberNode.string = `${numberOfAtoms}`;

      // bar
      let barShape;
      if ( numberOfAtoms <= MAX_NUMBER_OF_ATOMS ) {
        // rectangular bar
        const height = MAX_BAR_SIZE.height * ( numberOfAtoms / MAX_NUMBER_OF_ATOMS );
        barShape = Shape.rect( 0, -height, MAX_BAR_SIZE.width, height );
      }
      else {
        // bar with upward-pointing arrow, path is specified clockwise from arrow tip.
        barShape = new Shape()
          .moveTo( 0, -MAX_BAR_SIZE.height )
          .lineTo( ARROW_SIZE.width / 2, -( MAX_BAR_SIZE.height - ARROW_SIZE.height ) )
          .lineTo( MAX_BAR_SIZE.width / 2, -( MAX_BAR_SIZE.height - ARROW_SIZE.height ) )
          .lineTo( MAX_BAR_SIZE.width / 2, 0 )
          .lineTo( -MAX_BAR_SIZE.width / 2, 0 )
          .lineTo( -MAX_BAR_SIZE.width / 2, -( MAX_BAR_SIZE.height - ARROW_SIZE.height ) )
          .lineTo( -ARROW_SIZE.width / 2, -( MAX_BAR_SIZE.height - ARROW_SIZE.height ) )
          .close();
      }
      barNode.setShape( barShape );
      barNode.visible = ( numberOfAtoms > 0 );
    };

    // when the number of atoms changes ...
    numberOfAtomsProperty.link( numberOfAtomsListener );

    this.disposeBarNode = () => {
      numberOfAtomsProperty.unlink( numberOfAtomsListener );
    };
  }

  public override dispose(): void {
    this.disposeBarNode();
    super.dispose();
  }
}

balancingChemicalEquations.register( 'BarNode', BarNode );