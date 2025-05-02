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
import { ViewMode, ViewModeValues } from '../../common/model/ViewMode.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import optionize from '../../../../phet-core/js/optionize.js';

type SelfOptions = {

  // Initial value of viewModeProperty.
  viewMode?: ViewMode;
};

type IntroViewPropertiesOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class IntroViewProperties {

  // Whether the 'Reactants' accordion box is expanded
  public readonly reactantsAccordionBoxExpandedProperty: Property<boolean>;

  // Whether the 'Products' accordion box is expanded
  public readonly productsAccordionBoxExpandedProperty: Property<boolean>;

  // Choices in the Views combo box.
  public readonly viewModeProperty: StringUnionProperty<ViewMode>;

  public constructor( providedOptions: IntroViewPropertiesOptions ) {

    const options = optionize<IntroViewPropertiesOptions, SelfOptions, PhetioObjectOptions>()( {

      // SelfOptions
      viewMode: 'particles'
    }, providedOptions );

    this.reactantsAccordionBoxExpandedProperty = new BooleanProperty( true, {
      tandem: options.tandem.createTandem( 'reactantsAccordionBoxExpandedProperty' ),
      phetioFeatured: true
    } );

    this.productsAccordionBoxExpandedProperty = new BooleanProperty( true, {
      tandem: options.tandem.createTandem( 'productsAccordionBoxExpandedProperty' ),
      phetioFeatured: true
    } );

    this.viewModeProperty = new StringUnionProperty( options.viewMode, {
      validValues: ViewModeValues,
      tandem: options.tandem.createTandem( 'viewModeProperty' ),
      phetioDocumentation: 'Choices in the View combo box.',
      phetioFeatured: true
    } );
  }

  public reset(): void {
    this.reactantsAccordionBoxExpandedProperty.reset();
    this.productsAccordionBoxExpandedProperty.reset();
    this.viewModeProperty.reset();
  }
}

balancingChemicalEquations.register( 'IntroViewProperties', IntroViewProperties );