// Copyright 2014-2020, University of Colorado Boulder

/**
 * Horizontal bar for selecting an equation.
 *
 * @author Vasily Shakhov (MLearner)
 */
define( require => {
  'use strict';

  // modules
  const balancingChemicalEquations = require( 'BALANCING_CHEMICAL_EQUATIONS/balancingChemicalEquations' );
  const HorizontalAquaRadioButtonGroup = require( 'SUN/HorizontalAquaRadioButtonGroup' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Node = require( 'SCENERY/nodes/Node' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const Text = require( 'SCENERY/nodes/Text' );

  // constants
  const BAR_HEIGHT = 50; //height of control node
  const TEXT_OPTIONS = { font: new PhetFont( 16 ), fill: 'white' };

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

    // radio button descriptions, one button for each equation
    const radioButtonItems = [];
    choices.forEach( function( choice ) {
      radioButtonItems.push( {
        node: new Text( choice.label, TEXT_OPTIONS ),
        value: choice.equation
      } );
    } );

    // radio button group, horizontally layout
    const radioButtonGroup = new HorizontalAquaRadioButtonGroup( equationProperty, radioButtonItems, {
      radioButtonOptions: { radius: 8 },
      touchAreaYDilation: 15,
      spacing: 30,
      left: 50,
      centerY: BAR_HEIGHT / 2,
      maxWidth: 0.8 * screenWidth
    } );
    this.addChild( radioButtonGroup );

    this.disposeEquationChoiceNode = function() {
      radioButtonGroup.dispose();
    };

    this.mutate( options );
  }

  balancingChemicalEquations.register( 'EquationChoiceNode', EquationChoiceNode );

  return inherit( Node, EquationChoiceNode, {

    // No dispose needed, instances of this type persist for lifetime of the sim.
  } );
} );
