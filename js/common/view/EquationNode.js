// Copyright 2014-2020, University of Colorado Boulder

/**
 * Displays a chemical equation.
 * Reactants are on the left-hand size, products are on the right-hand side.
 *
 * @author Vasily Shakhov (mlearner.com)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import PlusNode from '../../../../scenery-phet/js/PlusNode.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import RightArrowNode from './RightArrowNode.js';
import TermNode from './TermNode.js';

class EquationNode extends Node {

  /**
   * @param {Property.<Equation>} equationProperty
   * @param {DOT.Range} coefficientRange range of the coefficients
   * @param {HorizontalAligner} aligner provides layout information to ensure horizontal alignment with other user-interface elements
   * @param {Object} [options]
   */
  constructor( equationProperty, coefficientRange, aligner, options ) {

    options = merge( { fontSize: 32 }, options );

    super();

    this.fontSize = options.fontSize; // @private
    this.coefficientRange = coefficientRange; // @private
    this.balancedHighlightEnabled = true; // @private
    this.aligner = aligner; // @private
    this.equationProperty = equationProperty; // @private

    // @private arrow node, at a fixed position
    this.arrowNode = new RightArrowNode( equationProperty, { centerX: this.aligner.getScreenCenterX() } ); // @private
    this.addChild( this.arrowNode );

    this.terms = []; // @private the set of TermNodes in the equation

    this.termsParent = new Node(); // @private the parent for all terms and the "+" operators
    this.addChild( this.termsParent );

    // if the equation changes...
    equationProperty.link( ( newEquation, oldEquation ) => this.updateNode() );

    this.mutate( options );
  }

  // No dispose needed, instances of this type persist for lifetime of the sim.

  /**
   * Rebuilds the left and right sides of the equation.
   * @private
   */
  updateNode() {

    // dispose of existing instances of TermNode
    this.terms.forEach( termNode => termNode.dispose() );
    this.terms.length = 0;
    this.termsParent.removeAllChildren();

    const equation = this.equationProperty.get();
    this.updateSideOfEquation( equation.reactants, this.aligner.getReactantXOffsets( equation ),
      this.aligner.getReactantsBoxLeft(), this.aligner.getReactantsBoxRight() );
    this.updateSideOfEquation( equation.products, this.aligner.getProductXOffsets( equation ),
      this.aligner.getProductsBoxLeft(), this.aligner.getScreenRight() );
  }

  /**
   * Rebuilds one side of the equation.
   *
   * @param {EquationTerm} terms array
   * @param {number} xOffsets array for terms
   * @param {number} minX minimal possible x for equation
   * @param {number} maxX maximum possible x for equation
   * @private
   */
  updateSideOfEquation( terms, xOffsets, minX, maxX ) {

    let plusNode;
    let termNode;
    const minSeparation = 15;
    const tempNodes = []; // contains all nodes for position adjustment if needed

    for ( let i = 0; i < terms.length; i++ ) {
      // term
      termNode = new TermNode( this.coefficientRange, terms[ i ], { fontSize: this.fontSize } );
      this.terms.push( termNode );
      this.termsParent.addChild( termNode );
      termNode.center = new Vector2( xOffsets[ i ], 0 );

      // if node over previous plusNode move node to the right
      if ( i > 0 ) {
        if ( termNode.bounds.minX - minSeparation < tempNodes[ tempNodes.length - 1 ].bounds.maxX ) {
          termNode.x += tempNodes[ tempNodes.length - 1 ].bounds.maxX - ( termNode.bounds.minX - minSeparation );
        }
      }
      tempNodes.push( termNode );

      if ( terms.length > 1 && i < terms.length - 1 ) {
        plusNode = new PlusNode();
        this.termsParent.addChild( plusNode );
        plusNode.centerX = xOffsets[ i ] + ( ( xOffsets[ i + 1 ] - xOffsets[ i ] ) / 2 ); // centered between 2 offsets;
        plusNode.centerY = termNode.centerY;
        tempNodes.push( plusNode );

        // if previous node over plusNode move node to the left
        if ( termNode.bounds.maxX + minSeparation > plusNode.bounds.minX ) {
          termNode.x = termNode.x - ( termNode.bounds.maxX + minSeparation - plusNode.bounds.minX );
        }
      }
    }

    let dx;
    // check if equation fits minX (eg, C2H5OH + 3O2 -> 2CO2 + 3H2O)
    if ( tempNodes[ 0 ].bounds.minX < minX ) { // adjust all terms to the right
      let rightBound = minX; // current right bound of passed terms, if term.minX<rightBound move term to the right
      tempNodes.forEach( term => {
        dx = Math.max( 0, rightBound - term.bounds.minX );
        term.x += dx;
        rightBound = term.bounds.maxX + minSeparation;
      } );
    }

    // check if equation fits maxX (eg, CH3OH -> CO + 2H2)
    if ( tempNodes[ tempNodes.length - 1 ].bounds.maxX > maxX ) { // adjust all terms to the left
      let leftBound = maxX; // current left bound of passed terms, if term.maxX > leftBound, move term to the left
      for ( let i = tempNodes[ tempNodes.length - 1 ]; i > -1; i-- ) {
        const term = tempNodes[ i ];
        dx = Math.max( 0, term.bounds.maxX - leftBound );
        term.x -= dx;
        leftBound = term.bounds.minX - minSeparation;
      }
    }

    this.arrowNode.centerY = termNode.centerY;
  }

  /**
   * Enables or disables the highlighting feature.
   * When enabled, the arrow between the left and right sides of the equation will light up when the equation is balanced.
   * This is enabled by default, but we want to disable in the Game until the user presses the "Check" button.
   *
   * @param enabled
   * @public
   */
  setBalancedHighlightEnabled( enabled ) {
    this.arrowNode.highlightEnabled = enabled;
  }

  /**
   * Sets whether coefficients are editable, by showing/hiding the arrows on the NumberPicker associated with each term.
   * @param {boolean} editable
   * @public
   */
  setCoefficientsEditable( editable ) {
    for ( let i = 0; i < this.terms.length; i++ ) {
      this.terms[ i ].setCoefficientEditable( editable );
    }
  }
}
balancingChemicalEquations.register( 'EquationNode', EquationNode );
export default EquationNode;