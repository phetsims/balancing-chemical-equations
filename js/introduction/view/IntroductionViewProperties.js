// Copyright 2016-2019, University of Colorado Boulder

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
  const StringProperty = require( 'AXON/StringProperty' );

  class IntroductionViewProperties {

    constructor() {

      // @public
      this.reactantsBoxExpandedProperty = new BooleanProperty( true );
      this.productsBoxExpandedProperty = new BooleanProperty( true );
      this.balancedRepresentationProperty = new StringProperty( BalancedRepresentation.NONE );
    }

    // @public
    reset() {
      this.reactantsBoxExpandedProperty.reset();
      this.productsBoxExpandedProperty.reset();
      this.balancedRepresentationProperty.reset();
    }
  }

  return balancingChemicalEquations.register( 'IntroductionViewProperties', IntroductionViewProperties );
} );
