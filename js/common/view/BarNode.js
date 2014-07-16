// Copyright 2002-2014, University of Colorado

/**
 * A bar that displays some number of atoms for a specified atom.
 * The bar is capable of displaying some maximum number of atoms.
 * If the number of atoms exceeds that maximum, then an upward-pointing
 * arrow appears at the top of the bar.
 * <p>
 * Origin is at the bottom center of the bar.
 *
 * @author Vasily Shakhov(mlearner.com)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );
  var AtomNode = require( 'NITROGLYCERIN/nodes/AtomNode' );
  var BCEConstants = require( 'BALANCING_CHEMICAL_EQUATIONS/common/BCEConstants' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );

  // constants
  var MAX_NUMBER_OF_ATOMS = 12; // bar changes to an arrow above this number
  var MAX_BAR_SIZE = new Dimension2( 40, 60 );
  var ARROW_SIZE = new Dimension2( 1.5 * MAX_BAR_SIZE.width, 15 );

  /**
   * @param {NITROGLYCERIN.Element} element the atom that we're displaying on the bar
   * @param {Number} numberOfAtoms number of elements
   * @param {Object} options
   * @constructor
   */
  function BarNode( element, numberOfAtoms, options ) {

    // number
    var numberNode = new Text( String( numberOfAtoms ), {font: new PhetFont( 18 )} );

    // bar
    var barNode;
    var barOptions = {
      fill: element.color,
      stroke: 'black',
      lineWidth: 1.5
    };
    if ( numberOfAtoms <= MAX_NUMBER_OF_ATOMS ) {
      // standard bar
      var height = MAX_BAR_SIZE.height * ( numberOfAtoms / MAX_NUMBER_OF_ATOMS );
      barNode = new Rectangle( 0, 0, MAX_BAR_SIZE.width, height, barOptions );
    }
    else {
      // bar with upward-pointing arrow, path is specified clockwise from arrow tip.
      var barShape = new Shape()
        .moveTo( 0, -MAX_BAR_SIZE.height )
        .lineTo( ARROW_SIZE.width / 2, -( MAX_BAR_SIZE.height - ARROW_SIZE.height ) )
        .lineTo( MAX_BAR_SIZE.width / 2, -( MAX_BAR_SIZE.height - ARROW_SIZE.height ) )
        .lineTo( MAX_BAR_SIZE.width / 2, 0 )
        .lineTo( -MAX_BAR_SIZE.width / 2, 0 )
        .lineTo( -MAX_BAR_SIZE.width / 2, -( MAX_BAR_SIZE.height - ARROW_SIZE.height ) )
        .lineTo( -ARROW_SIZE.width / 2, -( MAX_BAR_SIZE.height - ARROW_SIZE.height ) )
        .close();
      barNode = new Path( barShape, barOptions );
    }

    // atom symbol
    var symbolNode = new Text( element.symbol, {font: new PhetFont( 24 )} );

    // atom icon
    var iconNode = new AtomNode( element, BCEConstants.ATOM_OPTIONS );
    iconNode.scale( BCEConstants.MOLECULE_SCALE_FACTOR );

    options.children = [ numberNode, barNode, new HBox( {children: [iconNode, symbolNode], spacing: 3} ) ];
    options.bottom = 0;
    VBox.call( this, options );
  }

  return inherit( VBox, BarNode );
} );