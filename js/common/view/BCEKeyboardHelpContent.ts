// Copyright 2025, University of Colorado Boulder

/**
 * BCEKeyboardHelpContent is the keyboard help content for the Intro and Equations screens.
 * It includes coefficient controls (slider-like), combo box for view selection, and basic actions.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 */

import BasicActionsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/BasicActionsKeyboardHelpSection.js';
import ComboBoxKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/ComboBoxKeyboardHelpSection.js';
import SliderControlsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/SliderControlsKeyboardHelpSection.js';
import TwoColumnKeyboardHelpContent from '../../../../scenery-phet/js/keyboard/help/TwoColumnKeyboardHelpContent.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import BalancingChemicalEquationsStrings from '../../BalancingChemicalEquationsStrings.js';

export default class BCEKeyboardHelpContent extends TwoColumnKeyboardHelpContent {

  public constructor() {

    // Left column: Coefficient Controls and Choose a View
    const coefficientControlsSection = new SliderControlsKeyboardHelpSection( {
      headingStringProperty: BalancingChemicalEquationsStrings.a11y.keyboardHelpDialog.coefficientControlsStringProperty,
      sliderStringProperty: BalancingChemicalEquationsStrings.a11y.keyboardHelpDialog.coefficientStringProperty
    } );

    const chooseAViewSection = new ComboBoxKeyboardHelpSection( {
      headingString: BalancingChemicalEquationsStrings.a11y.keyboardHelpDialog.chooseAViewStringProperty,
      thingAsLowerCaseSingular: BalancingChemicalEquationsStrings.a11y.keyboardHelpDialog.viewStringProperty,
      thingAsLowerCasePlural: BalancingChemicalEquationsStrings.a11y.keyboardHelpDialog.viewsStringProperty
    } );

    // Right column: Basic Actions (without checkbox content)
    const basicActionsSection = new BasicActionsKeyboardHelpSection( {
      withCheckboxContent: false
    } );

    super( [ coefficientControlsSection, chooseAViewSection ], [ basicActionsSection ] );
  }
}

balancingChemicalEquations.register( 'BCEKeyboardHelpContent', BCEKeyboardHelpContent );
