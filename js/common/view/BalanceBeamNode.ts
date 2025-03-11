// Copyright 2014-2025, University of Colorado Boulder

/**
 * BalanceBeamNode is the beam for the balance scale. It is a horizontal lever, centered on the fulcrum.
 * It will be pivoted to represent the relationship between quantities on either side of the fulcrum.
 *
 * @author Vasily Shakhov (mlearner.com)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';
import { NodeTranslationOptions } from '../../../../scenery/js/nodes/Node.js';
import Rectangle, { RectangleOptions } from '../../../../scenery/js/nodes/Rectangle.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import BCEColors from '../BCEColors.js';

type SelfOptions = EmptySelfOptions;

type BalanceBeamNodeOptions = SelfOptions & NodeTranslationOptions & PickOptional<RectangleOptions, 'transformBounds'>;

export default class BalanceBeamNode extends Rectangle {

  public constructor( beamLength: number, beamThickness: number, providedOptions?: BalanceBeamNodeOptions ) {

    const options = optionize<BalanceBeamNodeOptions, SelfOptions, RectangleOptions>()( {

      // RectangleOptions
      fill: 'black',
      stroke: 'black'
    }, providedOptions );

    super( -beamLength / 2, -beamThickness / 2, beamLength, beamThickness, options );
  }

  public setHighlighted( highlighted: boolean ): void {
    this.fill = highlighted ? BCEColors.BALANCED_HIGHLIGHT_COLOR : 'black';
    this.lineWidth = highlighted ? 1 : 0;
  }
}

balancingChemicalEquations.register( 'BalanceBeamNode', BalanceBeamNode );