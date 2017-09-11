// Copyright 2016, University of Colorado Boulder

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
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );

  /**
   * @constructor
   */
  function IntroductionViewProperties() {

    // @public
    this.reactantsBoxExpandedProperty = new Property( true );
    this.productsBoxExpandedProperty = new Property( true );
    this.balancedRepresentationProperty = new Property( BalancedRepresentation.NONE );
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
