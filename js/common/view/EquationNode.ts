// Copyright 2014-2025, University of Colorado Boulder

/**
 * EquationNode displays a chemical equation.
 * Reactants are on the left-hand size, products are on the right-hand side.
 *
 * @author Vasily Shakhov (mlearner.com)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import affirm from '../../../../perennial-alias/js/browser-and-node/affirm.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import PlusNode from '../../../../scenery-phet/js/PlusNode.js';
import Node, { NodeOptions, NodeTranslationOptions } from '../../../../scenery/js/nodes/Node.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import BalancingChemicalEquationsStrings from '../../BalancingChemicalEquationsStrings.js';
import Equation from '../model/Equation.js';
import EquationTerm from '../model/EquationTerm.js';
import EquationTermNode from './EquationTermNode.js';
import HorizontalAligner from './HorizontalAligner.js';
import RightArrowNode from './RightArrowNode.js';

const DEFAULT_FONT = new PhetFont( 32 );

type SelfOptions = {
  font?: PhetFont;
};

type EquationNodeOptions = SelfOptions & NodeTranslationOptions &
  PickOptional<NodeOptions, 'visibleProperty'> & PhetioObjectOptions & PickRequired<NodeOptions, 'tandem'>;

export default class EquationNode extends Node {

  private readonly equation: Equation;
  private readonly aligner: HorizontalAligner;
  private readonly font: PhetFont;
  private readonly arrowNode: RightArrowNode;

  // the set of EquationTermNodes in the equation
  private readonly termNodes: EquationTermNode[];

  // the parent for all terms and the "+" operators
  private readonly termsParent: Node;

  // PDOM structure for organizing reactant and product terms
  private readonly reactantTermsHeading: Node;
  private readonly productTermsHeading: Node;

  private readonly disposeEquationNode: () => void;

  /**
   * @param equation
   * @param aligner - provides layout information to ensure horizontal alignment with other user-interface elements
   * @param providedOptions
   */
  public constructor( equation: Equation, aligner: HorizontalAligner, providedOptions: EquationNodeOptions ) {

    const options = optionize<EquationNodeOptions, SelfOptions, NodeOptions>()( {

      // SelfOptions
      font: DEFAULT_FONT
    }, providedOptions );

    super( options );

    this.equation = equation;
    this.aligner = aligner;
    this.font = options.font;

    // arrow node, at a fixed position
    this.arrowNode = new RightArrowNode( new Property( equation ), {
      centerX: this.aligner.getScreenCenterX(),
      tandem: Tandem.OPT_OUT
    } );
    this.addChild( this.arrowNode );

    this.termNodes = [];
    this.termsParent = new Node();
    this.addChild( this.termsParent );

    // Create PDOM heading nodes for reactants and products
    this.reactantTermsHeading = new Node( {
      accessibleHeading: BalancingChemicalEquationsStrings.reactantsStringProperty
    } );
    this.termsParent.addChild( this.reactantTermsHeading );

    this.productTermsHeading = new Node( {
      accessibleHeading: BalancingChemicalEquationsStrings.productsStringProperty
    } );
    this.termsParent.addChild( this.productTermsHeading );

    // Create the reactants side of the equation.
    this.createSideOfEquation( this.equation.reactants, this.aligner.getReactantXOffsets( this.equation ),
      this.aligner.getReactantsBoxLeft(), this.aligner.getReactantsBoxRight(), 'reactant', options.tandem, this.reactantTermsHeading );

    // Create the products side of the equation.
    this.createSideOfEquation( this.equation.products, this.aligner.getProductXOffsets( this.equation ),
      this.aligner.getProductsBoxLeft(), this.aligner.getScreenRight(), 'product', options.tandem, this.productTermsHeading );

    if ( this.isPhetioInstrumented() && equation.isPhetioInstrumented() ) {
      this.addLinkedElement( equation );
    }

    this.disposeEquationNode = () => {
      this.arrowNode.dispose();
      this.termNodes.forEach( termNode => termNode.dispose() );
    };
  }

  public override dispose(): void {
    this.disposeEquationNode();
    super.dispose();
  }

  /**
   * Creates one side of the equation.
   * @param terms
   * @param xOffsets
   * @param minX - minimal possible x for equation
   * @param maxX - maximum possible x for equation
   * @param tandemNamePrefix
   * @param parentTandem
   * @param headingParent - the parent node for this side of the equation (for PDOM structure)
   */
  private createSideOfEquation( terms: EquationTerm[], xOffsets: number[], minX: number, maxX: number, tandemNamePrefix: string, parentTandem: Tandem, headingParent: Node ): void {
    affirm( terms.length > 0 );

    let plusNode;
    let termNode: EquationTermNode | null = null;
    const minSeparation = 15;
    const tempNodes = []; // contains all nodes for position adjustment if needed

    for ( let i = 0; i < terms.length; i++ ) {

      const term = terms[ i ];

      // term
      termNode = new EquationTermNode( term, {
        font: this.font,
        tandem: parentTandem.createTandem( `${tandemNamePrefix}${i + 1}Node` )
      } );
      this.termNodes.push( termNode );
      headingParent.addChild( termNode );
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
        headingParent.addChild( plusNode );
        plusNode.centerX = xOffsets[ i ] + ( ( xOffsets[ i + 1 ] - xOffsets[ i ] ) / 2 ); // centered between 2 offsets;
        plusNode.centerY = termNode.centerY;
        tempNodes.push( plusNode );

        // if previous node over plusNode move node to the left
        if ( termNode.bounds.maxX + minSeparation > plusNode.bounds.minX ) {
          termNode.x = termNode.x - ( termNode.bounds.maxX + minSeparation - plusNode.bounds.minX );
        }
      }
    }

    // Check if equation fits minX (eg, C2H5OH + 3O2 -> 2CO2 + 3H2O), and adjust all terms to the right.
    if ( tempNodes[ 0 ].bounds.minX < minX ) {
      let rightBound = minX; // Current right bound of passed terms, if term.minX < rightBound, move term to the right.
      tempNodes.forEach( term => {
        term.x += Math.max( 0, rightBound - term.bounds.minX );
        rightBound = term.bounds.maxX + minSeparation;
      } );
    }

    // Check if equation fits maxX (eg, CH3OH -> CO + 2H2), and adjust all terms to the left.
    if ( tempNodes[ tempNodes.length - 1 ].bounds.maxX > maxX ) {
      let leftBound = maxX; // Current left bound of passed terms, if term.maxX > leftBound, move term to the left.
      for ( let i = tempNodes.length - 1; i > -1; i-- ) {
        const term = tempNodes[ i ];
        term.x -= Math.max( 0, term.bounds.maxX - leftBound );
        leftBound = term.bounds.minX - minSeparation;
      }
    }

    affirm( termNode );
    this.arrowNode.centerY = termNode.centerY;
  }

  /**
   * Enables or disables the highlighting feature.
   * When enabled, the arrow between the left and right sides of the equation will light up when the equation is balanced.
   * This is enabled by default, but we want to disable in the Game until the user presses the "Check" button.
   */
  public setBalancedHighlightEnabled( enabled: boolean ): void {
    this.arrowNode.setHighlightEnabled( enabled );
  }

  /**
   * Sets whether coefficients are editable, by showing/hiding the arrows on the NumberPicker associated with each term.
   */
  public setCoefficientsEditable( editable: boolean ): void {
    for ( let i = 0; i < this.termNodes.length; i++ ) {
      this.termNodes[ i ].setCoefficientEditable( editable );
    }
  }
}

balancingChemicalEquations.register( 'EquationNode', EquationNode );