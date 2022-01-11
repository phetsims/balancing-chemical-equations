// Copyright 2016-2021, University of Colorado Boulder

/**
 * View-specific Properties for the 'Introduction' screen
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import EnumerationDeprecatedProperty from '../../../../axon/js/EnumerationDeprecatedProperty.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import BalancedRepresentation from '../../common/model/BalancedRepresentation.js';

class IntroductionViewProperties {

  constructor() {

    // @public
    this.reactantsBoxExpandedProperty = new BooleanProperty( true );
    this.productsBoxExpandedProperty = new BooleanProperty( true );
    this.balancedRepresentationProperty = new EnumerationDeprecatedProperty( BalancedRepresentation, BalancedRepresentation.NONE );
  }

  // @public
  reset() {
    this.reactantsBoxExpandedProperty.reset();
    this.productsBoxExpandedProperty.reset();
    this.balancedRepresentationProperty.reset();
  }
}

balancingChemicalEquations.register( 'IntroductionViewProperties', IntroductionViewProperties );
export default IntroductionViewProperties;