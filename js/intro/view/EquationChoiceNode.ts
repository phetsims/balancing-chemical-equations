// Copyright 2014-2024, University of Colorado Boulder

/**
 * Horizontal bar for selecting an equation.
 *
 * @author Vasily Shakhov (MLearner)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Node, NodeOptions, NodeTranslationOptions, Rectangle, Text } from '../../../../scenery/js/imports.js';
import { AquaRadioButtonGroupItem } from '../../../../sun/js/AquaRadioButtonGroup.js';
import HorizontalAquaRadioButtonGroup from '../../../../sun/js/HorizontalAquaRadioButtonGroup.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import Equation from '../../common/model/Equation.js';
import { EquationChoice } from '../model/IntroModel.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';

// constants
const BAR_HEIGHT = 50; //height of control node
const TEXT_OPTIONS = { font: new PhetFont( 16 ), fill: 'white' };

type SelfOptions = EmptySelfOptions;

type EquationChoiceNodeOptions = SelfOptions & NodeTranslationOptions & PickRequired<NodeOptions, 'tandem'>;

export default class EquationChoiceNode extends Node {

  public constructor( screenWidth: number, equationProperty: Property<Equation>, choices: EquationChoice[],
                      providedOptions?: EquationChoiceNodeOptions ) {

    const options = optionize<EquationChoiceNodeOptions, SelfOptions, NodeOptions>()( {

      // NodeOptions
      isDisposable: false
    }, providedOptions );

    // background, extra wide so that it will appear to fill the entire screen for all but extreme window sizes
    const backgroundRectangle = new Rectangle( 0, 0, 4 * screenWidth, BAR_HEIGHT, {
      fill: '#3376c4',
      centerX: screenWidth / 2
    } );

    // radio button descriptions, one button for each equation
    const radioButtonItems: AquaRadioButtonGroupItem<Equation>[] = choices.map( choice => {
      return {
        createNode: () => new Text( choice.labelStringProperty, TEXT_OPTIONS ),
        value: choice.equation
      };
    } );

    // radio button group, horizontally layout
    const radioButtonGroup = new HorizontalAquaRadioButtonGroup( equationProperty, radioButtonItems, {
      radioButtonOptions: { radius: 8 },
      touchAreaYDilation: 15,
      spacing: 30,
      left: 50,
      centerY: BAR_HEIGHT / 2,
      maxWidth: 0.8 * screenWidth,
      tandem: options.tandem.createTandem( 'radioButtonGroup' )
    } );

    options.children = [ backgroundRectangle, radioButtonGroup ];

    super( options );
  }
}

balancingChemicalEquations.register( 'EquationChoiceNode', EquationChoiceNode );