// Copyright 2014-2025, University of Colorado Boulder

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

type SelfOptions = {
  fontSize?: number;
  xSpacing?: number;
};

type EquationTermNodeOptions = SelfOptions & PickRequired<NodeOptions, 'tandem'>;

export default class EquationTermNode extends Node {

  private readonly coefficientPicker: NumberPicker;

  public constructor( term: EquationTerm, providedOptions: EquationTermNodeOptions ) {

    const options = optionize<EquationTermNodeOptions, SelfOptions, NodeOptions>()( {

      // SelfOptions
      fontSize: 32,
      xSpacing: 4,

      // NodeOptions
      phetioVisiblePropertyInstrumented: false
    }, providedOptions );

    // coefficient picker
    const coefficientPicker = new NumberPicker( term.coefficientProperty, term.coefficientProperty.rangeProperty, {
      color: 'rgb(50,50,50)',
      pressedColor: 'black',
      xMargin: 8,
      yMargin: 0,
      touchAreaXDilation: 30,
      font: new PhetFont( options.fontSize ),
      timerDelay: 400, // ms until the picker starts to fire continuously
      timerInterval: 200, // ms between value change while firing continuously
      tandem: options.tandem.createTandem( 'coefficientPicker' ),
      phetioVisiblePropertyInstrumented: false
    } );

    // symbol, non-subscript part of the symbol is vertically centered on the picker
    const richTextOptions = {
      font: new PhetFont( options.fontSize )
    };
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

balancingChemicalEquations.register( 'EquationTermNode', EquationTermNode );