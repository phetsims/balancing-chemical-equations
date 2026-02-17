// Copyright 2026, University of Colorado Boulder

/**
 * BCEGameKeyboardHelpContent is the keyboard help content for the Game screen.
 * It includes coefficient controls (slider-like) and basic actions.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 */

import BasicActionsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/BasicActionsKeyboardHelpSection.js';
import SliderControlsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/SliderControlsKeyboardHelpSection.js';
import TwoColumnKeyboardHelpContent from '../../../../scenery-phet/js/keyboard/help/TwoColumnKeyboardHelpContent.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import BalancingChemicalEquationsStrings from '../../BalancingChemicalEquationsStrings.js';

export default class BCEGameKeyboardHelpContent extends TwoColumnKeyboardHelpContent {

  public constructor() {

    // Left column: Coefficient Controls
    const coefficientControlsSection = new SliderControlsKeyboardHelpSection( {
      headingStringProperty: BalancingChemicalEquationsStrings.a11y.keyboardHelpDialog.coefficientControlsStringProperty,
      sliderStringProperty: BalancingChemicalEquationsStrings.a11y.keyboardHelpDialog.coefficientStringProperty
    } );

    // Right column: Basic Actions (without checkbox content)
    const basicActionsSection = new BasicActionsKeyboardHelpSection( {
      withCheckboxContent: false
    } );

    super( [ coefficientControlsSection ], [ basicActionsSection ] );
  }
}

balancingChemicalEquations.register( 'BCEGameKeyboardHelpContent', BCEGameKeyboardHelpContent );
