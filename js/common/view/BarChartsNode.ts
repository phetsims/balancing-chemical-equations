// Copyright 2014-2025, University of Colorado Boulder

/**
 * BarChartsNode is the visual representation of an equation as a pair of bar charts, for left and right side of equation.
 * An indicator between the charts (equals or not equals) indicates whether they are balanced.
 *
 * @author Vasily Shakhov (mlearner.com)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Element from '../../../../nitroglycerin/js/Element.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import Equation from '../model/Equation.js';
import BarNode from './BarNode.js';
import EqualityOperatorNode from './EqualityOperatorNode.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import BalanceElementsNode from './BalanceElementsNode.js';

// Vertical offset of BarNode positions. Adjust this empirically so that there is no overlap.
const Y_OFFSET = BarNode.MAX_BAR_SIZE.height + 56;

type SelfOptions = EmptySelfOptions;

type BarChartsNodeOptions = SelfOptions & PickOptional<NodeOptions, 'visibleProperty'>;

export default class BarChartsNode extends BalanceElementsNode {

  public constructor( equationProperty: TReadOnlyProperty<Equation>, providedOptions?: BarChartsNodeOptions ) {
    super( equationProperty, providedOptions );
  }

  //TODO https://github.com/phetsims/balancing-chemical-equations/issues/170 Layout shifts when a BarNode has an arrow head.
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

      // Add a row with 2 bar charts, separated by an equality operator.
      const rowNode = new RowNode( element, reactantCountProperty, productCountProperty );
      this.addChild( rowNode );

      // Position the rowNode as it changes size.
      const bottom = i * Y_OFFSET;
      i++;
      rowNode.boundsProperty.link( () => {
        rowNode.bottom = bottom;
      } );
    } );
  }
}

/**
 * RowNode is a pair of BarChartNodes for one element, separated by an equality operator.
 */
class RowNode extends HBox {

  public constructor( element: Element,
                      reactantCountProperty: TReadOnlyProperty<number>,
                      productCountProperty: TReadOnlyProperty<number> ) {

    const reactantBarNode = new BarNode( element, reactantCountProperty );
    const productBarNode = new BarNode( element, productCountProperty );

    const elementIsBalancedProperty = new DerivedProperty( [ reactantCountProperty, productCountProperty ],
      ( reactantCount, productCount ) => ( reactantCount !== 0 ) && ( productCount !== 0 ) && ( reactantCount === productCount ) );
    const equalityOperatorNode = new EqualityOperatorNode( elementIsBalancedProperty );
    equalityOperatorNode.setScaleMagnitude( 0.5 );

    super( {
      children: [ reactantBarNode, equalityOperatorNode, productBarNode ],
      spacing: 50,
      align: 'bottom'
    } );

    this.disposeEmitter.addListener( () => {
      reactantBarNode.dispose();
      productBarNode.dispose();
      equalityOperatorNode.dispose();
    } );
  }
}

balancingChemicalEquations.register( 'BarChartsNode', BarChartsNode );