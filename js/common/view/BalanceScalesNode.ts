// Copyright 2014-2025, University of Colorado Boulder

/**
 * BalanceScalesNode is the visual representation of an equation as a set of balance scales, one for each atom type.
 * The left side of each scale is the reactants, the right side is the products.
 *
 * This implementation is very brute force, just about everything is recreated each time a coefficient is changed in
 * the equations.  But we have a small number of coefficients, and nothing else is happening in the sim.  So we're
 * trading efficiency for simplicity of implementation.
 *
 * @author Vasily Shakhov (mlearner.com)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Element from '../../../../nitroglycerin/js/Element.js';
import optionize from '../../../../phet-core/js/optionize.js';
import Node, { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import Equation from '../model/Equation.js';
import BalanceScaleNode from './BalanceScaleNode.js';
import HorizontalAligner from './HorizontalAligner.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';

type Orientation = 'horizontal' | 'vertical';

type SelfOptions = {

  orientation?: Orientation;

  // horizontal spacing between the tips of 2 fulcrums
  // see https://github.com/phetsims/balancing-chemical-equations/issues/91
  twoFulcrumsXSpacing?: number;

  // horizontal spacing between the tips of 3 fulcrums
  threeFulcrumsXSpacing?: number;
};

type BalanceScalesNodeOptions = SelfOptions & PickOptional<NodeOptions, 'visibleProperty'>;

export default class BalanceScalesNode extends Node {

  private readonly equationProperty: TReadOnlyProperty<Equation>;
  private readonly aligner: HorizontalAligner;
  private readonly orientation: Orientation;

  private readonly constantBottom: number;
  private readonly twoFulcrumsXSpacing: number;
  private readonly threeFulcrumsXSpacing: number;

  // maps Element to its count Property
  private readonly reactantsMap: Map<Element, Property<number>>;
  private readonly productsMap: Map<Element, Property<number>>;

  /**
   * @param equationProperty the equation that the scales are representing
   * @param aligner provides layout information to ensure horizontal alignment with other user-interface elements
   * @param [providedOptions]
   */
  public constructor( equationProperty: TReadOnlyProperty<Equation>,
                      aligner: HorizontalAligner,
                      providedOptions?: BalanceScalesNodeOptions ) {

    const options = optionize<BalanceScalesNodeOptions, SelfOptions, NodeOptions>()( {

      // SelfOptions
      orientation: 'horizontal',
      twoFulcrumsXSpacing: 237,
      threeFulcrumsXSpacing: 237,

      // NodeOptions
      isDisposable: false,
      bottom: 0
    }, providedOptions );

    super( options );

    this.equationProperty = equationProperty;
    this.aligner = aligner;
    this.orientation = options.orientation;

    this.constantBottom = options.bottom;
    this.twoFulcrumsXSpacing = options.twoFulcrumsXSpacing;
    this.threeFulcrumsXSpacing = options.threeFulcrumsXSpacing;

    this.reactantsMap = new Map();
    this.productsMap = new Map();

    // Wire coefficients listener to current equation.
    const coefficientsListener = () => this.updateCounts();
    equationProperty.link( ( newEquation, oldEquation ) => {

      // Create count Properties to match the new equation.
      this.updateCountProperties();

      // Create child Nodes to match the new equation.
      this.updateChildren();

      // Wire coefficients listener to the current equation.
      oldEquation && oldEquation.unlinkCoefficientProperties( coefficientsListener );
      newEquation.lazyLinkCoefficientProperties( coefficientsListener );
    } );
  }

  /**
   * Creates child Nodes to match the current equation.
   */
  private updateChildren(): void {

    // Dispose of previous BalanceScaleNode instances.
    this.getChildren().forEach( child => child.dispose() );

    let x = 0;
    let y = 0;
    const atomCounts = this.equationProperty.value.getAtomCounts();

    // For each entry in the reactants map...
    this.reactantsMap.forEach( ( reactantCountProperty, element ) => {

      // Get the corresponding product count Property.
      const productCountProperty = this.productsMap.get( element )!;
      assert && assert( productCountProperty,
        `missing productCountProperty for element ${element.symbol} in equation ${this.equationProperty.value.toString()}` );

      // Add a balance scale.
      const scaleNodeOptions = this.orientation === 'horizontal' ? { x: x } : { y: y };
      const scaleNode = new BalanceScaleNode( element, reactantCountProperty, productCountProperty, this.equationProperty.value.isBalancedProperty, scaleNodeOptions );
      this.addChild( scaleNode );

      x += ( atomCounts.length === 2 ) ? this.twoFulcrumsXSpacing : this.threeFulcrumsXSpacing;
      y += 140; //TODO https://github.com/phetsims/balancing-chemical-equations/issues/170 magic numbers
    } );

    this.centerX = this.aligner.getScreenCenterX();
    this.bottom = this.constantBottom;
  }

  /**
   * Creates count Properties for each element involved in the equation.
   */
  private updateCountProperties(): void {

    // Clear the maps.
    this.reactantsMap.clear();
    this.productsMap.clear();

    // Get the current counts.
    const atomCounts = this.equationProperty.value.getAtomCounts();

    // For each element...
    atomCounts.forEach( atomCount => {

      // Populate the maps.
      const leftCountProperty = new NumberProperty( atomCount.reactantsCount, { numberType: 'Integer' } );
      const rightCountProperty = new NumberProperty( atomCount.productsCount, { numberType: 'Integer' } );
      this.reactantsMap.set( atomCount.element, leftCountProperty );
      this.productsMap.set( atomCount.element, rightCountProperty );
    } );
  }

  /**
   * Updates the count Properties for each element involved in the equation.
   */
  private updateCounts(): void {
    const atomCounts = this.equationProperty.value.getAtomCounts();
    atomCounts.forEach( atomCount => {

      const reactantCountProperty = this.reactantsMap.get( atomCount.element )!;
      assert && assert( reactantCountProperty,
        `missing reactantCountProperty for element ${atomCount.element.symbol} in equation ${this.equationProperty.value.toString()}` );
      reactantCountProperty.value = atomCount.reactantsCount;

      const productCountProperty = this.productsMap.get( atomCount.element )!;
      assert && assert( productCountProperty,
        `missing productCountProperty for element ${atomCount.element.symbol} in equation ${this.equationProperty.value.toString()}` );
      productCountProperty.value = atomCount.productsCount;
    } );
  }
}

balancingChemicalEquations.register( 'BalanceScalesNode', BalanceScalesNode );