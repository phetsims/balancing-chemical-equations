// Copyright 2023-2025, University of Colorado Boulder

/**
 * BCEPreferencesNode is the user interface for sim-specific preferences, accessed via the
 * Simulation tab of the Preferences dialog. These preferences are global, and affect all screens.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BCEPreferences from '../model/BCEPreferences.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import InitialCoefficientControl from './InitialCoefficientControl.js';

export default class BCEPreferencesNode extends VBox {

  public constructor( preferences: BCEPreferences, tandem: Tandem ) {

    const initialCoefficientControl = new InitialCoefficientControl( preferences.initialCoefficientProperty,
      tandem.createTandem( 'initialCoefficientControl' ) );

    super( {
      children: [ initialCoefficientControl ],
      isDisposable: false,
      align: 'left',
      spacing: 30,
      phetioVisiblePropertyInstrumented: false
    } );
  }
}

balancingChemicalEquations.register( 'BCEPreferencesNode', BCEPreferencesNode );