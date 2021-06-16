[object Promise]

/**
 * View-specific Properties for the 'Introduction' screen
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import BalancedRepresentation from '../../common/model/BalancedRepresentation.js';

class IntroductionViewProperties {

  constructor() {

    // @public
    this.reactantsBoxExpandedProperty = new BooleanProperty( true );
    this.productsBoxExpandedProperty = new BooleanProperty( true );
    this.balancedRepresentationProperty = new EnumerationProperty( BalancedRepresentation, BalancedRepresentation.NONE );
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