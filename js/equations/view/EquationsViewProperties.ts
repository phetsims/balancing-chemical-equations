// Copyright 2025, University of Colorado Boulder

/**
 * EquationsViewProperties is the set of view-specific Properties for the 'Equations' screen. This is identical
 * to IntroViewProperties and is provided only for completeness.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import IntroViewProperties from '../../intro/view/IntroViewProperties.js';

export default class EquationsViewProperties extends IntroViewProperties {

  public constructor( tandem: Tandem ) {
    super( tandem );
  }
}

balancingChemicalEquations.register( 'EquationsViewProperties', EquationsViewProperties );