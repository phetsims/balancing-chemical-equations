// Copyright 2016-2018, University of Colorado Boulder

/**
 * View-specific Properties for the 'Introduction' screen
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const BalancedRepresentation = require( 'BALANCING_CHEMICAL_EQUATIONS/common/model/BalancedRepresentation' );
  const balancingChemicalEquations = require( 'BALANCING_CHEMICAL_EQUATIONS/balancingChemicalEquations' );
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const inherit = require( 'PHET_CORE/inherit' );
  const StringProperty = require( 'AXON/StringProperty' );

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
