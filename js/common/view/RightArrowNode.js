// Copyright 2014-2019, University of Colorado Boulder

/**
 * An arrow that points left to right, from reactants to products.
 * Highlights when the equation is balanced.
 *
 * @author Vasily Shakhov (mlearner.com)
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  const balancingChemicalEquations = require( 'BALANCING_CHEMICAL_EQUATIONS/balancingChemicalEquations' );
  const BCEConstants = require( 'BALANCING_CHEMICAL_EQUATIONS/common/BCEConstants' );
  const merge = require( 'PHET_CORE/merge' );

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

  return balancingChemicalEquations.register( 'RightArrowNode', RightArrowNode );
} );
