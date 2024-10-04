// Copyright 2016-2024, University of Colorado Boulder

/**
 * View-specific Properties for the 'Intro' screen
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Property from '../../../../axon/js/Property.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import { BalancedRepresentation, BalancedRepresentationValues } from '../../common/model/BalancedRepresentation.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import StringUnionProperty from '../../../../axon/js/StringUnionProperty.js';

export default class IntroViewProperties {

  // Whether the 'Reactants' accordion box is expanded
  public readonly reactantsBoxExpandedProperty: Property<boolean>;

  // Whether the 'Products' accordion box is expanded
  public readonly productsBoxExpandedProperty: Property<boolean>;

  // Which representation for 'balanced' is chosen from the combo box
  public readonly balancedRepresentationProperty: StringUnionProperty<BalancedRepresentation>;

  public constructor( tandem: Tandem ) {

    this.reactantsBoxExpandedProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'reactantsBoxExpandedProperty' )
    } );

    this.productsBoxExpandedProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'productsBoxExpandedProperty' )
    } );

    this.balancedRepresentationProperty = new StringUnionProperty( 'none', {
      validValues: BalancedRepresentationValues,
      tandem: tandem.createTandem( 'balancedRepresentationProperty' )
    } );
  }

  public reset(): void {
    this.reactantsBoxExpandedProperty.reset();
    this.productsBoxExpandedProperty.reset();
    this.balancedRepresentationProperty.reset();
  }
}

balancingChemicalEquations.register( 'IntroViewProperties', IntroViewProperties );