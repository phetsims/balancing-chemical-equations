// Copyright 2016-2025, University of Colorado Boulder

/**
 * IntroViewProperties is the set of view-specific Properties for the 'Intro' screen
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Property from '../../../../axon/js/Property.js';
import StringUnionProperty from '../../../../axon/js/StringUnionProperty.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import { BalancedRepresentation, BalancedRepresentationValues } from '../../common/model/BalancedRepresentation.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import optionize from '../../../../phet-core/js/optionize.js';

type SelfOptions = {

  // Initial value of balancedRepresentationProperty.
  balancedRepresentation?: BalancedRepresentation;
};

type IntroViewPropertiesOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class IntroViewProperties {

  // Whether the 'Reactants' accordion box is expanded
  public readonly reactantsAccordionBoxExpandedProperty: Property<boolean>;

  // Whether the 'Products' accordion box is expanded
  public readonly productsAccordionBoxExpandedProperty: Property<boolean>;

  // The representation for 'balanced' that is chosen from ViewsComboBox.
  public readonly balancedRepresentationProperty: StringUnionProperty<BalancedRepresentation>;

  public constructor( providedOptions: IntroViewPropertiesOptions ) {

    const options = optionize<IntroViewPropertiesOptions, SelfOptions, PhetioObjectOptions>()( {

      // SelfOptions
      balancedRepresentation: 'particles'
    }, providedOptions );

    this.reactantsAccordionBoxExpandedProperty = new BooleanProperty( true, {
      tandem: options.tandem.createTandem( 'reactantsAccordionBoxExpandedProperty' ),
      phetioFeatured: true
    } );

    this.productsAccordionBoxExpandedProperty = new BooleanProperty( true, {
      tandem: options.tandem.createTandem( 'productsAccordionBoxExpandedProperty' ),
      phetioFeatured: true
    } );

    this.balancedRepresentationProperty = new StringUnionProperty( options.balancedRepresentation, {
      validValues: BalancedRepresentationValues,
      tandem: options.tandem.createTandem( 'balancedRepresentationProperty' ),
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