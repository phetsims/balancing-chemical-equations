// Copyright 2016-2018, University of Colorado Boulder

/**
 * View-specific Properties for the 'Introduction' screen
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var BalancedRepresentation = require( 'BALANCING_CHEMICAL_EQUATIONS/common/model/BalancedRepresentation' );
  var balancingChemicalEquations = require( 'BALANCING_CHEMICAL_EQUATIONS/balancingChemicalEquations' );
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var inherit = require( 'PHET_CORE/inherit' );
  var StringProperty = require( 'AXON/StringProperty' );

  /**
   * @constructor
   */
  function IntroductionViewProperties() {

    // @public
    this.reactantsBoxExpandedProperty = new BooleanProperty( true );
    this.productsBoxExpandedProperty = new BooleanProperty( true );
    this.balancedRepresentationProperty = new StringProperty( BalancedRepresentation.NONE );
  }

  balancingChemicalEquations.register( 'IntroductionViewProperties', IntroductionViewProperties );

  return inherit( Object, IntroductionViewProperties, {

    // @public
    reset: function() {
      this.reactantsBoxExpandedProperty.reset();
      this.productsBoxExpandedProperty.reset();
      this.balancedRepresentationProperty.reset();
    }
  } );
} );
