// Copyright 2016-2018, University of Colorado Boulder

/**
 * View-specific Properties for the 'Game' screen
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var balancingChemicalEquations = require( 'BALANCING_CHEMICAL_EQUATIONS/balancingChemicalEquations' );
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   * @constructor
   */
  function GameViewProperties() {

    // @public
    this.soundEnabledProperty = new BooleanProperty( true );
    this.timerEnabledProperty = new BooleanProperty( false );
    this.reactantsBoxExpandedProperty = new BooleanProperty( true );
    this.productsBoxExpandedProperty = new BooleanProperty( true );
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
