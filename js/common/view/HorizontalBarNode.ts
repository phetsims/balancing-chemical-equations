// Copyright 2014-2025, University of Colorado Boulder

/**
 * HorizontalBarNode is the horizontal bar on the Intro screen, behind the radio buttons that select an equation.
 * The bar dynamically changes its width to match the visible width of the browser window.
 *
 * @author Vasily Shakhov (MLearner)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import { NodeTranslationOptions } from '../../../../scenery/js/nodes/Node.js';
import Rectangle, { RectangleOptions } from '../../../../scenery/js/nodes/Rectangle.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';

const BAR_HEIGHT = 50;

type SelfOptions = EmptySelfOptions;

type HorizontalBarNodeOptions = SelfOptions & NodeTranslationOptions & PickRequired<RectangleOptions, 'visibleProperty'>;

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