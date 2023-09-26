// Copyright 2014-2023, University of Colorado Boulder

/**
 * The beam is a horizontal lever, centered on the fulcrum.
 * It will be pivoted to represent the relationship between quantities on either side of the fulcrum.
 *
 * @author Vasily Shakhov (mlearner.com)
 */

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';
import { NodeTranslationOptions, Rectangle, RectangleOptions } from '../../../../scenery/js/imports.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import BCEColors from '../BCEColors.js';

type SelfOptions = EmptySelfOptions;

type BeamNodeOptions = SelfOptions & NodeTranslationOptions & PickOptional<RectangleOptions, 'transformBounds'>;

export default class BeamNode extends Rectangle {

  public constructor( beamLength: number, beamThickness: number, providedOptions?: BeamNodeOptions ) {

    const options = optionize<BeamNodeOptions, SelfOptions, RectangleOptions>()( {

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

balancingChemicalEquations.register( 'BeamNode', BeamNode );