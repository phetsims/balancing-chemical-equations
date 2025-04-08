// Copyright 2025, University of Colorado Boulder

/**
 * InitialCoefficientControl.ts is the control in the Preferences dialog for choosing the initial coefficient
 * for all equations, in all screens.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import Property from '../../../../axon/js/Property.js';
import PreferencesControl, { PreferencesControlOptions } from '../../../../joist/js/preferences/PreferencesControl.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import BCEConstants from '../BCEConstants.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import BalancingChemicalEquationsStrings from '../../BalancingChemicalEquationsStrings.js';
import AquaRadioButtonGroup, { AquaRadioButtonGroupItem } from '../../../../sun/js/AquaRadioButtonGroup.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import PreferencesDialogConstants from '../../../../joist/js/preferences/PreferencesDialogConstants.js';

export default class InitialCoefficientControl extends PreferencesControl {

  public constructor( initialCoefficientProperty: Property<number>, tandem: Tandem ) {

    const labelText = new Text( BalancingChemicalEquationsStrings.initialCoefficientStringProperty,
      PreferencesDialogConstants.CONTROL_LABEL_OPTIONS );

    const descriptionText = new RichText( BalancingChemicalEquationsStrings.initialCoefficientDescriptionStringProperty,
      PreferencesDialogConstants.CONTROL_DESCRIPTION_OPTIONS );

    const radioButtonGroup = new InitialCoefficientRadioButtonGroup( initialCoefficientProperty,
      tandem.createTandem( 'radioButtonGroup' ) );

    super( combineOptions<PreferencesControlOptions>( {}, BCEConstants.PREFERENCES_CONTROL_OPTIONS, {
      labelNode: labelText,
      controlNode: radioButtonGroup,
      descriptionNode: descriptionText,
      tandem: tandem
    } ) );
  }
}

/**
 * The radio button group for this control.
 */
class InitialCoefficientRadioButtonGroup extends AquaRadioButtonGroup<number> {

  public constructor( initialCoefficientProperty: Property<number>, tandem: Tandem ) {

    const items: AquaRadioButtonGroupItem<number>[] = [
      {
        value: 0,
        createNode: () => new Text( 0, {
          font: PreferencesDialogConstants.CONTENT_FONT
        } ),
        tandemName: 'zeroRadioButton'
      },
      {
        value: 1,
        createNode: () => new Text( 1, {
          font: PreferencesDialogConstants.CONTENT_FONT
        } ),
        tandemName: 'oneRadioButton'
      }
    ];

    super( initialCoefficientProperty, items, {
      orientation: 'vertical',
      spacing: 20,
      radioButtonOptions: {
        phetioVisiblePropertyInstrumented: false
      },
      phetioVisiblePropertyInstrumented: false,
      tandem: tandem
    } );
  }
}

balancingChemicalEquations.register( 'InitialCoefficientControl', InitialCoefficientControl );