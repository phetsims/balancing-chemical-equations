// Copyright 2014-2025, University of Colorado Boulder

/**
 * HBarChartNode is the visual representation of an equation as a pair of bar charts, for left and right side of equation.
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
import Equation from '../model/Equation.js';
import BarNode from './BarNode.js';
import EqualityOperatorNode from './EqualityOperatorNode.js';
import HorizontalAligner from './HorizontalAligner.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';
import phetioStateSetEmitter from '../../../../tandem/js/phetioStateSetEmitter.js';
import isSettingPhetioStateProperty from '../../../../tandem/js/isSettingPhetioStateProperty.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';


type SelfOptions = EmptySelfOptions;

type HBarChartNodeOptions = SelfOptions & PickOptional<NodeOptions, 'visibleProperty'>;

export default class HBarChartNode extends Node {

  private readonly equationProperty: TReadOnlyProperty<Equation>;
  private readonly aligner: HorizontalAligner;

  // maps Element to its count Property
  private readonly reactantsMap: Map<Element, Property<number>>;
  private readonly productsMap: Map<Element, Property<number>>;

  // UI subcomponents
  private readonly reactantBarsParent: Node;
  private readonly productBarsParent: Node;
  private readonly equalityOperatorParent: Node;

  /**
   * @param equationProperty - the equation that the bar chart is representing
   * @param aligner - provides layout information to ensure horizontal alignment with other user-interface elements
   * @param [providedOptions]
   */
  public constructor( equationProperty: TReadOnlyProperty<Equation>,
                      aligner: HorizontalAligner,
                      providedOptions?: HBarChartNodeOptions ) {

    const reactantBarsParent = new Node();
    const productBarsParent = new Node();
    const equalityOperatorParent = new Node();

    const options = optionize<HBarChartNodeOptions, SelfOptions, NodeOptions>()( {

      // NodeOptions
      isDisposable: false,
      children: [ reactantBarsParent, productBarsParent, equalityOperatorParent ]
    }, providedOptions );

    super( options );

    this.equationProperty = equationProperty;
    this.aligner = aligner;

    this.reactantsMap = new Map();
    this.productsMap = new Map();

    this.reactantBarsParent = reactantBarsParent;
    this.productBarsParent = productBarsParent;
    this.equalityOperatorParent = equalityOperatorParent;

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

  /**
   * Creates child Nodes to match the current equation.
   */
  private updateChildren(): void {

    // reactant bars
    this.updateBars(
      this.reactantsMap,
      this.reactantBarsParent,
      this.aligner.getReactantsBoxCenterX()
    );

    // product bars
    this.updateBars(
      this.productsMap,
      this.productBarsParent,
      this.aligner.getProductsBoxCenterX()
    );

    // equality operator
    this.updateEqualityOperator();
  }

  /**
   * Creates new BarNodes for one side of the equation.
   * @param countProperties - map of Element to count for that Element
   * @param parentNode - parent for the BarNode instances
   * @param centerX - centerX of the chart
   */
  private updateBars( countProperties: Map<Element, Property<number>>,
                      parentNode: Node,
                      centerX: number ): void {

    // Dispose of previous BarNode instances.
    parentNode.getChildren().forEach( child => child.dispose() );

    // For each entry in the map...
    let i = 0;
    countProperties.forEach( ( countProperty, element ) => {

      // Add a BarNode.
      const barNode = new BarNode( element, countProperty );
      parentNode.addChild( barNode );

      // Position the bar as it changes size.
      const barCenterX = i * ( BarNode.MAX_BAR_SIZE.width + 60 ); //TODO https://github.com/phetsims/balancing-chemical-equations/issues/170 magic numbers
      i++;
      barNode.boundsProperty.link( () => {
        barNode.centerX = barCenterX;
        barNode.bottom = 0;
      } );
    } );

    parentNode.centerX = centerX;
  }

  /**
   * Creates a new EqualityOperatorNode for the current equation.
   */
  private updateEqualityOperator(): void {
    this.equalityOperatorParent.getChildren().forEach( child => child.dispose() );
    const equalityOperatorNode = new EqualityOperatorNode( this.equationProperty.value.isBalancedProperty, {
      centerX: this.aligner.getScreenCenterX(),
      centerY: -40 //TODO https://github.com/phetsims/balancing-chemical-equations/issues/170 magic numbers
    } );
    this.equalityOperatorParent.addChild( equalityOperatorNode );
  }
}

balancingChemicalEquations.register( 'HBarChartNode', HBarChartNode );