// Copyright 2014-2025, University of Colorado Boulder

/**
 * VBarChartsNode is the visual representation of an equation as a pair of bar charts, for left and right side of equation.
 * An indicator between the charts (equals or not equals) indicates whether they are balanced.
 *
 * @author Vasily Shakhov (mlearner.com)
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
import BarNode from './BarNode.js';
import EqualityOperatorNode from './EqualityOperatorNode.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';
import phetioStateSetEmitter from '../../../../tandem/js/phetioStateSetEmitter.js';
import isSettingPhetioStateProperty from '../../../../tandem/js/isSettingPhetioStateProperty.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import AlignGroup from '../../../../scenery/js/layout/constraints/AlignGroup.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';

type SelfOptions = EmptySelfOptions;

type VBarChartsNodeOptions = SelfOptions & PickOptional<NodeOptions, 'visibleProperty'>;

export default class VBarChartsNode extends Node {

  private readonly equationProperty: TReadOnlyProperty<Equation>;

  // maps Element to its count Property
  private readonly reactantsMap: Map<Element, Property<number>>;
  private readonly productsMap: Map<Element, Property<number>>;

  /**
   * @param equationProperty - the equation that the bar chart is representing
   * @param [providedOptions]
   */
  public constructor( equationProperty: TReadOnlyProperty<Equation>,
                      providedOptions?: VBarChartsNodeOptions ) {

    const options = optionize<VBarChartsNodeOptions, SelfOptions, NodeOptions>()( {

      // NodeOptions
      isDisposable: false
    }, providedOptions );

    super( options );

    this.equationProperty = equationProperty;

    this.reactantsMap = new Map();
    this.productsMap = new Map();

    //TODO https://github.com/phetsims/balancing-chemical-equations/issues/170 from here down is duplicated in HBalanceScalesNode and VBalanceScalesNode.

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

  //TODO https://github.com/phetsims/balancing-chemical-equations/issues/170 updateCounts is duplicated in HBalanceScalesNode and VBalanceScalesNode.
  /**
   * Updates the counts for each element involved in the equation.
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

  //TODO https://github.com/phetsims/balancing-chemical-equations/issues/170 updateCountProperties is duplicated in HBalanceScalesNode and VBalanceScalesNode.
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

  private updateChildren(): void {

    // Dispose of previous Nodes.
    this.getChildren().forEach( child => child.dispose() );

    // Make all BarNode instances have the same effective width.
    //TODO https://github.com/phetsims/balancing-chemical-equations/issues/170 This does not prevent layout from shifting when a BarNode displays arrow.
    const barNodeAlignGroup = new AlignGroup( {
      matchHorizontal: true,
      matchVertical: false
    } );

    // For each entry in the reactants map...
    let i = 0;
    this.reactantsMap.forEach( ( reactantCountProperty, element ) => {

      // Get the corresponding product count Property.
      const productCountProperty = this.productsMap.get( element )!;
      assert && assert( productCountProperty,
        `missing productCountProperty for element ${element.symbol} in equation ${this.equationProperty.value.toString()}` );

      // Add a row with 2 bar charts, separated by an equality operator.
      const rowNode = new RowNode( element, reactantCountProperty, productCountProperty, barNodeAlignGroup );
      this.addChild( rowNode );

      // Position the rowNode as it changes size.
      const bottom = i * ( BarNode.MAX_BAR_SIZE.height + 60 ); //TODO https://github.com/phetsims/balancing-chemical-equations/issues/170 magic numbers
      i++;
      rowNode.boundsProperty.link( () => {
        rowNode.bottom = bottom;
      } );
    } );
  }
}

class RowNode extends HBox {

  public constructor( element: Element,
                      reactantCountProperty: TReadOnlyProperty<number>,
                      productCountProperty: TReadOnlyProperty<number>,
                      barNodeAlignGroup: AlignGroup ) {

    const reactantBarNode = new BarNode( element, reactantCountProperty );
    const productBarNode = new BarNode( element, productCountProperty );

    const elementIsBalancedProperty = new DerivedProperty( [ reactantCountProperty, productCountProperty ],
      ( reactantCount, productCount ) => ( reactantCount !== 0 ) && ( productCount !== 0 ) && ( reactantCount === productCount ) );
    const equalityOperatorNode = new EqualityOperatorNode( elementIsBalancedProperty );
    equalityOperatorNode.setScaleMagnitude( 0.5 );

    super( {
      children: [ barNodeAlignGroup.createBox( reactantBarNode ), barNodeAlignGroup.createBox( equalityOperatorNode ), productBarNode ],
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

balancingChemicalEquations.register( 'VBarChartsNode', VBarChartsNode );