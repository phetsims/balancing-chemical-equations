// Copyright 2025, University of Colorado Boulder

/**
 * EquationsViewProperties is the set of view-specific Properties for the 'Equations' screen
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import StringUnionProperty from '../../../../axon/js/StringUnionProperty.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import { BalancedRepresentation, BalancedRepresentationValues } from '../../common/model/BalancedRepresentation.js';

export default class EquationsViewProperties {
  
  // The representation for 'balanced' that is chosen from the Tools combo box.
  public readonly balancedRepresentationProperty: StringUnionProperty<BalancedRepresentation>;

  public constructor( tandem: Tandem ) {

    this.balancedRepresentationProperty = new StringUnionProperty( 'balanceScales', {
      validValues: BalancedRepresentationValues,
      tandem: tandem.createTandem( 'balancedRepresentationProperty' ),
      phetioFeatured: true
    } );
  }

  public reset(): void {
    this.balancedRepresentationProperty.reset();
  }
}

balancingChemicalEquations.register( 'EquationsViewProperties', EquationsViewProperties );