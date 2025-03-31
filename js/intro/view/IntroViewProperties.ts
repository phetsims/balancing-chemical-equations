// Copyright 2016-2025, University of Colorado Boulder

/**
 * IntroViewProperties is the set of view-specific Properties for the 'Intro' screen
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Property from '../../../../axon/js/Property.js';
import StringUnionProperty from '../../../../axon/js/StringUnionProperty.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import { BalancedRepresentation } from '../../common/model/BalancedRepresentation.js';

export default class IntroViewProperties {

  // Whether the 'Reactants' accordion box is expanded
  public readonly reactantsAccordionBoxExpandedProperty: Property<boolean>;

  // Whether the 'Products' accordion box is expanded
  public readonly productsAccordionBoxExpandedProperty: Property<boolean>;

  // The representation for 'balanced' that is chosen from the Tools combo box.
  public readonly balancedRepresentationProperty: StringUnionProperty<BalancedRepresentation>;

  public constructor( tandem: Tandem ) {

    this.reactantsAccordionBoxExpandedProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'reactantsAccordionBoxExpandedProperty' ),
      phetioFeatured: true
    } );

    this.productsAccordionBoxExpandedProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'productsAccordionBoxExpandedProperty' ),
      phetioFeatured: true
    } );

    //TODO https://github.com/phetsims/balancing-chemical-equations/issues/170 Add 'molecules' to Intro screen?
    this.balancedRepresentationProperty = new StringUnionProperty<BalancedRepresentation>( 'none', {
      validValues: [ 'balanceScales', 'barChart', 'none' ],
      tandem: tandem.createTandem( 'balancedRepresentationProperty' ),
      phetioFeatured: true
    } );
  }

  public reset(): void {
    this.reactantsAccordionBoxExpandedProperty.reset();
    this.productsAccordionBoxExpandedProperty.reset();
    this.balancedRepresentationProperty.reset();
  }
}

balancingChemicalEquations.register( 'IntroViewProperties', IntroViewProperties );