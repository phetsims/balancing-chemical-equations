// Copyright 2014-2025, University of Colorado Boulder

/**
 * RightArrowNode is an arrow that points from left to right, from reactants to products.
 * It highlights when the equation is balanced.
 *
 * @author Vasily Shakhov (mlearner.com)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import ArrowNode, { ArrowNodeOptions } from '../../../../scenery-phet/js/ArrowNode.js';
import { NodeTranslationOptions } from '../../../../scenery/js/nodes/Node.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import BCEColors from '../BCEColors.js';
import Equation from '../model/Equation.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';

const ARROW_LENGTH = 70;

type SelfOptions = EmptySelfOptions;

type RightArrowNodeOptions = SelfOptions & NodeTranslationOptions & PickRequired<ArrowNode, 'tandem'>;

export default class RightArrowNode extends ArrowNode {

  private readonly equationProperty: TReadOnlyProperty<Equation>;
  private _highlightEnabled: boolean;
  private readonly disposeRightArrowNode: () => void;

  public constructor( equationProperty: TReadOnlyProperty<Equation>, providedOptions?: RightArrowNodeOptions ) {

    const options = optionize<RightArrowNodeOptions, SelfOptions, ArrowNodeOptions>()( {

      // ArrowNodeOptions
      tailWidth: 15,
      headWidth: 35,
      headHeight: 30,
      lineWidth: 1.5,
      visiblePropertyOptions: {
        phetioFeatured: true
      }
    }, providedOptions );

    super( 0, 0, ARROW_LENGTH, 0, options );

    this.equationProperty = equationProperty;
    this._highlightEnabled = true;

    // Wire listener to current equation.
    const isBalancedListener = this.updateHighlight.bind( this );

    const equationListener = ( newEquation: Equation, oldEquation: Equation | null ) => {
      oldEquation && oldEquation.isBalancedProperty.unlink( isBalancedListener );
      newEquation.isBalancedProperty.link( isBalancedListener );
    };
    equationProperty.link( equationListener );

    this.disposeRightArrowNode = () => {
      equationProperty.unlink( equationListener );
      if ( equationProperty.value.isBalancedProperty.hasListener( isBalancedListener ) ) {
        equationProperty.value.isBalancedProperty.unlink( isBalancedListener );
      }
    };
  }

  public override dispose(): void {
    this.disposeRightArrowNode();
    super.dispose();
  }

  public setHighlightEnabled( enabled: boolean ): void {
    this._highlightEnabled = enabled;
    this.updateHighlight();
  }

  // Highlights the arrow if the equation is balanced.
  private updateHighlight(): void {
    this.fill = ( this.equationProperty.value.isBalancedProperty.value && this._highlightEnabled )
                ? BCEColors.BALANCED_HIGHLIGHT_COLOR : BCEColors.UNBALANCED_COLOR;
  }
}

balancingChemicalEquations.register( 'RightArrowNode', RightArrowNode );