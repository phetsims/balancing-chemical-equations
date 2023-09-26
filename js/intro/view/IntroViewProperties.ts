// Copyright 2016-2023, University of Colorado Boulder

/**
 * View-specific Properties for the 'Intro' screen
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import Property from '../../../../axon/js/Property.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import BalancedRepresentation from '../../common/model/BalancedRepresentation.js';

export default class IntroViewProperties {

  // Whether the 'Reactants' accordion box is expanded
  public readonly reactantsBoxExpandedProperty: Property<boolean>;

  // Whether the 'Products' accordion box is expanded
  public readonly productsBoxExpandedProperty: Property<boolean>;

  // Which representation for 'balanced' is chosen from the combo box
  public readonly balancedRepresentationProperty: EnumerationProperty<BalancedRepresentation>;

  public constructor() {
    this.reactantsBoxExpandedProperty = new BooleanProperty( true );
    this.productsBoxExpandedProperty = new BooleanProperty( true );
    this.balancedRepresentationProperty = new EnumerationProperty( BalancedRepresentation.NONE );
  }

  public reset(): void {
    this.reactantsBoxExpandedProperty.reset();
    this.productsBoxExpandedProperty.reset();
    this.balancedRepresentationProperty.reset();
  }
}

balancingChemicalEquations.register( 'IntroViewProperties', IntroViewProperties );