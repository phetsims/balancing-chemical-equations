// Copyright 2014-2025, University of Colorado Boulder

/**
 * BalanceElementsNode is the base class for ViewMode values that show how individual elements are
 * balanced. This includes 'balanceScales' and 'barCharts'.
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
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';
import isSettingPhetioStateProperty from '../../../../tandem/js/isSettingPhetioStateProperty.js';
import phetioStateSetEmitter from '../../../../tandem/js/phetioStateSetEmitter.js';

type SelfOptions = EmptySelfOptions;

export type BalanceElementsNodeOptions = SelfOptions & PickOptional<NodeOptions, 'visibleProperty'>;

export default abstract class BalanceElementsNode extends Node {

  protected readonly equationProperty: TReadOnlyProperty<Equation>;

  // maps Element to its count Property
  protected readonly reactantsMap: Map<Element, Property<number>>;
  protected readonly productsMap: Map<Element, Property<number>>;

  protected constructor( equationProperty: TReadOnlyProperty<Equation>, providedOptions?: BalanceElementsNodeOptions ) {

    const options = optionize<BalanceElementsNodeOptions, SelfOptions, NodeOptions>()( {

      // NodeOptions
      isDisposable: false
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
  protected abstract updateChildren(): void;
}

balancingChemicalEquations.register( 'BalanceElementsNode', BalanceElementsNode );