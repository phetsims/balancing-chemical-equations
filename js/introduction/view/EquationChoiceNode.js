// Copyright 2014-2019, University of Colorado Boulder

/**
 * Horizontal bar for selecting an equation.
 *
 * @author Vasily Shakhov (MLearner)
 */
define( require => {
  'use strict';

  // modules
  const AquaRadioButton = require( 'SUN/AquaRadioButton' );
  const balancingChemicalEquations = require( 'BALANCING_CHEMICAL_EQUATIONS/balancingChemicalEquations' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Node = require( 'SCENERY/nodes/Node' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const Text = require( 'SCENERY/nodes/Text' );

  // constants
  const BAR_HEIGHT = 50; //height of control node
  const TEXT_OPTIONS = { font: new PhetFont( 16 ), fill: 'white' };
  const RADIO_BUTTON_OPTIONS = { radius: 8 };

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
    const radioButtons = [];
    choices.forEach( function( choice ) {
      const radioButton = new AquaRadioButton( equationProperty, choice.equation, new Text( choice.label, TEXT_OPTIONS ), RADIO_BUTTON_OPTIONS );
      radioButton.touchArea = radioButton.localBounds.dilatedXY( 10, 15 );  // determined by visual inspection
      radioButtons.push( radioButton );
    } );
    this.addChild( new HBox( {
      children: radioButtons,
      spacing: 30,
      left: 50,
      centerY: BAR_HEIGHT / 2,
      maxWidth: 0.8 * screenWidth
    } ) );

    this.disposeEquationChoiceNode = function() {
      radioButtons.forEach( function( radioButton ) {
        radioButton.dispose();
      } );
    };

    this.mutate( options );
  }

  balancingChemicalEquations.register( 'EquationChoiceNode', EquationChoiceNode );

  return inherit( Node, EquationChoiceNode, {

    // No dispose needed, instances of this type persist for lifetime of the sim.
  } );
} );
