// Copyright 2016-2021, University of Colorado Boulder

/**
 * View-specific Properties for the 'Game' screen
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';

class GameViewProperties {

  constructor() {

    // @public
    this.timerEnabledProperty = new BooleanProperty( false );
    this.reactantsBoxExpandedProperty = new BooleanProperty( true );
    this.productsBoxExpandedProperty = new BooleanProperty( true );
  }

  // @public
  reset() {
    this.timerEnabledProperty.reset();
    this.reactantsBoxExpandedProperty.reset();
    this.productsBoxExpandedProperty.reset();
  }
}

balancingChemicalEquations.register( 'GameViewProperties', GameViewProperties );
export default GameViewProperties;