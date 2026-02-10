// Copyright 2025, University of Colorado Boulder

/**
 * CoefficientPicker is a specialization of NumberPicker for setting the coefficient of a term in an equation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import NumberPicker, { NumberPickerOptions } from '../../../../sun/js/NumberPicker.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';

type SelfOptions = EmptySelfOptions;

type CoefficientPickerOptions = SelfOptions & WithRequired<NumberPickerOptions, 'tandem' | 'font'> &
  StrictOmit<NumberPickerOptions, 'timerDelay' | 'timerInterval' | 'disabledOpacity' | 'backgroundStrokeDisabledOpacity' | 'arrowDisabledOpacity'>;

export default class CoefficientPicker extends NumberPicker {

  public constructor( coefficientProperty: NumberProperty, providedOptions: CoefficientPickerOptions ) {

    const options = optionize<CoefficientPickerOptions, SelfOptions, NumberPickerOptions>()( {
      color: 'rgb( 50, 50, 50 )',
      pressedColor: 'black',
      xMargin: 8,
      yMargin: 0,
      touchAreaXDilation: 30,
      timerDelay: 400, // ms until the picker starts to fire continuously
      timerInterval: 200, // ms between value change while firing continuously

      // Hide arrows when picker is disabled.
      disabledOpacity: 1,
      backgroundStrokeDisabledOpacity: 1,
      arrowDisabledOpacity: 0,

      phetioVisiblePropertyInstrumented: false
    }, providedOptions );

    super( coefficientProperty, coefficientProperty.rangeProperty, options );
  }
}

balancingChemicalEquations.register( 'CoefficientPicker', CoefficientPicker );