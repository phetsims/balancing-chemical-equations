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
   * @param {number} screenWidth
   * @param {Property.<Equation>} equationProperty
   * @param {{ equation: {Equation}, label: {string} }[]} choices
   * @param {Object} [options]
   * @constructor
   */
  function EquationChoiceNode( screenWidth, equationProperty, choices, options ) {

    Node.call( this );

    // background, extra wide so that it will appear to fill the entire screen for all but extreme window sizes
    this.addChild( new Rectangle( 0, 0, 4 * screenWidth, BAR_HEIGHT, { fill: '#3376c4', centerX: screenWidth / 2 } ) );

    // radio buttons, one for each equation, arranged horizontally
    var radioButtons = [];
    choices.forEach( function( choice ) {
      var radioButton = new AquaRadioButton( equationProperty, choice.equation, new Text( choice.label, TEXT_OPTIONS ), RADIO_BUTTON_OPTIONS );
      radioButton.touchArea = radioButton.localBounds.dilatedXY( 10, 15 );  // determined by visual inspection
      radioButtons.push( radioButton );
    } );
    this.addChild( new HBox( {
      children: radioButtons,
      spacing: 30,
      left: 50,
      centerY: BAR_HEIGHT / 2
    } ) );

    this.mutate( options );
  }

  return inherit( Node, EquationChoiceNode );
} );
