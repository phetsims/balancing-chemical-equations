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
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';

type Orientation = 'horizontal' | 'vertical';

type SelfOptions = {
  orientation?: Orientation;
};

type BarChartNodeOptions = SelfOptions & PickRequired<NodeOptions, 'visibleProperty'>;

export default class BarChartNode extends Node {

  private readonly equationProperty: TReadOnlyProperty<Equation>;
  private readonly aligner: HorizontalAligner;
  private readonly orientation: Orientation;

  // maps Element to count for that Element
  private readonly reactantCountProperties: Map<Element, Property<number>>;
  private readonly productCountProperties: Map<Element, Property<number>>;

  private readonly reactantBarsParent: Node;
  private readonly productBarsParent: Node;

  /**
   * @param equationProperty - the equation that the scales are representing
   * @param aligner - provides layout information to ensure horizontal alignment with other user-interface elements
   * @param [providedOptions]
   */
  public constructor( equationProperty: TReadOnlyProperty<Equation>, aligner: HorizontalAligner,
                      providedOptions?: BarChartNodeOptions ) {

    const options = optionize<BarChartNodeOptions, SelfOptions, NodeOptions>()( {

      // SelfOptions
      orientation: 'horizontal',

      // NodeOptions
      isDisposable: false
    }, providedOptions );

    super();

    this.equationProperty = equationProperty;
    this.aligner = aligner;
    this.orientation = options.orientation;

    this.reactantCountProperties = new Map();
    this.productCountProperties = new Map();

    this.reactantBarsParent = new Node();
    this.productBarsParent = new Node();

    const equalityOperatorNode = new EqualityOperatorNode( equationProperty, {
      center: new Vector2( aligner.getScreenCenterX(), -40 )
    } );

    options.children = [ this.reactantBarsParent, this.productBarsParent, equalityOperatorNode ];

    // Wire coefficients listener to current equation.
    const coefficentsListener = () => this.updateCounts();
    equationProperty.link( ( newEquation, oldEquation ) => {
      //TODO https://github.com/phetsims/balancing-chemical-equations/issues/160 Failure if this.updateNode() is moved last.
      this.updateNode();
      oldEquation && oldEquation.unlinkCoefficientProperties( coefficentsListener );
      newEquation.lazyLinkCoefficientProperties( coefficentsListener );
      //TODO https://github.com/phetsims/balancing-chemical-equations/issues/160 Guard with isSettingPhetioStateProperty?
      coefficentsListener();
    } );

    this.mutate( options );

    // Update this Node when it becomes visible.
    this.visibleProperty.link( visible => visible && this.updateNode() );
  }

  /**
   * Updates this node's entire geometry and layout
   */
  private updateNode(): void {
    if ( this.visible ) {
      const atomCounts = this.equationProperty.value.getAtomCounts();

      // reactant bars
      this.updateBars(
        this.reactantCountProperties,
        this.reactantBarsParent,
        atomCounts,
        atomCount => atomCount.reactantsCount,
        this.aligner.getReactantsBoxCenterX()
      );

      // product bars
      this.updateBars(
        this.productCountProperties,
        this.productBarsParent,
        atomCounts,
        atomCount => atomCount.productsCount,
        this.aligner.getProductsBoxCenterX()
      );

      this.updateCounts();
    }
  }

  /**
   * Updates one set of bars (reactants or products).
   * @param countProperties - map of Element to count for that Element
   * @param parentNode
   * @param atomCounts - counts of each atom in the equation
   * @param getCount - gets the reactants or products count
   * @param centerX - centerX of the chart
   */
  private updateBars( countProperties: Map<Element, Property<number>>, parentNode: Node, atomCounts: AtomCount[],
                      getCount: ( atomCount: AtomCount ) => number, centerX: number ): void {

    if ( this.visible ) {

      // Dispose and remove previous bars
      parentNode.getChildren().forEach( child => child.dispose() );
      parentNode.removeAllChildren();

      // Clear the map.
      countProperties.clear();

      let barCenterX = 0;
      for ( let i = 0; i < atomCounts.length; i++ ) {
        const atomCount = atomCounts[ i ];

        // populate the map
        const countProperty = new NumberProperty( getCount( atomCount ), { numberType: 'Integer' } );
        countProperties.set( atomCount.element, countProperty );

        // add a bar node
        const barNode = new BarNode( atomCount.element, countProperty, {
          centerX: barCenterX,
          bottom: 0
        } );
        parentNode.addChild( barNode );
        barCenterX = barNode.centerX + 100;
      }

      parentNode.centerX = centerX;
    }
  }

  /**
   * Updates the atom counts for each bar.
   */
  private updateCounts(): void {
    if ( this.visible ) {
      const atomCounts = this.equationProperty.value.getAtomCounts();
      for ( let i = 0; i < atomCounts.length; i++ ) {
        const atomCount = atomCounts[ i ];

        const reactantCountProperty = this.reactantCountProperties.get( atomCount.element )!;
        assert && assert( reactantCountProperty,
          `missing reactantCountProperty for element ${atomCount.element.symbol} in equation ${this.equationProperty.value.toString()}` );
        reactantCountProperty.value = atomCount.reactantsCount;

        const productCountProperty = this.productCountProperties.get( atomCount.element )!;
        assert && assert( productCountProperty,
          `missing productCountProperty for element ${atomCount.element.symbol} in equation ${this.equationProperty.value.toString()}` );
        productCountProperty.value = atomCount.productsCount;
      }
    }
  }
}

balancingChemicalEquations.register( 'BarChartNode', BarChartNode );