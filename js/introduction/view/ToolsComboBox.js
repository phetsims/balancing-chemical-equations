// Copyright 2014-2019, University of Colorado Boulder

/**
 * 'Tools' combo box, for selecting the visual representation for "balanced".
 *
 * @author Vasily Shakhov (MLearner)
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  const BalancedRepresentation = require( 'BALANCING_CHEMICAL_EQUATIONS/common/model/BalancedRepresentation' );
  const balancingChemicalEquations = require( 'BALANCING_CHEMICAL_EQUATIONS/balancingChemicalEquations' );
  const ComboBox = require( 'SUN/ComboBox' );
  const ComboBoxItem = require( 'SUN/ComboBoxItem' );
  const Image = require( 'SCENERY/nodes/Image' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Text = require( 'SCENERY/nodes/Text' );

  // images
  const chartsImage = require( 'image!BALANCING_CHEMICAL_EQUATIONS/charts.png' );
  const scalesImage = require( 'mipmap!BALANCING_CHEMICAL_EQUATIONS/scales.png' );

  // strings
  const noneString = require( 'string!BALANCING_CHEMICAL_EQUATIONS/none' );
  const toolsString = require( 'string!BALANCING_CHEMICAL_EQUATIONS/tools' );

  // constants
  const FONT = new PhetFont( 22 );

  class ToolsComboBox extends ComboBox {

    /**
     * @param {Property.<BalancedRepresentation>} balanceRepresentationProperty
     * @param {Node} parentNode node that will be used as the list's parent, use this to ensuring that the list is in front of everything else
     * @param {Object} [options]
     * @constructor
     */
    constructor( balanceRepresentationProperty, parentNode, options ) {

      options = _.extend( {
        xMargin: 10,
        yMargin: 5,
        cornerRadius: 4,
        maxWidth: 600
      }, options );

      // options that cannot be specified by client
      options.labelNode = new Text( toolsString, {
        font: FONT,
        fontWeight: 'bold',
        maxWidth: 100
      } );

      const items = [
        // 'None'
        new ComboBoxItem( new Text( noneString, { font: FONT, maxWidth: 100 } ), BalancedRepresentation.NONE ),
        // scales
        new ComboBoxItem( new Image( scalesImage, { scale: 0.1875 } ), BalancedRepresentation.BALANCE_SCALES ),
        // bar charts
        new ComboBoxItem( new Image( chartsImage, { scale: 0.375 } ), BalancedRepresentation.BAR_CHARTS )
      ];

      super( items, balanceRepresentationProperty, parentNode, options );
    }
  }

  return balancingChemicalEquations.register( 'ToolsComboBox', ToolsComboBox );
} );
