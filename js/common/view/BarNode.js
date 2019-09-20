// Copyright 2014-2019, University of Colorado Boulder

/**
 * A bar that displays some number of atoms for a specified atom.
 * The bar is capable of displaying some maximum number of atoms.
 * If the number of atoms exceeds that maximum, then an upward-pointing
 * arrow appears at the top of the bar.
 *
 * Origin is at the bottom center of the bar.
 *
 * @author Vasily Shakhov(mlearner.com)
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const AtomNode = require( 'NITROGLYCERIN/nodes/AtomNode' );
  const balancingChemicalEquations = require( 'BALANCING_CHEMICAL_EQUATIONS/balancingChemicalEquations' );
  const BCEConstants = require( 'BALANCING_CHEMICAL_EQUATIONS/common/BCEConstants' );
  const Dimension2 = require( 'DOT/Dimension2' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const HStrut = require( 'SCENERY/nodes/HStrut' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Path = require( 'SCENERY/nodes/Path' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Shape = require( 'KITE/Shape' );
  const Text = require( 'SCENERY/nodes/Text' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  // constants
  const MAX_NUMBER_OF_ATOMS = 12; // bar changes to an arrow above this number
  const MAX_BAR_SIZE = new Dimension2( 40, 60 );
  const BAR_LINE_WIDTH = 1.5;
  const ARROW_SIZE = new Dimension2( 1.5 * MAX_BAR_SIZE.width, 15 );

  /**
   * @param {NITROGLYCERIN.Element} element the atom that we're displaying on the bar
   * @param {Property.<number>} numberOfAtomsProperty number of elements
   * @param {Object} [options]
   * @constructor
   */
  function BarNode( element, numberOfAtomsProperty, options ) {

    const self = this;

    // number of atoms
    const numberNode = new Text( '?', { font: new PhetFont( 18 ) } );

    // bar
    const barNode = new Path( Shape.rect( 0, 0, 1, 1 ), { fill: element.color, stroke: 'black', lineWidth: BAR_LINE_WIDTH } );

    // atom symbol
    const symbolNode = new Text( element.symbol, { font: new PhetFont( 24 ) } );

    // atom icon
    const iconNode = new AtomNode( element, BCEConstants.ATOM_OPTIONS );
    iconNode.scale( BCEConstants.MOLECULE_SCALE_FACTOR );

    // horizontal strut, to prevent resizing
    const hStrut = new HStrut( MAX_BAR_SIZE.width + BAR_LINE_WIDTH );

    options.children = [ hStrut, numberNode, barNode, new HBox( { children: [ iconNode, symbolNode ], spacing: 3 } ) ];
    VBox.call( this, options );

    const numberOfAtomsListener = function( numberOfAtoms ) {

      // number of atoms
      numberNode.text = numberOfAtoms + '';

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

      self.bottom = 0;
    };

    // when the number of atoms changes ...
    numberOfAtomsProperty.link( numberOfAtomsListener );

    // @private
    this.disposeBarNode = function() {
      numberOfAtomsProperty.unlink( numberOfAtomsListener );
    };
  }

  balancingChemicalEquations.register( 'BarNode', BarNode );

  return inherit( VBox, BarNode, {

    // @public
    dispose: function() {
      this.disposeBarNode();
      VBox.prototype.dispose.call( this );
    }
  } );

} );