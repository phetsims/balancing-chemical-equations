// Copyright 2002-2014, University of Colorado Boulder

/**
 * Panel of for selecting the visual representation for "balanced".
 *
 * @author Vasily Shakhov (MLearner)
 */

define( function( require ) {
  'use strict';

  // imports
  var inherit = require( 'PHET_CORE/inherit' );
  var ComboBox = require( 'SUN/ComboBox' );
  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var BalancedRepresentation = require( 'BALANCING_CHEMICAL_EQUATIONS/introduction/model/BalancedRepresentation' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var Image = require( 'SCENERY/nodes/Image' );

  //images
  var chartsImage = require( 'image!BALANCING_CHEMICAL_EQUATIONS/charts.png' );
  var scalesImage = require( 'image!BALANCING_CHEMICAL_EQUATIONS/scales.png' );


  //strings
  var toolsString = require( 'string!BALANCING_CHEMICAL_EQUATIONS/tools' );
  var noneString = require( 'string!BALANCING_CHEMICAL_EQUATIONS/none' );

  /**
   * @param {BalancedRepresentation} balancedProperty
   * @param {Node} parentNode node that will be used as the list's parent, use this to ensuring that the list is in front of everything else
   * @param {Object} options
   */

  function BalancedRepresentationChoiceNode( balancedProperty, parentNode, options ) {
    var self = this;
    var textFont = new PhetFont( 14 );

    //tools text
    var text = new Text( toolsString, {'font': textFont, 'fontWeight': 'bold'} );

    //combobox
    var comboChildren = [];
    //text none
    comboChildren.push( ComboBox.createItem( new Text( noneString, {'font': textFont} ), BalancedRepresentation.NONE ) );

    //scales
    var scales = new Image( scalesImage, {'font': textFont, scale: 0.75} );
    scales.scale( 0.5 );
    comboChildren.push( ComboBox.createItem( scales, BalancedRepresentation.BALANCE_SCALES_ ) );

    //charts
    var charts = new Image( chartsImage, {'font': textFont, scale: 0.75} );
    charts.scale( 0.5 );
    comboChildren.push( ComboBox.createItem( charts, BalancedRepresentation.BAR_CHARTS ) );

    var comboBox = new ComboBox( comboChildren, balancedProperty, parentNode, {
      buttonCornerRadius: 0,
      listCornerRadius: 0
    } );

    options = _.extend( {
      children: [text, comboBox],
      spacing: 5,
    }, options );

    HBox.call( this, options );
  }

  return inherit( HBox, BalancedRepresentationChoiceNode );
} );
