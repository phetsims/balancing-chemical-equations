// Copyright 2002-2014, University of Colorado Boulder

/**
 * Horizontal bar for selecting an equation.
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
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  // constants
  var BAR_HEIGHT = 50; //height of control node
  var TEXT_OPTIONS = { font: new PhetFont( 16 ), fill: 'white' };
  var RADIO_BUTTON_OPTIONS = { radius: 8 };
  
  /**
   * @param {IntroductionModel} model of simulation
   * @param {Object} options
   * @constructor
   */
  function EquationChoiceNode( model, options ) {

    Node.call( this, options );

    // background, extra wide so that it will appear to fill the entire screen for all but extreme window sizes
    this.addChild( new Rectangle( 0, 0, 4 * model.width, BAR_HEIGHT, { fill: '#3376c4', centerX: model.width / 2 } ) );

    // radio buttons, one for each equation, arranged horizontally
    var radioButtons = [];
    model.equations.forEach( function( equation ) {
       radioButtons.push( new AquaRadioButton( model.currentEquationProperty, equation, new Text( equation.name, TEXT_OPTIONS ), RADIO_BUTTON_OPTIONS ) );
    } );
    this.addChild( new HBox( {
      children: radioButtons,
      spacing: 20,
      align: 'left',
      left: 50,
      centerY: BAR_HEIGHT / 2
    } ) );
  }

  return inherit( Node, EquationChoiceNode );
} );
