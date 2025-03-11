// Copyright 2016-2024, University of Colorado Boulder

/**
 * GameViewProperties is the set of view-specific Properties for the 'Game' screen
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Property from '../../../../axon/js/Property.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';

export default class GameViewProperties {

  // Whether the 'Reactants' accordion box is expanded
  public readonly reactantsAccordionBoxExpandedProperty: Property<boolean>;

  // Whether the 'Products' accordion box is expanded
  public readonly productsAccordionBoxExpandedProperty: Property<boolean>;

  // Whether the game timer is enabled
  public readonly timerEnabledProperty: Property<boolean>;

  public constructor( tandem: Tandem ) {

    this.reactantsAccordionBoxExpandedProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'reactantsAccordionBoxExpandedProperty' ),
      phetioFeatured: true,
      phetioReadOnly: true
    } );

    this.productsAccordionBoxExpandedProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'productsAccordionBoxExpandedProperty' ),
      phetioFeatured: true,
      phetioReadOnly: true
    } );

    this.timerEnabledProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'timerEnabledProperty' ),
      phetioFeatured: true
    } );
  }

  public reset(): void {
    this.reactantsAccordionBoxExpandedProperty.reset();
    this.productsAccordionBoxExpandedProperty.reset();
    this.timerEnabledProperty.reset();
  }
}

balancingChemicalEquations.register( 'GameViewProperties', GameViewProperties );