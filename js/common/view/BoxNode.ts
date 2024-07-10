// Copyright 2014-2023, University of Colorado Boulder

/**
 * A box that shows the number of molecules indicated by the equation's user coefficients.
 *
 * @author Vasily Shakhov (mlearner.com)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import MoleculeNode from '../../../../nitroglycerin/js/nodes/MoleculeNode.js';
import { Node, NodeTranslationOptions, Rectangle, Text } from '../../../../scenery/js/imports.js';
import AccordionBox, { AccordionBoxOptions } from '../../../../sun/js/AccordionBox.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import BCEConstants from '../BCEConstants.js';
import Equation from '../model/Equation.js';
import EquationTerm from '../model/EquationTerm.js';
import Molecule from '../model/Molecule.js';

const EXPAND_COLLAPSE_BUTTON_SIDE_LENGTH = 15;

type SelfOptions = {
  boxWidth?: number;
  boxHeight?: number;
};

type BoxNodeOptions = SelfOptions & NodeTranslationOptions &
  PickOptional<AccordionBoxOptions, 'expandedProperty' | 'fill'>;

export default class BoxNode extends AccordionBox {

  private readonly boxHeight: number;
  private readonly coefficientRange: Range;

  private readonly termNodesMap: Map<Molecule, MoleculeNode[]>; // molecule nodes for each term
  private readonly moleculesParent: Node;

  /**
   * @param equationProperty
   * @param getTerms - gets the EquationTerms that this box will display
   * @param getXOffsets - gets the x-offsets for each EquationTerm
   * @param coefficientRange - range of the coefficients
   * @param titleStringProperty
   * @param [providedOptions]
   */
  public constructor( equationProperty: TReadOnlyProperty<Equation>,
                      getTerms: ( equation: Equation ) => EquationTerm[],
                      getXOffsets: ( equation: Equation ) => number[],
                      coefficientRange: Range,
                      titleStringProperty: TReadOnlyProperty<string>,
                      providedOptions?: BoxNodeOptions ) {

    const options = optionize<BoxNodeOptions, SelfOptions, AccordionBoxOptions>()( {

      // SelfOptions
      boxWidth: 100,
      boxHeight: 100,

      // AccordionBoxOptions
      isDisposable: false,
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
        sideLength: EXPAND_COLLAPSE_BUTTON_SIDE_LENGTH,
        touchAreaXDilation: 20,
        touchAreaYDilation: 20,
        mouseAreaXDilation: 10,
        mouseAreaYDilation: 10
      }
    }, providedOptions );

    options.titleNode = new Text( titleStringProperty, {
      font: new PhetFont( { size: 18, weight: 'bold' } ),
      maxWidth: 0.75 * options.boxWidth
    } );

    // Content will be placed to the left of expand/collapse button, so contentWidth is only part of boxWidth.
    // See https://github.com/phetsims/balancing-chemical-equations/issues/125
    assert && assert( !options.showTitleWhenExpanded && options.titleAlignX === 'center',
      'computation of contentWidth is dependent on specific option values' );
    const contentWidth = options.boxWidth - EXPAND_COLLAPSE_BUTTON_SIDE_LENGTH - options.buttonXMargin;

    // constant-sized rectangle
    const contentNode = new Rectangle( 0, 0, contentWidth, options.boxHeight, {

      // With ?dev query parameter, put a red stroke around the content, for debugging layout of #125
      stroke: phet.chipper.queryParameters.dev ? 'red' : null
    } );

    // parent for all molecule nodes
    const moleculesParent = new Node();
    contentNode.addChild( moleculesParent );

    super( contentNode, options );

    this.boxHeight = options.boxHeight;
    this.coefficientRange = coefficientRange;
    this.termNodesMap = new Map();
    this.moleculesParent = moleculesParent;

    // update visible molecules to match the coefficients
    const coefficientsObserver = () => {
      this.updateCounts( getTerms( equationProperty.value ), getXOffsets( equationProperty.value ) );
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
   */
  private updateNode( terms: EquationTerm[], xOffsets: number[] ): void {

    // Remove all molecule nodes and clear the map.
    this.moleculesParent.removeAllChildren();
    this.termNodesMap.clear();

    this.updateCounts( terms, xOffsets );
  }

  /**
   * Updates visibility of molecules to match the current coefficients.
   */
  private updateCounts( terms: EquationTerm[], xOffsets: number[] ): void {

    const Y_MARGIN = 0;
    const rowHeight = ( this.boxHeight - ( 2 * Y_MARGIN ) ) / this.coefficientRange.max;

    for ( let i = 0; i < terms.length; i++ ) {

      const term = terms[ i ];
      const moleculeNodes = this.termNodesMap.get( term.molecule ) || [];

      const userCoefficient = terms[ i ].userCoefficientProperty.value;
      let y = this.boxHeight - Y_MARGIN - ( rowHeight / 2 );

      for ( let j = 0; j < Math.max( userCoefficient, moleculeNodes.length ); j++ ) {
        if ( j < moleculeNodes.length ) {

          // set visibility of a molecule that already exists
          moleculeNodes[ j ].visible = ( j < userCoefficient );
        }
        else {

          // add a molecule node
          const moleculeNode = term.molecule.createNode( {
            atomNodeOptions: BCEConstants.ATOM_NODE_OPTIONS
          } );
          moleculeNode.scale( BCEConstants.MOLECULE_SCALE_FACTOR );
          this.moleculesParent.addChild( moleculeNode );
          moleculeNode.center = new Vector2( xOffsets[ i ] - this.x, y );
          moleculeNodes.push( moleculeNode );
        }
        y -= rowHeight;
      }

      this.termNodesMap.set( term.molecule, moleculeNodes );
    }
  }
}

balancingChemicalEquations.register( 'BoxNode', BoxNode );