// Copyright 2025, University of Colorado Boulder

/**
 * BCEPreferences is the model for sim-specific preferences, accessed via the Preferences dialog.
 * Preferences are implemented as a singleton. They are global, and affect all screens.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import BCEQueryParameters from '../BCEQueryParameters.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import BCEConstants from '../BCEConstants.js';

export default class BCEPreferences {

  // Initial coefficient for all terms, in all equations.
  // See https://github.com/phetsims/balancing-chemical-equations/issues/182
  public readonly initialCoefficientProperty: NumberProperty;

  // Singleton instance
  public static readonly instance = new BCEPreferences();

  // Private because this is a singleton, accessed via BCEPreferences.instance.
  private constructor() {

    this.initialCoefficientProperty = new NumberProperty( BCEQueryParameters.initialCoefficient, {
      numberType: 'Integer',
      validValues: BCEConstants.INITIAL_COEFFICIENT_VALID_VALUES,
      tandem: Tandem.PREFERENCES.createTandem( 'initialCoefficientProperty' ),
      phetioDocumentation: 'The initial coefficient for all terms, in all equations, in all screens.',
      phetioFeatured: true
    } );
  }
}

balancingChemicalEquations.register( 'BCEPreferences', BCEPreferences );