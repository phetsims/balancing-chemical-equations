// Copyright 2014-2019, University of Colorado Boulder

/**
 * The beam is a horizontal lever, centered on the fulcrum.
 * It will be pivoted to represent the relationship between quantities on either side of the fulcrum.
 *
 * @author Vasily Shakhov (mlearner.com)
 */
define( require => {
  'use strict';

  // modules
  const balancingChemicalEquations = require( 'BALANCING_CHEMICAL_EQUATIONS/balancingChemicalEquations' );
  const BCEConstants = require( 'BALANCING_CHEMICAL_EQUATIONS/common/BCEConstants' );
  const merge = require( 'PHET_CORE/merge' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );

  class BeamNode extends Rectangle {

    /**
     * @param {number} beamLength
     * @param {number} beamThickness
     */
    constructor( beamLength, beamThickness, options ) {

      options = merge( {
        fill: 'black',
        stroke: 'black'
      }, options );

      super( -beamLength / 2, -beamThickness / 2, beamLength, beamThickness, options );
    }

    // @public
    setHighlighted( highlighted ) {
      this.fill = highlighted ? BCEConstants.BALANCED_HIGHLIGHT_COLOR : 'black';
      this.lineWidth = highlighted ? 1 : 0;
    }
  }

  return balancingChemicalEquations.register( 'BeamNode', BeamNode );
} );