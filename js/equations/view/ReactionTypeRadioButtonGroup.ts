// Copyright 2025, University of Colorado Boulder

/**
 * ReactionTypeRadioButtonGroup is the radio button group for selecting a reaction type on the 'Equations' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import { AquaRadioButtonGroupItem } from '../../../../sun/js/AquaRadioButtonGroup.js';
import HorizontalAquaRadioButtonGroup from '../../../../sun/js/HorizontalAquaRadioButtonGroup.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import BalancingChemicalEquationsStrings from '../../BalancingChemicalEquationsStrings.js';
import { ReactionType } from '../model/EquationsModel.js';

const LABEL_FONT = new PhetFont( 16 );
const LABEL_FILL = 'white';

export default class ReactionTypeRadioButtonGroup extends HorizontalAquaRadioButtonGroup<ReactionType> {

  public constructor( reactionTypeProperty: Property<ReactionType>, tandem: Tandem ) {

    const items: AquaRadioButtonGroupItem<ReactionType>[] = [
      {
        value: 'synthesis',
        tandemName: 'synthesisRadioButton',
        createNode: () => new Text( BalancingChemicalEquationsStrings.synthesisStringProperty, {
          font: LABEL_FONT,
          fill: LABEL_FILL,
          maxWidth: 70 // Optimized for English, see https://github.com/phetsims/balancing-chemical-equations/issues/185.
        } )
      },
      {
        value: 'decomposition',
        tandemName: 'decompositionRadioButton',
        createNode: () => new Text( BalancingChemicalEquationsStrings.decompositionStringProperty, {
          font: LABEL_FONT,
          fill: LABEL_FILL,
          maxWidth: 106 // Optimized for English, see https://github.com/phetsims/balancing-chemical-equations/issues/185.
        } )
      },
      {
        value: 'combustion',
        tandemName: 'combustionRadioButton',
        createNode: () => new Text( BalancingChemicalEquationsStrings.combustionStringProperty, {
          font: LABEL_FONT,
          fill: LABEL_FILL,
          maxWidth: 86 // Optimized for English, see https://github.com/phetsims/balancing-chemical-equations/issues/185.
        } )
      }
    ];

    super( reactionTypeProperty, items, {
      isDisposable: false,
      radioButtonOptions: {
        radius: 8,
        xSpacing: 4
      },
      touchAreaYDilation: 15,
      spacing: 16,
      accessibleName: BalancingChemicalEquationsStrings.a11y.reactionTypeStringProperty,
      tandem: tandem
    } );
  }
}

balancingChemicalEquations.register( 'ReactionTypeRadioButtonGroup', ReactionTypeRadioButtonGroup );