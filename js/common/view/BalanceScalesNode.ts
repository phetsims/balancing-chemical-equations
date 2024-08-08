// Copyright 2014-2024, University of Colorado Boulder

/**
 * Visual representation of an equation as a set of balance scales, one for each atom type.
 * The left side of each scale is the reactants, the right side is the products.
 *
 * This implementation is very brute force, just about everything is recreated each time
 * a coefficient is changed in the equations.  But we have a small number of coefficients,
 * and nothing else is happening in the sim.  So we're trading efficiency for simplicity of
 * implementation.
 *
 * @author Vasily Shakhov (mlearner.com)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Element from '../../../../nitroglycerin/js/Element.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import { Node, NodeOptions, NodeTranslationOptions } from '../../../../scenery/js/imports.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import Equation from '../model/Equation.js';
import BalanceScaleNode from './BalanceScaleNode.js';
import HorizontalAligner from './HorizontalAligner.js';
import Property from '../../../../axon/js/Property.js';
import optionize from '../../../../phet-core/js/optionize.js';

type SelfOptions = {

  // horizontal spacing between the tips of the fulcrums
  fulcrumSpacing?: number;

  // horizontal spacing when we have 2 scales,
  // see https://github.com/phetsims/balancing-chemical-equations/issues/91
  dualFulcrumSpacing?: number;
};

type BalanceScalesNodeOptions = SelfOptions & NodeTranslationOptions;

export default class BalanceScalesNode extends Node {

  private readonly equationProperty: TReadOnlyProperty<Equation>;
  private readonly aligner: HorizontalAligner;
  private readonly constantBottom: number;
  private readonly fulcrumSpacing: number;
  private readonly dualFulcrumSpacing: number;

  // maps Element to count for that Element
  private readonly reactantCountProperties: Map<Element, Property<number>>;
  private readonly productCountProperties: Map<Element, Property<number>>;

  /**
   * @param equationProperty the equation that the scales are representing
   * @param aligner provides layout information to ensure horizontal alignment with other user-interface elements
   * @param [providedOptions]
   */
  public constructor( equationProperty: TReadOnlyProperty<Equation>, aligner: HorizontalAligner,
                      providedOptions?: BalanceScalesNodeOptions ) {

    const options = optionize<BalanceScalesNodeOptions, SelfOptions, NodeOptions>()( {

      // SelfOptions
      fulcrumSpacing: 237,
      dualFulcrumSpacing: 237,

      // NodeOptions
      isDisposable: false,
      bottom: 0
    }, providedOptions );

    super();

    this.equationProperty = equationProperty;
    this.aligner = aligner;

    this.constantBottom = options.bottom;
    this.fulcrumSpacing = options.fulcrumSpacing;
    this.dualFulcrumSpacing = options.dualFulcrumSpacing;

    this.reactantCountProperties = new Map();
    this.productCountProperties = new Map();

    // Wire coefficients observer to current equation.
    const coefficientsObserver = this.updateCounts.bind( this );
    equationProperty.link( ( newEquation, oldEquation ) => {
      this.updateNode();
      if ( oldEquation ) {
        oldEquation.removeCoefficientsObserver( coefficientsObserver );
      }
      newEquation.addCoefficientsObserver( coefficientsObserver );
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
      const fulcrumSpacing = ( atomCounts.length === 2 ) ? this.dualFulcrumSpacing : this.fulcrumSpacing;
      let x = 0;
      for ( let i = 0; i < atomCounts.length; i++ ) {

        const atomCount = atomCounts[ i ];

        // populate the maps
        const leftCountProperty = new NumberProperty( atomCount.reactantsCount, { numberType: 'Integer' } );
        const rightCountProperty = new NumberProperty( atomCount.productsCount, { numberType: 'Integer' } );
        this.reactantCountProperties.set( atomCount.element, leftCountProperty );
        this.productCountProperties.set( atomCount.element, rightCountProperty );

        // add a scale node
        const scaleNode = new BalanceScaleNode( atomCount.element, leftCountProperty, rightCountProperty, this.equationProperty.value.balancedProperty, { x: x } );
        this.addChild( scaleNode );

        x += fulcrumSpacing;
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
        assert && assert( reactantCountProperty );
        reactantCountProperty.value = atomCount.reactantsCount;

        const productCountProperty = this.productCountProperties.get( atomCount.element )!;
        assert && assert( productCountProperty );
        productCountProperty.value = atomCount.productsCount;
      }
    }
  }
}

balancingChemicalEquations.register( 'BalanceScalesNode', BalanceScalesNode );