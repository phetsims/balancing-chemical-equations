// Copyright 2014-2025, University of Colorado Boulder

/**
 * BalanceScalesNode is the visual representation of an equation as a set of balance scales, one for each atom type.
 * The left side of each scale is the reactants, the right side is the products.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Element from '../../../../nitroglycerin/js/Element.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Node, { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import Equation from '../model/Equation.js';
import BalanceScaleNode from './BalanceScaleNode.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';
import isSettingPhetioStateProperty from '../../../../tandem/js/isSettingPhetioStateProperty.js';
import phetioStateSetEmitter from '../../../../tandem/js/phetioStateSetEmitter.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';

// Vertical offset of BalanceScaleNode positions. Adjust this empirically so that there is no overlap.
const Y_OFFSET = 140;

type SelfOptions = EmptySelfOptions;

type BalanceScalesNodeOptions = SelfOptions & PickOptional<NodeOptions, 'visibleProperty'>;

export default class BalanceScalesNode extends Node {

  private readonly equationProperty: TReadOnlyProperty<Equation>;

  // maps Element to its count Property
  private readonly reactantsMap: Map<Element, Property<number>>;
  private readonly productsMap: Map<Element, Property<number>>;

  /**
   * @param equationProperty the equation that the scales are representing
   * @param [providedOptions]
   */
  public constructor( equationProperty: TReadOnlyProperty<Equation>,
                      providedOptions?: BalanceScalesNodeOptions ) {

    const options = optionize<BalanceScalesNodeOptions, SelfOptions, NodeOptions>()( {

      // NodeOptions
      isDisposable: false,
      scale: 0.85
    }, providedOptions );

    super( options );

    this.equationProperty = equationProperty;

    this.reactantsMap = new Map();
    this.productsMap = new Map();

    // When coefficients change, update counts only after PhET-iO state has been fully restored. Otherwise, we'll
    // be using reactionMap and productsMap for the old equation because equationProperty will not have fired yet.
    // See https://github.com/phetsims/balancing-chemical-equations/issues/174#issuecomment-2769573393.
    const coefficientsListener = () => {
      if ( !isSettingPhetioStateProperty.value ) {
        this.updateCounts();
      }
    };
    phetioStateSetEmitter.addListener( () => this.updateCounts() );

    equationProperty.link( ( newEquation, oldEquation ) => {

      // Wire coefficients listener to the current equation.
      oldEquation && oldEquation.unlinkCoefficientProperties( coefficientsListener );
      newEquation.lazyLinkCoefficientProperties( coefficientsListener );

      // Create count Properties to match the new equation.
      this.updateCountProperties();

      // Create child Nodes to match the new equation.
      this.updateChildren();
    } );
  }

  /**
   * Updates the count Properties for each element involved in the equation.
   */
  private updateCounts(): void {
    const equation = this.equationProperty.value;
    const atomCounts = equation.getAtomCounts();
    atomCounts.forEach( atomCount => {

      const reactantCountProperty = this.reactantsMap.get( atomCount.element )!;
      assert && assert( reactantCountProperty,
        `missing reactantCountProperty for element ${atomCount.element.symbol} in equation ${equation.toString()}` );
      reactantCountProperty.value = atomCount.reactantsCount;

      const productCountProperty = this.productsMap.get( atomCount.element )!;
      assert && assert( productCountProperty,
        `missing productCountProperty for element ${atomCount.element.symbol} in equation ${equation.toString()}` );
      productCountProperty.value = atomCount.productsCount;
    } );
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

    // For each atom...
    atomCounts.forEach( atomCount => {

      // Populate the maps.
      const leftCountProperty = new NumberProperty( atomCount.reactantsCount, { numberType: 'Integer' } );
      const rightCountProperty = new NumberProperty( atomCount.productsCount, { numberType: 'Integer' } );
      this.reactantsMap.set( atomCount.element, leftCountProperty );
      this.productsMap.set( atomCount.element, rightCountProperty );
    } );
  }

  /**
   * Creates child Nodes to match the current equation.
   */
  private updateChildren(): void {

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