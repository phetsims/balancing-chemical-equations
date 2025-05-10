// Copyright 2025, University of Colorado Boulder

/**
 * EquationsComboBox is the combo box for selecting an equation in the 'Equations' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import ComboBox, { ComboBoxItem, ComboBoxOptions } from '../../../../sun/js/ComboBox.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import Equation from '../../common/model/Equation.js';
import RichText, { RichTextOptions } from '../../../../scenery/js/nodes/RichText.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import AlignGroup from '../../../../scenery/js/layout/constraints/AlignGroup.js';
import isPhetioEnabled from '../../../../phet-core/js/isPhetioEnabled.js';

const RICH_TEXT_OPTIONS: RichTextOptions = {
  font: new PhetFont( 16 ),
  maxWidth: 250
};

type SelfOptions = EmptySelfOptions;

type EquationsComboBoxOptions = SelfOptions & PickRequired<ComboBoxOptions, 'tandem' | 'visibleProperty'>;

export default class EquationsComboBox<T extends Equation> extends ComboBox<T> {

  public constructor( equationProperty: Property<T>,
                      listboxParent: Node,
                      itemAlignGroup: AlignGroup,
                      providedOptions: EquationsComboBoxOptions ) {

    const options = optionize<EquationsComboBoxOptions, SelfOptions, ComboBoxOptions>()( {

      // ComboBoxOptions
      isDisposable: false,
      listPosition: 'above',
      xMargin: 10,
      yMargin: 5,
      cornerRadius: 4,
      maxWidth: 600,
      phetioEnabledPropertyInstrumented: false
    }, providedOptions );

    const equations = equationProperty.validValues!;
    assert && assert( equations && equations.length > 0 );

    const items: ComboBoxItem<T>[] = equations.map( equation => {
      const text = new RichText( equation.getDisplayString(), RICH_TEXT_OPTIONS );
      return {
        value: equation,
        tandemName: `${equation.tandem.name}Item`,
        createNode: () => itemAlignGroup.createBox( text, {
          xAlign: 'left'
        } ),
        comboBoxListItemNodeOptions: {
          phetioDocumentation: isPhetioEnabled ? equation.phetioDocumentation : ''
        }
      };
    } );

    super( equationProperty, items, listboxParent, options );
  }
}

balancingChemicalEquations.register( 'EquationsComboBox', EquationsComboBox );