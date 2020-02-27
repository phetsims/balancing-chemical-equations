// Copyright 2016-2020, University of Colorado Boulder

/**
 * View-specific Properties for the 'Game' screen
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const balancingChemicalEquations = require( 'BALANCING_CHEMICAL_EQUATIONS/balancingChemicalEquations' );
  const BooleanProperty = require( 'AXON/BooleanProperty' );

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

  return balancingChemicalEquations.register( 'GameViewProperties', GameViewProperties );
} );
