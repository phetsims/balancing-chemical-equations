// Copyright 2002-2014, University of Colorado Boulder

/**
 * 'Tools' combo box, for selecting the visual representation for "balanced".
 *
 * @author Vasily Shakhov (MLearner)
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var ComboBox = require( 'SUN/ComboBox' );
  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var BalancedRepresentation = require( 'BALANCING_CHEMICAL_EQUATIONS/common/model/BalancedRepresentation' );
  var Image = require( 'SCENERY/nodes/Image' );

  // images
  var chartsImage = require( 'image!BALANCING_CHEMICAL_EQUATIONS/charts.png' );
  var scalesImage = require( 'image!BALANCING_CHEMICAL_EQUATIONS/scales.png' );

  // strings
  var toolsString = require( 'string!BALANCING_CHEMICAL_EQUATIONS/tools' );
  var noneString = require( 'string!BALANCING_CHEMICAL_EQUATIONS/none' );

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
      buttonCornerRadius: 0,
      listCornerRadius: 0,
      itemYMargin: 0,
      itemXMargin: 3
    }, options );

    // options that cannot be specified by client
    options.labelNode = new Text( toolsString, { font: FONT, fontWeight: 'bold'} );

    var items = [
      // 'None'
      ComboBox.createItem( new Text( noneString, { font: FONT} ), BalancedRepresentation.NONE ),
      // scales
      ComboBox.createItem( new Image( scalesImage, { scale: 0.375} ), BalancedRepresentation.BALANCE_SCALES ),
      // bar charts
      ComboBox.createItem( new Image( chartsImage, { scale: 0.375} ), BalancedRepresentation.BAR_CHARTS )
    ];

    ComboBox.call( this, items, balanceRepresentationProperty, parentNode, options );
  }

  return inherit( ComboBox, ToolsComboBox );
} );
