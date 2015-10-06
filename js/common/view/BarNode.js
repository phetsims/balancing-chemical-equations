// Copyright 2002-2014, University of Colorado Boulder

/**
 * A bar that displays some number of atoms for a specified atom.
 * The bar is capable of displaying some maximum number of atoms.
 * If the number of atoms exceeds that maximum, then an upward-pointing
 * arrow appears at the top of the bar.
 * <p>
 * Origin is at the bottom center of the bar.
 *
 * @author Vasily Shakhov(mlearner.com)
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );
  var AtomNode = require( 'NITROGLYCERIN/nodes/AtomNode' );
  var BCEConstants = require( 'BALANCING_CHEMICAL_EQUATIONS/common/BCEConstants' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );
  var HStrut = require( 'SCENERY/nodes/HStrut' );

  // constants
  var MAX_NUMBER_OF_ATOMS = 12; // bar changes to an arrow above this number
  var MAX_BAR_SIZE = new Dimension2( 40, 60 );
  var BAR_LINE_WIDTH = 1.5;
  var ARROW_SIZE = new Dimension2( 1.5 * MAX_BAR_SIZE.width, 15 );

  /**
   * @param {NITROGLYCERIN.Element} element the atom that we're displaying on the bar
   * @param {Property.<number>} numberOfAtomsProperty number of elements
   * @param {Object} [options]
   * @constructor
   */
  function BarNode( element, numberOfAtomsProperty, options ) {

    var thisNode = this;

    // number of atoms
    var numberNode = new Text( '?', { font: new PhetFont( 18 ) } );

    // bar
    var barNode = new Path( Shape.rect( 0, 0, 1, 1 ), { fill: element.color, stroke: 'black', lineWidth: BAR_LINE_WIDTH } );

    // atom symbol
    var symbolNode = new Text( element.symbol, { font: new PhetFont( 24 ) } );

    // atom icon
    var iconNode = new AtomNode( element, BCEConstants.ATOM_OPTIONS );
    iconNode.scale( BCEConstants.MOLECULE_SCALE_FACTOR );

    // horizontal strut, to prevent resizing
    var hStrut = new HStrut( MAX_BAR_SIZE.width + BAR_LINE_WIDTH );

    options.children = [ hStrut, numberNode, barNode, new HBox( { children: [ iconNode, symbolNode ], spacing: 3 } ) ];
    VBox.call( this, options );

    var numberOfAtomsListener = function( numberOfAtoms ) {

      // number of atoms
      numberNode.text = numberOfAtoms + '';

      // bar
      var barShape;
      if ( numberOfAtoms <= MAX_NUMBER_OF_ATOMS ) {
        // rectangular bar
        var height = MAX_BAR_SIZE.height * ( numberOfAtoms / MAX_NUMBER_OF_ATOMS );
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

      thisNode.bottom = 0;
    };

    // when the number of atoms changes ...
    numberOfAtomsProperty.link( numberOfAtomsListener );

    // @private
    this.disposeBarNode = function() {
      numberOfAtomsProperty.unlink( numberOfAtomsListener );
    };
  }

  return inherit( VBox, BarNode, {

    dispose: function() {
      this.disposeBarNode();
    }
  } );

} );