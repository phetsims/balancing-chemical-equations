// Copyright 2014-2022, University of Colorado Boulder

/**
 * A term in the equation, includes the coefficient and symbol.
 * The coefficient may or may not be editable.
 *
 * @author Vasily Shakhov (mlearner.com)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import merge from '../../../../phet-core/js/merge.js';
import NumberPicker from '../../../../sun/js/NumberPicker.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Node } from '../../../../scenery/js/imports.js';
import { RichText } from '../../../../scenery/js/imports.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';

class TermNode extends Node {

  /**
   * @param {DOT.Range} coefficientRange
   * @param {EquationTerm} term
   * @param {Object} [options]
   */
  constructor( coefficientRange, term, options ) {

    options = merge( {
      fontSize: 32,
      xSpacing: 4
    }, options );

    // coefficient picker
    const coefficientNode = new NumberPicker( term.userCoefficientProperty, new Property( coefficientRange ), {
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
    symbolNode.left = coefficientNode.right + options.xSpacing;
    symbolNode.centerY = coefficientNode.centerY + ( symbolNode.height - new RichText( 'H', richTextOptions ).height ) / 2;

    options.children = [ coefficientNode, symbolNode ];
    super( options );

    // @private
    this.coefficientNode = coefficientNode;
  }

  // @public
  dispose() {
    this.coefficientNode.dispose();
    super.dispose();
  }

  /**
   * Sets whether the term's coefficient is editable, by showing/hiding the arrows on the NumberPicker.
   * @param editable
   * @public
   */
  setCoefficientEditable( editable ) {
    this.pickable = editable;
    this.coefficientNode.setArrowsVisible( editable );
  }
}

balancingChemicalEquations.register( 'TermNode', TermNode );
export default TermNode;