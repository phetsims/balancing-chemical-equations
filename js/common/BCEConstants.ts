// Copyright 2014-2025, University of Colorado Boulder

/**
 * Constants used throughout this simulation.
 *
 * @author Vasily Shakhov (mlearner.com)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Bounds2 from '../../../dot/js/Bounds2.js';
import { AtomNodeOptions } from '../../../nitroglycerin/js/nodes/AtomNode.js';
import balancingChemicalEquations from '../balancingChemicalEquations.js';
import BCEColors from './BCEColors.js';
import PhetFont from '../../../scenery-phet/js/PhetFont.js';
import { PreferencesControlOptions } from '../../../joist/js/preferences/PreferencesControl.js';

const ATOM_NODE_OPTIONS: AtomNodeOptions = {
  stroke: BCEColors.ATOM_STROKE,
  lineWidth: 0.5
};

const PREFERENCES_CONTROL_OPTIONS: PreferencesControlOptions = {
  isDisposable: false,
  labelSpacing: 20,
  visiblePropertyOptions: {
    phetioFeatured: true
  }
};

const BCEConstants = {

  // A PhET wide decision was made to not update custom layout bounds even if they do not match the
  // default layout bounds in ScreenView. Do not change these bounds as changes could break or disturb
  // any PhET-iO instrumentation. https://github.com/phetsims/phet-io/issues/1939
  LAYOUT_BOUNDS: new Bounds2( 0, 0, 768, 504 ),

  ATOM_NODE_OPTIONS: ATOM_NODE_OPTIONS,

  // Scale all particles (molecules and atoms) by this value to match the visual design.
  PARTICLES_SCALE_FACTOR: 0.74,

  // Preferences
  PREFERENCES_CONTROL_OPTIONS: PREFERENCES_CONTROL_OPTIONS,
  PREFERENCES_LABEL_FONT: new PhetFont( {
    size: 16,
    weight: 'bold'
  } ),
  PREFERENCES_LABEL_MAX_WIDTH: 200,
  PREFERENCES_DESCRIPTION_FONT: new PhetFont( 16 ),
  PREFERENCES_DESCRIPTION_LINE_WRAP: 500
};

balancingChemicalEquations.register( 'BCEConstants', BCEConstants );
export default BCEConstants;