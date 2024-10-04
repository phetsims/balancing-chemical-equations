// Copyright 2014-2024, University of Colorado Boulder

/**
 * Horizontal bar for selecting an equation.
 *
 * @author Vasily Shakhov (MLearner)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import { Node, NodeOptions, NodeTranslationOptions, Rectangle } from '../../../../scenery/js/imports.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import Equation from '../../common/model/Equation.js';
import { EquationChoice } from '../model/IntroModel.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import EquationRadioButtonGroup from './EquationRadioButtonGroup.js';

// constants
const BAR_HEIGHT = 50; //height of control node

type SelfOptions = EmptySelfOptions;

type EquationChoiceNodeOptions = SelfOptions & NodeTranslationOptions & PickRequired<NodeOptions, 'tandem'>;

export default class EquationChoiceNode extends Node {

  public constructor( visibleBoundsProperty: TReadOnlyProperty<Bounds2>,
                      layoutBoundsWidth: number,
                      equationProperty: Property<Equation>,
                      choices: EquationChoice[],
                      providedOptions?: EquationChoiceNodeOptions ) {

    const options = optionize<EquationChoiceNodeOptions, SelfOptions, NodeOptions>()( {

      // NodeOptions
      isDisposable: false
    }, providedOptions );

    // Bar that is the width of the screen.
    const barNode = new Rectangle( 0, 0, 1, BAR_HEIGHT, {
      fill: '#3376c4'
    } );
    visibleBoundsProperty.link( visibleBounds => {
      barNode.setRect( 0, 0, visibleBounds.width, BAR_HEIGHT );
      barNode.centerX = visibleBounds.centerX;
    } );

    // Radio button group
    const radioButtonGroup = new EquationRadioButtonGroup( equationProperty, choices, {
      maxWidth: 0.8 * layoutBoundsWidth,
      tandem: options.tandem.createTandem( 'radioButtonGroup' )
    } );
    radioButtonGroup.localBoundsProperty.link( () => {
      radioButtonGroup.left = 50;
      radioButtonGroup.centerY = BAR_HEIGHT / 2;
    } );

    options.children = [ barNode, radioButtonGroup ];

    super( options );
  }
}

balancingChemicalEquations.register( 'EquationChoiceNode', EquationChoiceNode );