// Copyright 2025, University of Colorado Boulder

/**
 * EquationTypeRadioButtonGroup is the radio button group for selecting an equation type the 'Equations' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import { AquaRadioButtonGroupItem } from '../../../../sun/js/AquaRadioButtonGroup.js';
import HorizontalAquaRadioButtonGroup from '../../../../sun/js/HorizontalAquaRadioButtonGroup.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import { EquationType } from '../model/EquationsModel.js';
import BalancingChemicalEquationsStrings from '../../BalancingChemicalEquationsStrings.js';
import Tandem from '../../../../tandem/js/Tandem.js';

const TEXT_OPTIONS = {
  font: new PhetFont( 16 ),
  fill: 'white',
  maxWidth: 100
};

export default class EquationTypeRadioButtonGroup extends HorizontalAquaRadioButtonGroup<EquationType> {

  public constructor( equationTypeProperty: Property<EquationType>, tandem: Tandem ) {

    const items: AquaRadioButtonGroupItem<EquationType>[] = [
      {
        value: 'synthesis',
        tandemName: 'synthesisRadioButton',
        createNode: () => new Text( BalancingChemicalEquationsStrings.synthesisStringProperty, TEXT_OPTIONS )
      },
      {
        value: 'decomposition',
        tandemName: 'decompositionRadioButton',
        createNode: () => new Text( BalancingChemicalEquationsStrings.decompositionStringProperty, TEXT_OPTIONS )
      },
      {
        value: 'combustion',
        tandemName: 'combustionRadioButton',
        createNode: () => new Text( BalancingChemicalEquationsStrings.combustionStringProperty, TEXT_OPTIONS )
      }
    ];

    super( equationTypeProperty, items, {
      isDisposable: false,
      radioButtonOptions: { radius: 8 },
      touchAreaYDilation: 15,
      spacing: 30,
      tandem: tandem
    } );
  }
}

balancingChemicalEquations.register( 'EquationTypeRadioButtonGroup', EquationTypeRadioButtonGroup );