// Copyright 2014-2025, University of Colorado Boulder

/**
 * BalanceScalesNode is the visual representation of an equation as a set of balance scales, one for each atom type.
 * The left side of each scale is the reactants, the right side is the products. x = 0 is at the center of the fulcrums.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import Equation from '../model/Equation.js';
import BalanceScaleNode from './BalanceScaleNode.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import BalanceElementsNode, { BalanceElementsNodeOptions } from './BalanceElementsNode.js';

// Vertical offset of BalanceScaleNode positions. Adjust this empirically so that there is no overlap.
const Y_OFFSET = 140;

type SelfOptions = EmptySelfOptions;

type BalanceScalesNodeOptions = SelfOptions & BalanceElementsNodeOptions;

export default class BalanceScalesNode extends BalanceElementsNode {

  private readonly disposeBalanceScalesNode: () => void;

  public constructor( equationProperty: TReadOnlyProperty<Equation>, providedOptions?: BalanceScalesNodeOptions ) {

    const options = optionize<BalanceScalesNodeOptions, SelfOptions, NodeOptions>()( {

      // BalanceElementsNodeOptions
      scale: 0.85
    }, providedOptions );

    super( equationProperty, options );

    this.disposeBalanceScalesNode = () => {
      this.getChildren().forEach( child => child.dispose() );
    };
  }

  public override dispose(): void {
    this.disposeBalanceScalesNode();
    super.dispose();
  }

  /**
   * Creates child Nodes to match the current equation.
   */
  protected updateChildren(): void {

    // Dispose of previous BalanceScaleNode instances.
    this.getChildren().forEach( child => child.dispose() );

    let y = 0;

    // For each entry in the reactants map...
    this.reactantsMap.forEach( ( reactantCountProperty, element ) => {

      // Get the corresponding product count Property.
      const productCountProperty = this.productsMap.get( element )!;
      assert && assert( productCountProperty,
        `missing productCountProperty for element ${element.symbol} in equation ${this.equationProperty.value.toString()}` );

      // Add a balance scale.
      const elementIsBalancedProperty = new DerivedProperty( [ reactantCountProperty, productCountProperty ],
        ( reactantCount, productCount ) => ( reactantCount !== 0 ) && ( productCount !== 0 ) && ( reactantCount === productCount ) );
      const scaleNode = new BalanceScaleNode( element, reactantCountProperty, productCountProperty, elementIsBalancedProperty, {
        y: y
      } );
      this.addChild( scaleNode );

      y += Y_OFFSET;
    } );
  }
}

balancingChemicalEquations.register( 'BalanceScalesNode', BalanceScalesNode );