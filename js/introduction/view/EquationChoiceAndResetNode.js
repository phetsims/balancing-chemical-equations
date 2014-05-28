// Copyright 2002-2014, University of Colorado Boulder

/**
 * Panel of for selecting the visual representation for "balanced".
 *
 * @author Vasily Shakhov (MLearner)
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var AquaRadioButton = require( 'SUN/AquaRadioButton' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var Node = require( 'SCENERY/nodes/Node' );
  var ResetAllButton = require( 'SCENERY_PHET/ResetAllButton' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  //strings
  var combustMethane = require( 'string!BALANCING_CHEMICAL_EQUATIONS/combustMethane' );
  var makeAmmonia = require( 'string!BALANCING_CHEMICAL_EQUATIONS/makeAmmonia' );
  var separateWater = require( 'string!BALANCING_CHEMICAL_EQUATIONS/separateWater' );

  /**
   * @param {IntroductionModel} model of simulation
   * @param {Object} options
   */

  function EquationChoiceAndResetNode( model, options ) {
    //height of control node
    var RECT_HEIGHT = 50;
    //options for text
    var textOptions = {
      font: new PhetFont( 16 ),
      fill: 'white'
    };

    Node.call( this, options );

    //background
    this.addChild( new Rectangle( 0, 0, model.width, RECT_HEIGHT, {fill: '#3376c4'} ) );

    //reset
    this.addChild( new ResetAllButton( {
      listener: model.reset.bind( model ),
      right: model.width - 20,
      centerY: RECT_HEIGHT / 2,
      scale: 0.8
    } ) );

    //choices
    //TODO text from Equation toString
    this.addChild( new HBox( {
      children: [
        new AquaRadioButton( model.currentEquationProperty, model.equations[0], new Text( makeAmmonia, textOptions ), {radius: 8} ),
        new AquaRadioButton( model.currentEquationProperty, model.equations[1], new Text( separateWater, textOptions ), {radius: 8} ),
        new AquaRadioButton( model.currentEquationProperty, model.equations[2], new Text( combustMethane, textOptions ), {radius: 8} )
      ],
      spacing: 20,
      align: 'left',
      centerY: RECT_HEIGHT / 2,
      x: 80
    } ) );
  }

  return inherit( Node, EquationChoiceAndResetNode );
} );
