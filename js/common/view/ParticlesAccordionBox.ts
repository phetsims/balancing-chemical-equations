// Copyright 2014-2025, University of Colorado Boulder

/**
 * ParticlesAccordionBox is an accordion box that shows particles (molecules and atoms) for one side of an equation.
 *
 * @author Vasily Shakhov (mlearner.com)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import MoleculeNode from '../../../../nitroglycerin/js/nodes/MoleculeNode.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Node, { NodeTranslationOptions } from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import AccordionBox, { AccordionBoxOptions } from '../../../../sun/js/AccordionBox.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import BCEConstants from '../BCEConstants.js';
import Equation from '../model/Equation.js';
import EquationTerm from '../model/EquationTerm.js';
import Molecule from '../model/Molecule.js';

const TITLE_FONT = new PhetFont( { size: 18, weight: 'bold' } );
const EXPAND_COLLAPSE_BUTTON_SIDE_LENGTH = 15;

type SelfOptions = {
  boxWidth?: number;
  boxHeight?: number;
};

type ParticlesAccordionBoxOptions = SelfOptions & NodeTranslationOptions &
  PickOptional<AccordionBoxOptions, 'expandedProperty' | 'fill'> &
  PickRequired<AccordionBoxOptions, 'tandem'>;

export default class ParticlesAccordionBox extends AccordionBox {

  private readonly boxHeight: number;
  private readonly coefficientsRange: Range;

  private readonly termNodesMap: Map<Molecule, MoleculeNode[]>; // molecule nodes for each term
  private readonly moleculesParent: Node;

  /**
   * @param equationProperty
   * @param getTerms - gets the EquationTerms that this box will display
   * @param getXOffsets - gets the x-offsets for each EquationTerm
   * @param coefficientsRange - range of the coefficients
   * @param titleStringProperty
   * @param [providedOptions]
   */
  public constructor( equationProperty: TReadOnlyProperty<Equation>,
                      getTerms: ( equation: Equation ) => EquationTerm[],
                      getXOffsets: ( equation: Equation ) => number[],
                      coefficientsRange: Range,
                      titleStringProperty: TReadOnlyProperty<string>,
                      providedOptions?: ParticlesAccordionBoxOptions ) {

    const options = optionize<ParticlesAccordionBoxOptions, SelfOptions, AccordionBoxOptions>()( {

      // SelfOptions
      boxWidth: 100,
      boxHeight: 100,

      // AccordionBoxOptions
      isDisposable: false,
      titleAlignX: 'center',
      fill: 'white',
      stroke: 'black',
      lineWidth: 1,
      cornerRadius: 0,
      buttonXMargin: 5,
      buttonYMargin: 5,
      showTitleWhenExpanded: false,
      titleXMargin: 0,
      titleXSpacing: 8,
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
      font: TITLE_FONT,
      maxWidth: 0.75 * options.boxWidth
    } );

    // Content will be placed to the left of expand/collapse button, so contentWidth is only part of boxWidth.
    // See https://github.com/phetsims/balancing-chemical-equations/issues/125
    assert && assert( !options.showTitleWhenExpanded, 'computation of contentWidth is dependent on specific option values' );
    const contentWidth = options.boxWidth - EXPAND_COLLAPSE_BUTTON_SIDE_LENGTH - options.buttonXMargin;

    // constant-sized rectangle
    const contentNode = new Rectangle( 0, 0, contentWidth, options.boxHeight, {

      // With ?dev query parameter, put a red stroke around the content, for debugging layout.
      // See https://github.com/phetsims/balancing-chemical-equations/issues/125
      stroke: phet.chipper.queryParameters.dev ? 'red' : null
    } );

    // parent for all molecule nodes
    const moleculesParent = new Node();
    contentNode.addChild( moleculesParent );

    super( contentNode, options );

    this.boxHeight = options.boxHeight;
    this.coefficientsRange = coefficientsRange;
    this.termNodesMap = new Map();
    this.moleculesParent = moleculesParent;

    const coefficientsListener = () => {
      this.updateMoleculeNodes( getTerms( equationProperty.value ), getXOffsets( equationProperty.value ) );
    };

    equationProperty.link( ( newEquation, oldEquation ) => {

      // Remove all MoleculeNodes and clear the map.
      this.moleculesParent.removeAllChildren();
      this.termNodesMap.clear();

      // Wire up coefficients listener to the current equation.
      oldEquation && oldEquation.unlinkCoefficientProperties( coefficientsListener );
      newEquation.lazyLinkCoefficientProperties( coefficientsListener );

      coefficientsListener();
    } );
  }

  /**
   * Adds MoleculeNodes or updates their visibility to match the current coefficients.
   */
  private updateMoleculeNodes( terms: EquationTerm[], xOffsets: number[] ): void {

    const Y_MARGIN = 0;
    const rowHeight = ( this.boxHeight - ( 2 * Y_MARGIN ) ) / this.coefficientsRange.max;

    for ( let i = 0; i < terms.length; i++ ) {

      const term = terms[ i ];
      const moleculeNodes = this.termNodesMap.get( term.molecule ) || [];

      const coefficient = terms[ i ].coefficientProperty.value;
      let y = this.boxHeight - Y_MARGIN - ( rowHeight / 2 );

      for ( let j = 0; j < Math.max( coefficient, moleculeNodes.length ); j++ ) {
        if ( j < moleculeNodes.length ) {

          // Set visibility of a molecule that already exists.
          moleculeNodes[ j ].visible = ( j < coefficient );
        }
        else {

          // Add a MoleculeNode.
          const moleculeNode = term.molecule.createNode( {
            atomNodeOptions: BCEConstants.ATOM_NODE_OPTIONS
          } );
          moleculeNode.scale( BCEConstants.PARTICLES_SCALE_FACTOR );
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

balancingChemicalEquations.register( 'ParticlesAccordionBox', ParticlesAccordionBox );