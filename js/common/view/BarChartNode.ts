// Copyright 2014-2025, University of Colorado Boulder

/**
 * BarChartNode is the visual representation of an equation as a pair of bar charts, for left and right side of equation.
 * An indicator between the charts (equals or not equals) indicates whether they are balanced.
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
import Vector2 from '../../../../dot/js/Vector2.js';
import Element from '../../../../nitroglycerin/js/Element.js';
import optionize from '../../../../phet-core/js/optionize.js';
import Node, { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import AtomCount from '../model/AtomCount.js';
import Equation from '../model/Equation.js';
import BarNode from './BarNode.js';
import EqualityOperatorNode from './EqualityOperatorNode.js';
import HorizontalAligner from './HorizontalAligner.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';

type Orientation = 'horizontal' | 'vertical';

type SelfOptions = {
  orientation?: Orientation;
};

type BarChartNodeOptions = SelfOptions & PickOptional<NodeOptions, 'visibleProperty'>;

export default class BarChartNode extends Node {

  private readonly equationProperty: TReadOnlyProperty<Equation>;
  private readonly aligner: HorizontalAligner;
  private readonly orientation: Orientation;

  // maps Element to count for that Element
  private readonly reactantCountProperties: Map<Element, Property<number>>;
  private readonly productCountProperties: Map<Element, Property<number>>;

  // UI subcomponents
  private readonly reactantBarsParent: Node;
  private readonly productBarsParent: Node;

  /**
   * @param equationProperty - the equation that the scales are representing
   * @param aligner - provides layout information to ensure horizontal alignment with other user-interface elements
   * @param [providedOptions]
   */
  public constructor( equationProperty: TReadOnlyProperty<Equation>,
                      aligner: HorizontalAligner,
                      providedOptions?: BarChartNodeOptions ) {

    const reactantBarsParent = new Node();
    const productBarsParent = new Node();
    const equalityOperatorNode = new EqualityOperatorNode( equationProperty, {
      center: new Vector2( aligner.getScreenCenterX(), -40 )
    } );

    const options = optionize<BarChartNodeOptions, SelfOptions, NodeOptions>()( {

      // SelfOptions
      orientation: 'horizontal',

      // NodeOptions
      isDisposable: false,
      children: [ reactantBarsParent, productBarsParent, equalityOperatorNode ]
    }, providedOptions );

    super( options );

    this.equationProperty = equationProperty;
    this.aligner = aligner;
    this.orientation = options.orientation;

    this.reactantCountProperties = new Map();
    this.productCountProperties = new Map();

    this.reactantBarsParent = reactantBarsParent;
    this.productBarsParent = productBarsParent;

    // Wire coefficients listener to current equation.
    const coefficentsListener = () => this.updateCounts();
    equationProperty.link( ( newEquation, oldEquation ) => {
      this.updateNode();
      oldEquation && oldEquation.unlinkCoefficientProperties( coefficentsListener );
      newEquation.lazyLinkCoefficientProperties( coefficentsListener );
      coefficentsListener();
    } );
  }

  /**
   * Create new count Properties, and create new balance scales that are wired to those Properties.
   */
  private updateNode(): void {

    const atomCounts = this.equationProperty.value.getAtomCounts();
    const centerXOffset = 125; //TODO https://github.com/phetsims/balancing-chemical-equations/issues/170 magic numbers

    // reactant bars
    this.updateBars(
      this.reactantCountProperties,
      this.reactantBarsParent,
      atomCounts,
      atomCount => atomCount.reactantsCount,
      ( this.orientation === 'horizontal' ) ? this.aligner.getReactantsBoxCenterX() : this.aligner.getScreenCenterX() - centerXOffset
    );

    // product bars
    this.updateBars(
      this.productCountProperties,
      this.productBarsParent,
      atomCounts,
      atomCount => atomCount.productsCount,
      ( this.orientation === 'horizontal' ) ? this.aligner.getProductsBoxCenterX() : this.aligner.getScreenCenterX() + centerXOffset
    );
  }

  /**
   * Creates new count Properties, and bars that are wired to those Properties, for one side of the equation.
   * @param countProperties - map of Element to count for that Element
   * @param parentNode - parent for the BarNode instances
   * @param atomCounts - counts of each atom in the equation
   * @param getCount - gets the reactants or products count
   * @param centerX - centerX of the chart
   */
  private updateBars( countProperties: Map<Element, Property<number>>,
                      parentNode: Node,
                      atomCounts: AtomCount[],
                      getCount: ( atomCount: AtomCount ) => number,
                      centerX: number ): void {

    // Dispose of previous bars.
    parentNode.getChildren().forEach( child => child.dispose() );

    // Clear the map.
    countProperties.clear();

    // For each element...
    atomCounts.forEach( ( atomCount, i ) => {

      // Populate the map.
      const countProperty = new NumberProperty( getCount( atomCount ), { numberType: 'Integer' } );
      countProperties.set( atomCount.element, countProperty );

      // Add a bar node.
      const barNode = new BarNode( atomCount.element, countProperty );
      parentNode.addChild( barNode );

      // Position the bar as it changes size.
      const barCenterX = i * ( BarNode.MAX_BAR_SIZE.width + 60 ); //TODO https://github.com/phetsims/balancing-chemical-equations/issues/170 magic numbers
      const barBottom = i * ( BarNode.MAX_BAR_SIZE.height + 50 ); //TODO https://github.com/phetsims/balancing-chemical-equations/issues/170 magic numbers
      barNode.boundsProperty.link( () => {
        if ( this.orientation === 'horizontal' ) {
          barNode.centerX = barCenterX;
          barNode.bottom = 0;
        }
        else {
          barNode.centerX = centerX;
          barNode.bottom = barBottom;
        }
      } );
    } );

    parentNode.centerX = centerX;
  }

  /**
   * Updates the count Properties for each element involved in the equation.
   */
  private updateCounts(): void {
    const atomCounts = this.equationProperty.value.getAtomCounts();
    atomCounts.forEach( atomCount => {

      const reactantCountProperty = this.reactantCountProperties.get( atomCount.element )!;
      assert && assert( reactantCountProperty,
        `missing reactantCountProperty for element ${atomCount.element.symbol} in equation ${this.equationProperty.value.toString()}` );
      reactantCountProperty.value = atomCount.reactantsCount;

      const productCountProperty = this.productCountProperties.get( atomCount.element )!;
      assert && assert( productCountProperty,
        `missing productCountProperty for element ${atomCount.element.symbol} in equation ${this.equationProperty.value.toString()}` );
      productCountProperty.value = atomCount.productsCount;
    } );
  }
}

balancingChemicalEquations.register( 'BarChartNode', BarChartNode );