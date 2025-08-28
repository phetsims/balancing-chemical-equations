// Copyright 2014-2025, University of Colorado Boulder

/**
 * BarChartsNode is the visual representation of an equation as a pair of bar charts, for left and right side of equation.
 * An indicator between the charts (equals or not equals) indicates whether they are balanced.
 * Origin is at the bottom-center of the bottom equality operator.
 *
 * @author Vasily Shakhov (mlearner.com)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import Equation from '../model/Equation.js';
import BarNode from './BarNode.js';
import EqualityOperatorNode from './EqualityOperatorNode.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import BalanceElementsNode from './BalanceElementsNode.js';
import Multilink from '../../../../axon/js/Multilink.js';

// Vertical offset of BarNode positions. Adjust this empirically so that there is no overlap.
const Y_OFFSET = BarNode.MAX_BAR_SIZE.height + 56;

// Space between the centers of bars and equality operator.
const X_SPACING = 100;

type SelfOptions = EmptySelfOptions;

type BarChartsNodeOptions = SelfOptions & PickOptional<NodeOptions, 'visibleProperty'>;

export default class BarChartsNode extends BalanceElementsNode {

  private readonly disposeBarChartsNode: () => void;

  public constructor( equationProperty: TReadOnlyProperty<Equation>, providedOptions?: BarChartsNodeOptions ) {
    super( equationProperty, providedOptions );

    this.disposeBarChartsNode = () => {
      this.getChildren().forEach( child => child.dispose() );
    };
  }

  public override dispose(): void {
    this.disposeBarChartsNode();
    super.dispose();
  }

  protected updateChildren(): void {

    // Dispose of previous Nodes.
    this.getChildren().forEach( child => child.dispose() );

    // For each entry in the reactants map...
    let i = 0;
    this.reactantsMap.forEach( ( reactantCountProperty, element ) => {

      // Get the corresponding product count Property.
      const productCountProperty = this.productsMap.get( element )!;
      assert && assert( productCountProperty,
        `missing productCountProperty for element ${element.symbol} in equation ${this.equationProperty.value.toString()}` );

      // Bars for reactants and products.
      const reactantBarNode = new BarNode( element, reactantCountProperty );
      const productBarNode = new BarNode( element, productCountProperty );

      // Equality operator.
      const elementIsBalancedProperty = new DerivedProperty( [ reactantCountProperty, productCountProperty ],
        ( reactantCount, productCount ) => ( reactantCount !== 0 ) && ( productCount !== 0 ) && ( reactantCount === productCount ) );
      const equalityOperatorNode = new EqualityOperatorNode( elementIsBalancedProperty );

      this.addChild( reactantBarNode );
      this.addChild( productBarNode );
      this.addChild( equalityOperatorNode );

      // Dynamically position the equality operator between the 2 bars.
      const bottom = i * Y_OFFSET;
      i++;
      Multilink.multilink(
        [ reactantBarNode.localBoundsProperty, productBarNode.localBoundsProperty, equalityOperatorNode.localBoundsProperty ],
        () => {
          equalityOperatorNode.centerX = 0; // x-coordinate of the origin is at the center of the equality operator.
          reactantBarNode.centerX = equalityOperatorNode.centerX - X_SPACING;
          productBarNode.centerX = equalityOperatorNode.centerX + X_SPACING;

          reactantBarNode.bottom = bottom;
          productBarNode.bottom = bottom;
          equalityOperatorNode.bottom = bottom;
        } );
    } );
  }
}

balancingChemicalEquations.register( 'BarChartsNode', BarChartsNode );