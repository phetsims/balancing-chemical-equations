// Copyright 2014-2023, University of Colorado Boulder

/**
 * Visual representation of an equation as a pair of bar charts, for left and right side of equation.
 * An indicator between the charts (equals or not equals) indicates whether they are balanced.
 *
 * This implementation is very brute force, just about everything is recreated each time
 * a coefficient is changed in the equations.  But we have a small number of coefficients,
 * and nothing else is happening in the sim.  So we're trading efficiency for simplicity of
 * implementation.
 *
 * @author Vasily Shakhov (mlearner.com)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import { Node } from '../../../../scenery/js/imports.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import BarNode from './BarNode.js';
import EqualityOperatorNode from './EqualityOperatorNode.js';

export default class BarChartsNode extends Node {

  /**
   * @param {Property} equationProperty the equation that the scales are representing
   * @param {HorizontalAligner} aligner provides layout information to ensure horizontal alignment with other user-interface elements
   * @param {Object} [options]
   */
  constructor( equationProperty, aligner, options ) {

    options = merge( {}, options );

    super();

    this.equationProperty = equationProperty; // @private
    this.aligner = aligner; // @private
    this.reactantCountProperties = {}; // @private maps {string} Element.symbol to {Property.<number>} count of the element
    this.productCountProperties = {}; // @private maps {string} Element.symbol to {Property.<number>} counts of the element

    this.reactantBarsParent = new Node(); // @private
    this.productBarsParent = new Node(); // @private

    // @private
    const equalityOperatorNode = new EqualityOperatorNode( equationProperty, {
      center: new Vector2( aligner.getScreenCenterX(), -40 )
    } );

    options.children = [ this.reactantBarsParent, this.productBarsParent, equalityOperatorNode ];

    // Wire coefficients observer to current equation.
    const coefficientsObserver = this.updateCounts.bind( this );
    equationProperty.link( ( newEquation, oldEquation ) => {
      this.updateNode();
      if ( oldEquation ) { oldEquation.removeCoefficientsObserver( coefficientsObserver ); }
      newEquation.addCoefficientsObserver( coefficientsObserver );
    } );

    this.mutate( options );

    // Update this Node when it becomes visible.
    this.visibleProperty.link( visible => visible && this.updateNode() );
  }

  // No dispose needed, instances of this type persist for lifetime of the sim.

  /**
   * Updates this node's entire geometry and layout
   * @private
   */
  updateNode() {
    if ( this.visible ) {
      const atomCounts = this.equationProperty.get().getAtomCounts();

      this.reactantCountProperties = this.updateBars(
        this.reactantBarsParent,
        atomCounts,
        atomCount => atomCount.reactantsCount,
        this.aligner.getReactantsBoxCenterX()
      );

      this.productCountProperties = this.updateBars(
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
   * @param {Node} parentNode
   * @param {AtomCount[]} atomCounts counts of each atom in the equation
   * @param {function} getCount 1 parameter {AtomCount}, return {number}, either the reactants or products count
   * @param {number} centerX centerX of the chart
   * @private
   */
  updateBars( parentNode, atomCounts, getCount, centerX ) {

    // dispose of children before calling removeAllChildren
    parentNode.getChildren().forEach( child => {
      if ( child.dispose() ) {
        child.dispose();
      }
    } );

    parentNode.removeAllChildren(); // remove all the bar nodes

    const countProperties = {}; // clear the map

    let barCenterX = 0;
    for ( let i = 0; i < atomCounts.length; i++ ) {
      const atomCount = atomCounts[ i ];
      // populate the map
      const countProperty = new NumberProperty( getCount( atomCount ), { numberType: 'Integer' } );
      countProperties[ atomCount.element.symbol ] = countProperty;
      // add a bar node
      const barNode = new BarNode( atomCount.element, countProperty, { centerX: barCenterX, bottom: 0 } );
      parentNode.addChild( barNode );
      barCenterX = barNode.centerX + 100;
    }

    parentNode.centerX = centerX;

    return countProperties;
  }

  /**
   * Updates the atom counts for each bar.
   * @private
   */
  updateCounts() {
    if ( this.visible ) {
      const atomCounts = this.equationProperty.get().getAtomCounts();
      for ( let i = 0; i < atomCounts.length; i++ ) {
        const atomCount = atomCounts[ i ];
        this.reactantCountProperties[ atomCount.element.symbol ].value = atomCount.reactantsCount;
        this.productCountProperties[ atomCount.element.symbol ].value = atomCount.productsCount;
      }
    }
  }
}

balancingChemicalEquations.register( 'BarChartsNode', BarChartsNode );