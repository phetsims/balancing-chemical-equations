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

  /**
   * @param {IntroductionModel} model of simulation
   * @param {Object} options
   * @constructor
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

    //background, extra wide so that it will appear to fill the entire screen for all but extreme window sizes
    this.addChild( new Rectangle( 0, 0, 4 * model.width, RECT_HEIGHT, {fill: '#3376c4', centerX: model.width / 2 } ) );

    //reset
    this.addChild( new ResetAllButton( {
      listener: model.reset.bind( model ),
      right: model.width - 20,
      centerY: RECT_HEIGHT / 2,
      scale: 0.8
    } ) );

    //choices
    this.addChild( new HBox( {
      children: [
        new AquaRadioButton( model.currentEquationProperty, model.equations[0], new Text( model.equations[0].name, textOptions ), {radius: 8} ),
        new AquaRadioButton( model.currentEquationProperty, model.equations[1], new Text( model.equations[1].name, textOptions ), {radius: 8} ),
        new AquaRadioButton( model.currentEquationProperty, model.equations[2], new Text( model.equations[2].name, textOptions ), {radius: 8} )
      ],
      spacing: 20,
      align: 'left',
      centerY: RECT_HEIGHT / 2,
      x: 80
    } ) );
  }

  return inherit( Node, EquationChoiceAndResetNode );
} );
