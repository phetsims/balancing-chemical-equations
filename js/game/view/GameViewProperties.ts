// Copyright 2016-2023, University of Colorado Boulder

/**
 * View-specific Properties for the 'Game' screen
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Property from '../../../../axon/js/Property.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import Tandem from '../../../../tandem/js/Tandem.js';

export default class GameViewProperties {

  // Whether the 'Reactants' accordion box is expanded
  public readonly reactantsBoxExpandedProperty: Property<boolean>;

  // Whether the 'Products' accordion box is expanded
  public readonly productsBoxExpandedProperty: Property<boolean>;

  // Whether the game timer is enabled
  public readonly timerEnabledProperty: Property<boolean>;

  public constructor( tandem: Tandem ) {

    this.reactantsBoxExpandedProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'reactantsBoxExpandedProperty' )
    } );

    this.productsBoxExpandedProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'productsBoxExpandedProperty' )
    } );

    this.timerEnabledProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'timerEnabledProperty' )
    } );
  }

  public reset(): void {
    this.reactantsBoxExpandedProperty.reset();
    this.productsBoxExpandedProperty.reset();
    this.timerEnabledProperty.reset();
  }
}

balancingChemicalEquations.register( 'GameViewProperties', GameViewProperties );