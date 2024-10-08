// Copyright 2014-2024, University of Colorado Boulder

/**
 * Equality operator between 2 sides of equation: equals (balanced) or not equals (not balanced).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import optionize, { combineOptions, EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Node, NodeOptions, NodeTranslationOptions, Text, TextOptions } from '../../../../scenery/js/imports.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import Equation from '../model/Equation.js';
import BCEColors from '../BCEColors.js';

type SelfOptions = EmptySelfOptions;

type EqualityOperatorNodeOptions = SelfOptions & NodeTranslationOptions;

export default class EqualityOperatorNode extends Node {

  public constructor( equationProperty: TReadOnlyProperty<Equation>, providedOptions?: EqualityOperatorNodeOptions ) {

    const options = optionize<EqualityOperatorNodeOptions, SelfOptions, NodeOptions>()( {

      // NodeOptions
      isDisposable: false
    }, providedOptions );

    const textOptions = {
      font: new PhetFont( 80 ),
      stroke: 'black'
    };

    const equalsSignNode = new Text( '\u003D', combineOptions<TextOptions>( {
      fill: BCEColors.BALANCED_HIGHLIGHT_COLOR
    }, textOptions ) );

    const notEqualsSignNode = new Text( '\u2260', combineOptions<TextOptions>( {
      fill: BCEColors.UNBALANCED_COLOR, center: equalsSignNode.center
    }, textOptions ) );

    options.children = [ equalsSignNode, notEqualsSignNode ];

    super( options );

    // show the correct operator, based on whether the equation is balanced
    const isBalancedObserver = ( isBalanced: boolean ) => {
      equalsSignNode.visible = isBalanced;
      notEqualsSignNode.visible = !isBalanced;
    };
    equationProperty.link( ( newEquation, oldEquation ) => {
      if ( oldEquation ) {
        oldEquation.isBalancedProperty.unlink( isBalancedObserver );
      }
      newEquation.isBalancedProperty.link( isBalancedObserver );
    } );
  }
}

balancingChemicalEquations.register( 'EqualityOperatorNode', EqualityOperatorNode );