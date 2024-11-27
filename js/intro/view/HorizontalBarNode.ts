// Copyright 2014-2024, University of Colorado Boulder

/**
 * Horizontal bar that dynamically changes its width to match the visible width of the browser window.
 *
 * @author Vasily Shakhov (MLearner)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';
import { NodeTranslationOptions, Rectangle, RectangleOptions } from '../../../../scenery/js/imports.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';

const BAR_HEIGHT = 50;

type SelfOptions = EmptySelfOptions;

type HorizontalBarNodeOptions = SelfOptions & NodeTranslationOptions & PickOptional<RectangleOptions, 'visibleProperty'>;

export default class HorizontalBarNode extends Rectangle {

  public constructor( visibleBoundsProperty: TReadOnlyProperty<Bounds2>, providedOptions: HorizontalBarNodeOptions ) {

    const options = optionize<HorizontalBarNodeOptions, SelfOptions, RectangleOptions>()( {

      // RectangleOptions
      isDisposable: false,
      fill: '#3376c4'
    }, providedOptions );

    super( 0, 0, 1, BAR_HEIGHT, options );

    visibleBoundsProperty.link( visibleBounds => {
      this.setRect( visibleBounds.minX, 0, visibleBounds.width, BAR_HEIGHT );
      this.centerX = visibleBounds.centerX;
    } );
  }
}

balancingChemicalEquations.register( 'HorizontalBarNode', HorizontalBarNode );