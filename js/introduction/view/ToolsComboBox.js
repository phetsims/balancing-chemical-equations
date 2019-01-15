// Copyright 2014-2017, University of Colorado Boulder

/**
 * 'Tools' combo box, for selecting the visual representation for "balanced".
 *
 * @author Vasily Shakhov (MLearner)
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var BalancedRepresentation = require( 'BALANCING_CHEMICAL_EQUATIONS/common/model/BalancedRepresentation' );
  var balancingChemicalEquations = require( 'BALANCING_CHEMICAL_EQUATIONS/balancingChemicalEquations' );
  var ComboBox = require( 'SUN/ComboBox' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );

  // images
  var chartsImage = require( 'image!BALANCING_CHEMICAL_EQUATIONS/charts.png' );
  var scalesImage = require( 'mipmap!BALANCING_CHEMICAL_EQUATIONS/scales.png' );

  // strings
  var noneString = require( 'string!BALANCING_CHEMICAL_EQUATIONS/none' );
  var toolsString = require( 'string!BALANCING_CHEMICAL_EQUATIONS/tools' );

  // constants
  var FONT = new PhetFont( 22 );

  /**
   * @param {Property.<BalancedRepresentation>} balanceRepresentationProperty
   * @param {Node} parentNode node that will be used as the list's parent, use this to ensuring that the list is in front of everything else
   * @param {Object} [options]
   * @constructor
   */
  function ToolsComboBox( balanceRepresentationProperty, parentNode, options ) {

    options = _.extend( {
      cornerRadius: 0,
      xMargin: 13,
      yMargin: 4,
      arrowHeight: 13,
      maxWidth: 600
    }, options );

    // options that cannot be specified by client
    options.labelNode = new Text( toolsString, {
      font: FONT,
      fontWeight: 'bold',
      maxWidth: 100
    } );

    var items = [
      // 'None'
      ComboBox.createItem( new Text( noneString, { font: FONT, maxWidth: 100 } ), BalancedRepresentation.NONE ),
      // scales
      ComboBox.createItem( new Image( scalesImage, { scale: 0.1875 } ), BalancedRepresentation.BALANCE_SCALES ),
      // bar charts
      ComboBox.createItem( new Image( chartsImage, { scale: 0.375 } ), BalancedRepresentation.BAR_CHARTS )
    ];

    ComboBox.call( this, items, balanceRepresentationProperty, parentNode, options );
  }

  balancingChemicalEquations.register( 'ToolsComboBox', ToolsComboBox );

  return inherit( ComboBox, ToolsComboBox, {

    // Supertype implements dispose, but we don't need to call it, this type persists for the lifetime of the sim.
  } );
} );
