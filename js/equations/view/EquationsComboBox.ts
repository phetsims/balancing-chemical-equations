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

const RICH_TEXT_OPTIONS: RichTextOptions = {
  font: new PhetFont( 16 ),
  maxWidth: 220
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
      maxWidth: 600
    }, providedOptions );

    const equations = equationProperty.validValues!;
    assert && assert( equations && equations.length > 0 );

    const items: ComboBoxItem<T>[] = equations.map( equation => {
      return {
        value: equation,
        tandemName: `${equation.tandem.name}Item`,
        //TODO https://github.com/phetsims/balancing-chemical-equations/issues/170 Equation with markup and '?' for coefficients.
        createNode: () => itemAlignGroup.createBox( new RichText( equation.toString(), RICH_TEXT_OPTIONS ), {
          xAlign: 'left'
        } )
      };
    } );

    super( equationProperty, items, listboxParent, options );
  }
}

balancingChemicalEquations.register( 'EquationsComboBox', EquationsComboBox );