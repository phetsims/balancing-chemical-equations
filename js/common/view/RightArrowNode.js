// Copyright 2014-2021, University of Colorado Boulder

/**
 * An arrow that points left to right, from reactants to products.
 * Highlights when the equation is balanced.
 *
 * @author Vasily Shakhov (mlearner.com)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import BCEConstants from '../BCEConstants.js';

// constants
const ARROW_LENGTH = 70;

class RightArrowNode extends ArrowNode {

  /**
   * @param {Property.<Equation>} equationProperty
   * @param {Object} [options]
   */
  constructor( equationProperty, options ) {

    options = merge( {
      tailWidth: 15,
      headWidth: 35,
      headHeight: 30
    }, options );

    super( 0, 0, ARROW_LENGTH, 0, options );

    this.equationProperty = equationProperty; // @private
    this._highlightEnabled = true; // @private

    // Wire observer to current equation.
    const balancedObserver = this.updateHighlight.bind( this );
    equationProperty.link( ( newEquation, oldEquation ) => {
      if ( oldEquation ) { oldEquation.balancedProperty.unlink( balancedObserver ); }
      newEquation.balancedProperty.link( balancedObserver );
    } );
  }

  // No dispose needed, instances of this type persist for lifetime of the sim.

  // @private Highlights the arrow if the equation is balanced.
  updateHighlight() {
    this.fill = ( this.equationProperty.get().balancedProperty.get() && this._highlightEnabled )
                ? BCEConstants.BALANCED_HIGHLIGHT_COLOR : BCEConstants.UNBALANCED_COLOR;
  }

  // @public
  set highlightEnabled( value ) {
    this._highlightEnabled = value;
    this.updateHighlight();
  }

  // @public
  get highlightEnabled() { return this._highlightEnabled; }
}

balancingChemicalEquations.register( 'RightArrowNode', RightArrowNode );
export default RightArrowNode;