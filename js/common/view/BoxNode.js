// Copyright 2014-2020, University of Colorado Boulder

/**
 * A box that shows the number of molecules indicated by the equation's user coefficients.
 *
 * @author Vasily Shakhov (mlearner.com)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import AccordionBox from '../../../../sun/js/AccordionBox.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import BCEConstants from '../BCEConstants.js';

class BoxNode extends AccordionBox {

  /**
   * @param {Property.<Equation>} equationProperty
   * @param {function} getTerms 1 parameter {Equation}, gets the terms that this box will display
   * @param {function} getXOffsets 1 parameter {Equation}, gets the x-offsets for each term
   * @param {DOT.Range} coefficientRange range of the coefficients
   * @param {string} titleString
   * @param {Object} [options]
   */
  constructor( equationProperty, getTerms, getXOffsets, coefficientRange, titleString, options ) {

    options = merge( {

      boxWidth: 100,
      boxHeight: 100,

      // AccordionBox options
      titleAlignX: 'center',
      resize: false,
      fill: 'white',
      stroke: 'black',
      lineWidth: 1,
      cornerRadius: 0,
      buttonAlign: 'right',
      buttonXMargin: 5,
      buttonYMargin: 5,
      showTitleWhenExpanded: false,
      titleBarExpandCollapse: false,
      titleXMargin: 0,
      titleXSpacing: 0,
      contentXMargin: 0,
      contentYMargin: 0,
      contentXSpacing: 0,
      contentYSpacing: 0,
      contentAlign: 'left',
      expandCollapseButtonOptions: {
        sideLength: 15,
        touchAreaXDilation: 20,
        touchAreaYDilation: 20,
        mouseAreaXDilation: 10,
        mouseAreaYDilation: 10
      }
    }, options );

    assert && assert( !options.titleNode, 'BoxNode sets titleNode' );
    options.titleNode = new Text( titleString, {
      font: new PhetFont( { size: 18, weight: 'bold' } ),
      maxWidth: 0.75 * options.boxWidth
    } );

    // Content will be placed to the left of expand/collapse button, so contentWidth is only part of boxWidth.
    // See https://github.com/phetsims/balancing-chemical-equations/issues/125
    assert && assert( options.showTitleWhenExpanded === false && options.titleAlignX === 'center',
      'computation of contentWidth is dependent on specific option values' );
    const contentWidth = options.boxWidth - options.expandCollapseButtonOptions.sideLength - options.buttonXMargin;

    // constant-sized rectangle
    const contentNode = new Rectangle( 0, 0, contentWidth, options.boxHeight, {

      // With ?dev query parameter, put a red stroke around the content, for debugging layout of #125
      stroke: phet.chipper.queryParameters.dev ? 'red' : null
    } );

    // @private parent for all molecule nodes
    const moleculesParent = new Node();
    contentNode.addChild( moleculesParent );

    super( contentNode, options );

    // @private
    this.boxHeight = options.boxHeight;
    this.coefficientRange = coefficientRange; // @private
    this.termNodes = {}; // @private molecule nodes for each term, key: term.molecule.symbol, value: [{Node}]
    this.moleculesParent = moleculesParent;

    // update visible molecules to match the coefficients
    const coefficientsObserver = () => {
      this.updateCounts( getTerms( equationProperty.get() ), getXOffsets( equationProperty.get() ) );
    };

    equationProperty.link( ( newEquation, oldEquation ) => {

      // updates the node for molecules of the current equation
      this.updateNode( getTerms( newEquation ), getXOffsets( newEquation ) );

      // wire up coefficients observer to current equation
      if ( oldEquation ) {
        oldEquation.removeCoefficientsObserver( coefficientsObserver );
      }
      newEquation.addCoefficientsObserver( coefficientsObserver );
    } );
  }

  // No dispose needed, instances of this type persist for lifetime of the sim.

  /**
   * Creates molecules in the boxes for one set of terms (reactants or products).
   * To improve performance:
   * - Molecules are created as needed.
   * - Molecules are never removed; they remain as children for the lifetime of this node.
   * - The visibility of molecules is adjusted to show the correct number of molecules.
   *
   * @param {EquationTerm} terms array
   * @param {number[]} xOffsets array of offsets for terms
   * @private
   */
  updateNode( terms, xOffsets ) {

    // remove all molecule nodes
    this.moleculesParent.removeAllChildren();

    // clear the map
    this.termNodes = {};
    for ( let i = 0; i < terms.length; i++ ) {
      this.termNodes[ terms[ i ].molecule.symbol ] = [];
    }

    this.updateCounts( terms, xOffsets );
  }

  /**
   * Updates visibility of molecules to match the current coefficients.
   *
   * @param {EquationTerm[]} terms
   * @param {number[]} xOffsets array of offsets for terms
   * @private
   */
  updateCounts( terms, xOffsets ) {

    const Y_MARGIN = 0;
    const rowHeight = ( this.boxHeight - ( 2 * Y_MARGIN ) ) / this.coefficientRange.max;

    for ( let i = 0; i < terms.length; i++ ) {

      const moleculeNodes = this.termNodes[ terms[ i ].molecule.symbol ];
      const userCoefficient = terms[ i ].userCoefficientProperty.get();
      const MoleculeNodeConstructor = terms[ i ].molecule.nodeConstructor;
      let y = this.boxHeight - Y_MARGIN - ( rowHeight / 2 );

      for ( let j = 0; j < Math.max( userCoefficient, moleculeNodes.length ); j++ ) {
        if ( j < moleculeNodes.length ) {
          // set visibility of a molecule that already exists
          moleculeNodes[ j ].visible = ( j < userCoefficient );
        }
        else {
          // add a molecule node
          const moleculeNode = new MoleculeNodeConstructor( { atomOptions: BCEConstants.ATOM_OPTIONS } );
          moleculeNode.scale( BCEConstants.MOLECULE_SCALE_FACTOR );
          this.moleculesParent.addChild( moleculeNode );
          moleculeNode.center = new Vector2( xOffsets[ i ] - this.x, y );

          moleculeNodes.push( moleculeNode );
        }
        y -= rowHeight;
      }
    }
  }
}

balancingChemicalEquations.register( 'BoxNode', BoxNode );
export default BoxNode;