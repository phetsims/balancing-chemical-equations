// Copyright 2014-2023, University of Colorado Boulder

/**
 * Horizontal bar for selecting an equation.
 *
 * @author Vasily Shakhov (MLearner)
 */

import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Node, Rectangle, Text } from '../../../../scenery/js/imports.js';
import HorizontalAquaRadioButtonGroup from '../../../../sun/js/HorizontalAquaRadioButtonGroup.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';

// constants
const BAR_HEIGHT = 50; //height of control node
const TEXT_OPTIONS = { font: new PhetFont( 16 ), fill: 'white' };

export default class EquationChoiceNode extends Node {

  /**
   * @param {number} screenWidth
   * @param {Property.<Equation>} equationProperty
   * @param {{ equation: {Equation}, label: {string} }[]} choices
   * @param {Object} [options]
   */
  constructor( screenWidth, equationProperty, choices, options ) {

    super();

    // background, extra wide so that it will appear to fill the entire screen for all but extreme window sizes
    this.addChild( new Rectangle( 0, 0, 4 * screenWidth, BAR_HEIGHT, {
      fill: '#3376c4',
      centerX: screenWidth / 2
    } ) );

    // radio button descriptions, one button for each equation
    const radioButtonItems = [];
    choices.forEach( choice => {
      radioButtonItems.push( {
        createNode: tandem => new Text( choice.labelStringProperty, TEXT_OPTIONS ),
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

    this.disposeEquationChoiceNode = () => {
      radioButtonGroup.dispose();
    };

    this.mutate( options );
  }

  // No dispose needed, instances of this type persist for lifetime of the sim.
}

balancingChemicalEquations.register( 'EquationChoiceNode', EquationChoiceNode );