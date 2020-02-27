// Copyright 2014-2020, University of Colorado Boulder

/**
 * The beam is a horizontal lever, centered on the fulcrum.
 * It will be pivoted to represent the relationship between quantities on either side of the fulcrum.
 *
 * @author Vasily Shakhov (mlearner.com)
 */

import merge from '../../../../phet-core/js/merge.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import BCEConstants from '../BCEConstants.js';

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

balancingChemicalEquations.register( 'BeamNode', BeamNode );
export default BeamNode;