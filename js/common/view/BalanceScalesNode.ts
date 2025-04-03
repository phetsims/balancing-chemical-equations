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

  // maps Element to count for that Element
  private readonly reactantCountProperties: Map<Element, Property<number>>;
  private readonly productCountProperties: Map<Element, Property<number>>;

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

    super();

    this.equationProperty = equationProperty;
    this.aligner = aligner;
    this.orientation = options.orientation;

    this.constantBottom = options.bottom;
    this.twoFulcrumsXSpacing = options.twoFulcrumsXSpacing;
    this.threeFulcrumsXSpacing = options.threeFulcrumsXSpacing;

    this.reactantCountProperties = new Map();
    this.productCountProperties = new Map();

    // Wire coefficients listener to current equation.
    const coefficientsListener = () => this.updateCounts();
    equationProperty.link( ( newEquation, oldEquation ) => {
      //TODO https://github.com/phetsims/balancing-chemical-equations/issues/160 Failure if this.updateNode() is moved last.
      this.updateNode();
      oldEquation && oldEquation.unlinkCoefficientProperties( coefficientsListener );
      newEquation.lazyLinkCoefficientProperties( coefficientsListener );
      //TODO https://github.com/phetsims/balancing-chemical-equations/issues/160 Guard with isSettingPhetioStateProperty?
      coefficientsListener();
    } );

    this.mutate( options );

    // Update this Node when it becomes visible.
    this.visibleProperty.link( visible => visible && this.updateNode() );
  }

  /**
   * Updates this node's entire geometry and layout.
   */
  private updateNode(): void {
    if ( this.visible ) {

      // dispose of children before calling removeAllChildren
      this.getChildren().forEach( child => {
        if ( child.dispose ) {
          child.dispose();
        }
      } );

      // remove all nodes and clear the maps
      this.removeAllChildren();
      this.reactantCountProperties.clear();
      this.productCountProperties.clear();

      const atomCounts = this.equationProperty.value.getAtomCounts();
      let x = 0;
      let y = 0;
      for ( let i = 0; i < atomCounts.length; i++ ) {

        const atomCount = atomCounts[ i ];

        // populate the maps
        const leftCountProperty = new NumberProperty( atomCount.reactantsCount, { numberType: 'Integer' } );
        const rightCountProperty = new NumberProperty( atomCount.productsCount, { numberType: 'Integer' } );
        this.reactantCountProperties.set( atomCount.element, leftCountProperty );
        this.productCountProperties.set( atomCount.element, rightCountProperty );

        // add a scale node
        const scaleNodeOptions = this.orientation === 'horizontal' ? { x: x } : { y: y };
        const scaleNode = new BalanceScaleNode( atomCount.element, leftCountProperty, rightCountProperty, this.equationProperty.value.isBalancedProperty, scaleNodeOptions );
        this.addChild( scaleNode );

        x += ( atomCounts.length === 2 ) ? this.twoFulcrumsXSpacing : this.threeFulcrumsXSpacing;
        y += 140; //TODO https://github.com/phetsims/balancing-chemical-equations/issues/170
      }

      this.centerX = this.aligner.getScreenCenterX();
      this.bottom = this.constantBottom;
      this.updateCounts();
    }
  }

  /**
   * Updates the atom counts for each scale.
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

balancingChemicalEquations.register( 'BalanceScalesNode', BalanceScalesNode );