// Copyright 2014-2025, University of Colorado Boulder

/**
 * EqualityOperatorNode is the equality operator between 2 sides of equation: equals (balanced) or not equals (not balanced).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import optionize, { combineOptions, EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Node, { NodeOptions, NodeTranslationOptions } from '../../../../scenery/js/nodes/Node.js';
import Text, { TextOptions } from '../../../../scenery/js/nodes/Text.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import BCEColors from '../BCEColors.js';

const TEXT_OPTIONS = {
  font: new PhetFont( 80 ),
  stroke: 'black'
};

type SelfOptions = EmptySelfOptions;

type EqualityOperatorNodeOptions = SelfOptions & NodeTranslationOptions;

export default class EqualityOperatorNode extends Node {

  public constructor( isEqualProperty: TReadOnlyProperty<boolean>, providedOptions?: EqualityOperatorNodeOptions ) {

    const options = optionize<EqualityOperatorNodeOptions, SelfOptions, NodeOptions>()( {}, providedOptions );

    const equalToNode = new Text( MathSymbols.EQUAL_TO, combineOptions<TextOptions>( {
      fill: BCEColors.BALANCED_HIGHLIGHT_COLOR
    }, TEXT_OPTIONS ) );

    const notEqualToNode = new Text( MathSymbols.NOT_EQUAL_TO, combineOptions<TextOptions>( {
      fill: BCEColors.UNBALANCED_COLOR,
      center: equalToNode.center
    }, TEXT_OPTIONS ) );

    options.children = [ equalToNode, notEqualToNode ];

    super( options );

    isEqualProperty.link( isEqual => {
      equalToNode.visible = isEqual;
      notEqualToNode.visible = !isEqual;
    } );
  }
}

balancingChemicalEquations.register( 'EqualityOperatorNode', EqualityOperatorNode );