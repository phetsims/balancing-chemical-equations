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

  //constants
  var MAX_NUMBER_OF_ATOMS = 12;
  var MAX_BAR_SIZE = new Dimension2( 40, 60 );
  var STROKE = 1.5;
  var STROKE_COLOR = 'black';

  /**
   * @param {NITROGLYCERIN.Element} element the atom that we're displaying on the bar
   * @param {Number} numberOfAtoms number of elements
   * @param {Object} options
   * @constructor
   */

  var BarNode = function( element, numberOfAtoms, options ) {
    this.element = element;
    this.numberOfAtoms = numberOfAtoms;

    //number
    var numberNode = new Text( String( this.numberOfAtoms ), {font: new PhetFont( 18 )} );

    var height = MAX_BAR_SIZE.height * ( this.numberOfAtoms / MAX_NUMBER_OF_ATOMS );
    //bar
    var bar = new Rectangle( 0, 0, MAX_BAR_SIZE.width, height, {
      fill: element.color,
      stroke: STROKE_COLOR,
      lineWidth: STROKE
    } );

    //symbol
    var symbolNode = new Text( element.symbol, {font: new PhetFont( 24 )} );

    //image
    var image = new AtomNode( element, BCEConstants.ATOM_OPTIONS );
    image.scale( BCEConstants.MOLECULE_SCALE_FACTOR );

    //symbol and image
    var symbolHBox = new HBox( {children: [image, symbolNode], spacing: 3} );

    options = _.extend( {
      children: [numberNode, bar, symbolHBox]
    }, options );

    VBox.call( this, options );
    this.bottom = 0;
  };

  return inherit( VBox, BarNode );

} );