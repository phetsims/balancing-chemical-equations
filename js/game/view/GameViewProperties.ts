// Copyright 2016-2023, University of Colorado Boulder

/**
 * View-specific Properties for the 'Game' screen
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Property from '../../../../axon/js/Property.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';

export default class GameViewProperties {

  // Whether the 'Reactants' accordion box is expanded
  public readonly reactantsBoxExpandedProperty: Property<boolean>;

  // Whether the 'Products' accordion box is expanded
  public readonly productsBoxExpandedProperty: Property<boolean>;

  // Whether the game timer is enabled
  public readonly timerEnabledProperty: Property<boolean>;

  public constructor() {
    this.reactantsBoxExpandedProperty = new BooleanProperty( true );
    this.productsBoxExpandedProperty = new BooleanProperty( true );
    this.timerEnabledProperty = new BooleanProperty( false );
  }

  public reset(): void {
    this.reactantsBoxExpandedProperty.reset();
    this.productsBoxExpandedProperty.reset();
    this.timerEnabledProperty.reset();
  }
}

balancingChemicalEquations.register( 'GameViewProperties', GameViewProperties );