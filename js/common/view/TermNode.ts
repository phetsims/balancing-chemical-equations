// Copyright 2014-2023, University of Colorado Boulder

/**
 * A term in the equation, includes the coefficient and symbol.
 * The coefficient may or may not be editable.
 *
 * @author Vasily Shakhov (mlearner.com)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Range from '../../../../dot/js/Range.js';
import { Node, NodeOptions, RichText } from '../../../../scenery/js/imports.js';
import NumberPicker from '../../../../sun/js/NumberPicker.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import EquationTerm from '../model/EquationTerm.js';
import optionize from '../../../../phet-core/js/optionize.js';

type SelfOptions = {
  fontSize?: number;
  xSpacing?: number;
};

type TermNodeOptions = SelfOptions;

export default class TermNode extends Node {

  private readonly coefficientPicker: NumberPicker;

  public constructor( coefficientRange: Range, term: EquationTerm, providedOptions?: TermNodeOptions ) {

    const options = optionize<TermNodeOptions, SelfOptions, NodeOptions>()( {

      // SelfOptions
      fontSize: 32,
      xSpacing: 4
    }, providedOptions );

    // coefficient picker
    const coefficientPicker = new NumberPicker( term.userCoefficientProperty, new Property( coefficientRange ), {
      color: 'rgb(50,50,50)',
      pressedColor: 'black',
      xMargin: 8,
      yMargin: 0,
      touchAreaXDilation: 30,
      font: new PhetFont( options.fontSize ),
      timerDelay: 400, // ms until the picker starts to fire continuously
      timerInterval: 200 // ms between value change while firing continuously
    } );

    // symbol, non-subscript part of the symbol is vertically centered on the picker
    const richTextOptions = { font: new PhetFont( options.fontSize ) };
    const symbolNode = new RichText( term.molecule.symbol, richTextOptions );
    symbolNode.left = coefficientPicker.right + options.xSpacing;
    symbolNode.centerY = coefficientPicker.centerY + ( symbolNode.height - new RichText( 'H', richTextOptions ).height ) / 2;

    options.children = [ coefficientPicker, symbolNode ];
    super( options );

    this.coefficientPicker = coefficientPicker;
  }

  public override dispose(): void {
    this.coefficientPicker.dispose();
    super.dispose();
  }

  /**
   * Sets whether the term's coefficient is editable, by showing/hiding the arrows on the NumberPicker.
   */
  public setCoefficientEditable( editable: boolean ): void {
    this.pickable = editable;
    this.coefficientPicker.setArrowsVisible( editable );
  }
}

balancingChemicalEquations.register( 'TermNode', TermNode );