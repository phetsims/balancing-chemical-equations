// Copyright 2014-2024, University of Colorado Boulder

/**
 * Horizontal bar that dynamically changes its width to match the visible width of the browser window.
 *
 * @author Vasily Shakhov (MLearner)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { NodeTranslationOptions, Rectangle, RectangleOptions } from '../../../../scenery/js/imports.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';

const BAR_HEIGHT = 50;

type SelfOptions = EmptySelfOptions;

type EquationChoiceNodeOptions = SelfOptions & NodeTranslationOptions;

export default class EquationChoiceNode extends Rectangle {

  public constructor( visibleBoundsProperty: TReadOnlyProperty<Bounds2>, providedOptions: EquationChoiceNodeOptions ) {

    const options = optionize<EquationChoiceNodeOptions, SelfOptions, RectangleOptions>()( {

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

balancingChemicalEquations.register( 'EquationChoiceNode', EquationChoiceNode );