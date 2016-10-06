// Copyright 2016, University of Colorado Boulder

/**
 * View-specific Properties for the 'Game' screen
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var balancingChemicalEquations = require( 'BALANCING_CHEMICAL_EQUATIONS/balancingChemicalEquations' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );

  /**
   * @constructor
   */
  function GameViewProperties() {

    // @public
    this.soundEnabledProperty = new Property( true );
    this.timerEnabledProperty = new Property( false );
    this.reactantsBoxExpandedProperty = new Property( true );
    this.productsBoxExpandedProperty = new Property( true );
  }

  balancingChemicalEquations.register( 'GameViewProperties', GameViewProperties );

  return inherit( Object, GameViewProperties, {

    // @public
    reset: function() {
      this.soundEnabledProperty.reset();
      this.timerEnabledProperty.reset();
      this.reactantsBoxExpandedProperty.reset();
      this.productsBoxExpandedProperty.reset();
    }
  } );
} );
