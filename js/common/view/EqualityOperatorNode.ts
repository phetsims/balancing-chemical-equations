// Copyright 2014-2023, University of Colorado Boulder

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

    const options = optionize<EqualityOperatorNodeOptions, SelfOptions, NodeOptions>()( {}, providedOptions );

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
    const balancedObserver = ( balanced: boolean ) => {
      equalsSignNode.visible = balanced;
      notEqualsSignNode.visible = !balanced;
    };
    equationProperty.link( ( newEquation, oldEquation ) => {
      if ( oldEquation ) {
        oldEquation.balancedProperty.unlink( balancedObserver );
      }
      newEquation.balancedProperty.link( balancedObserver );
    } );
  }

  // No dispose needed, instances of this type persist for lifetime of the sim.
}

balancingChemicalEquations.register( 'EqualityOperatorNode', EqualityOperatorNode );