// Copyright 2014-2023, University of Colorado Boulder

/**
 * An arrow that points left to right, from reactants to products.
 * Highlights when the equation is balanced.
 *
 * @author Vasily Shakhov (mlearner.com)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import ArrowNode, { ArrowNodeOptions } from '../../../../scenery-phet/js/ArrowNode.js';
import { NodeTranslationOptions } from '../../../../scenery/js/imports.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import Equation from '../model/Equation.js';
import BCEColors from '../BCEColors.js';

// constants
const ARROW_LENGTH = 70;

type SelfOptions = EmptySelfOptions;

type RightArrowNodeOptions = SelfOptions & NodeTranslationOptions;

export default class RightArrowNode extends ArrowNode {

  private readonly equationProperty: TReadOnlyProperty<Equation>;
  private _highlightEnabled: boolean;

  public constructor( equationProperty: TReadOnlyProperty<Equation>, providedOptions?: RightArrowNodeOptions ) {

    const options = optionize<RightArrowNodeOptions, SelfOptions, ArrowNodeOptions>()( {

      // ArrowNodeOptions
      isDisposable: false,
      tailWidth: 15,
      headWidth: 35,
      headHeight: 30
    }, providedOptions );

    super( 0, 0, ARROW_LENGTH, 0, options );

    this.equationProperty = equationProperty;
    this._highlightEnabled = true;

    // Wire observer to current equation.
    const balancedObserver = this.updateHighlight.bind( this );
    equationProperty.link( ( newEquation, oldEquation ) => {
      if ( oldEquation ) { oldEquation.balancedProperty.unlink( balancedObserver ); }
      newEquation.balancedProperty.link( balancedObserver );
    } );
  }

  public setHighlightEnabled( enabled: boolean ): void {
    this._highlightEnabled = enabled;
    this.updateHighlight();
  }

  // Highlights the arrow if the equation is balanced.
  private updateHighlight(): void {
    this.fill = ( this.equationProperty.value.balancedProperty.value && this._highlightEnabled )
                ? BCEColors.BALANCED_HIGHLIGHT_COLOR : BCEColors.UNBALANCED_COLOR;
  }
}

balancingChemicalEquations.register( 'RightArrowNode', RightArrowNode );