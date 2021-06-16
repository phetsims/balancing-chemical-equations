[object Promise]

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
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import BalanceScaleNode from './BalanceScaleNode.js';

class BalanceScalesNode extends Node {

  /**
   * @param {Property.<Equation>} equationProperty the equation that the scales are representing
   * @param {HorizontalAligner} aligner provides layout information to ensure horizontal alignment with other user-interface elements
   * @param {Object} [options]
   */
  constructor( equationProperty, aligner, options ) {

    options = merge( {
      bottom: 0,
      fulcrumSpacing: 237, // horizontal spacing between the tips of the fulcrums
      dualFulcrumSpacing: 237 // horizontal spacing when we have 2 scales, see issue #91
    }, options );

    super();

    this.equationProperty = equationProperty; // @private
    this.aligner = aligner; // @private
    this.constantBottom = options.bottom; // @private
    this.reactantCountProperties = {}; // @private maps {string} Element.symbol to {Property.<number>} count of the element
    this.productCountProperties = {}; // @private maps {string} Element.symbol to {Property.<number>} counts of the element
    this.fulcrumSpacing = options.fulcrumSpacing; // @private
    this.dualFulcrumSpacing = options.dualFulcrumSpacing; // @private

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
   * Updates this node's entire geometry and layout.
   * @private
   */
  updateNode() {
    if ( this.visible ) {

      // dispose of children before calling removeAllChildren
      this.getChildren().forEach( child => {
        if ( child.dispose ) {
          child.dispose();
        }
      } );

      // remove all nodes and clear the maps
      this.removeAllChildren();
      this.reactantCountProperties = {};
      this.productCountProperties = {};

      const atomCounts = this.equationProperty.get().getAtomCounts(); // [AtomCount]
      const fulcrumSpacing = ( atomCounts.length === 2 ) ? this.dualFulcrumSpacing : this.fulcrumSpacing;
      let x = 0;
      for ( let i = 0; i < atomCounts.length; i++ ) {

        const atomCount = atomCounts[ i ];

        // populate the maps
        const leftCountProperty = new NumberProperty( atomCount.reactantsCount, { numberType: 'Integer' } );
        const rightCountProperty = new NumberProperty( atomCount.productsCount, { numberType: 'Integer' } );
        this.reactantCountProperties[ atomCount.element.symbol ] = leftCountProperty;
        this.productCountProperties[ atomCount.element.symbol ] = rightCountProperty;

        // add a scale node
        const scaleNode = new BalanceScaleNode( atomCount.element, leftCountProperty, rightCountProperty, this.equationProperty.get().balancedProperty, { x: x } );
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
   * @private
   */
  updateCounts() {
    if ( this.visible ) {
      const atomCounts = this.equationProperty.get().getAtomCounts();
      for ( let i = 0; i < atomCounts.length; i++ ) {
        const atomCount = atomCounts[ i ];
        this.reactantCountProperties[ atomCount.element.symbol ].set( atomCount.reactantsCount );
        this.productCountProperties[ atomCount.element.symbol ].set( atomCount.productsCount );
      }
    }
  }
}

balancingChemicalEquations.register( 'BalanceScalesNode', BalanceScalesNode );
export default BalanceScalesNode;