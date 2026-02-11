// Copyright 2014-2026, University of Colorado Boulder

/**
 * EquationTermNode is a term in an equation, including the coefficient and symbol.
 * The coefficient may or may not be editable via a NumberPicker.
 *
 * @author Vasily Shakhov (mlearner.com)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import optionize from '../../../../phet-core/js/optionize.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Node, { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import NumberPicker from '../../../../sun/js/NumberPicker.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import EquationTerm from '../model/EquationTerm.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import CoefficientPicker from './CoefficientPicker.js';

type SelfOptions = {
  font: PhetFont;
  xSpacing?: number;
};

type EquationTermNodeOptions = SelfOptions & PickRequired<NodeOptions, 'tandem'>;

export default class EquationTermNode extends Node {

  private readonly coefficientPicker: NumberPicker;
  private readonly disposeEquationTermNode: () => void;

  public constructor( term: EquationTerm, providedOptions: EquationTermNodeOptions ) {

    const options = optionize<EquationTermNodeOptions, SelfOptions, NodeOptions>()( {

      // SelfOptions
      xSpacing: 4,

      // NodeOptions
      phetioVisiblePropertyInstrumented: false
    }, providedOptions );

    // coefficient picker
    const coefficientPicker = new CoefficientPicker( term.coefficientProperty, {
      font: options.font,
      tandem: options.tandem.createTandem( 'coefficientPicker' ),
      accessibleName: term.molecule.symbol
    } );

    // symbol, non-subscript part of the symbol is vertically centered on the picker
    const richTextOptions = {
      font: options.font
    };
    const symbolNode = new RichText( term.molecule.symbol, richTextOptions );
    symbolNode.left = coefficientPicker.right + options.xSpacing;
    symbolNode.centerY = coefficientPicker.centerY + ( symbolNode.height - new RichText( 'H', richTextOptions ).height ) / 2;

    options.children = [ coefficientPicker, symbolNode ];

    super( options );

    this.coefficientPicker = coefficientPicker;

    this.disposeEquationTermNode = () => {
      this.coefficientPicker.dispose();
      symbolNode.dispose(); // The symbol might be localized in the future.
    };
  }

  public override dispose(): void {
    this.disposeEquationTermNode();
    super.dispose();
  }

  /**
   * Sets whether the term's coefficient is editable.
   */
  public setCoefficientEditable( editable: boolean ): void {
    this.coefficientPicker.enabledProperty.value = editable;
  }
}

balancingChemicalEquations.register( 'EquationTermNode', EquationTermNode );