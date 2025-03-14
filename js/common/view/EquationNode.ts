// Copyright 2014-2025, University of Colorado Boulder

/**
 * EquationNode displays a chemical equation.
 * Reactants are on the left-hand size, products are on the right-hand side.
 *
 * @author Vasily Shakhov (mlearner.com)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PlusNode from '../../../../scenery-phet/js/PlusNode.js';
import Node, { NodeOptions, NodeTranslationOptions } from '../../../../scenery/js/nodes/Node.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import Equation from '../model/Equation.js';
import EquationTerm from '../model/EquationTerm.js';
import EquationTermNode from './EquationTermNode.js';
import HorizontalAligner from './HorizontalAligner.js';
import RightArrowNode from './RightArrowNode.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';
import Property from '../../../../axon/js/Property.js';
import Tandem from '../../../../tandem/js/Tandem.js';

type SelfOptions = {
  fontSize?: number;
};

type EquationNodeOptions = SelfOptions & NodeTranslationOptions &
  PickOptional<NodeOptions, 'visibleProperty'> & PickRequired<NodeOptions, 'tandem'>;

export default class EquationNode extends Node {

  private readonly equation: Equation;
  private readonly coefficientRange: Range;
  private readonly aligner: HorizontalAligner;
  private readonly fontSize: number;
  private readonly arrowNode: RightArrowNode;

  // the set of EquationTermNodes in the equation
  private readonly termNodes: EquationTermNode[];

  // the parent for all terms and the "+" operators
  private readonly termsParent: Node;

  /**
   * @param equation
   * @param coefficientRange - range of the coefficients
   * @param aligner - provides layout information to ensure horizontal alignment with other user-interface elements
   * @param providedOptions
   */
  public constructor( equation: Equation, coefficientRange: Range, aligner: HorizontalAligner, providedOptions: EquationNodeOptions ) {

    const options = optionize<EquationNodeOptions, SelfOptions, NodeOptions>()( {

      // SelfOptions
      fontSize: 32
    }, providedOptions );

    super( options );

    this.equation = equation;
    this.coefficientRange = coefficientRange;
    this.aligner = aligner;
    this.fontSize = options.fontSize;

    // arrow node, at a fixed position
    this.arrowNode = new RightArrowNode( new Property( equation ), {
      centerX: this.aligner.getScreenCenterX()
    } );
    this.addChild( this.arrowNode );

    this.termNodes = [];
    this.termsParent = new Node();
    this.addChild( this.termsParent );

    const termNodesTandem = options.tandem.createTandem( 'termNodes' );

    // Create the reactants side of the equation.
    this.createSideOfEquation( this.equation.reactants, this.aligner.getReactantXOffsets( this.equation ),
      this.aligner.getReactantsBoxLeft(), this.aligner.getReactantsBoxRight(), termNodesTandem );

    // Create the products side of the equation.
    this.createSideOfEquation( this.equation.products, this.aligner.getProductXOffsets( this.equation ),
      this.aligner.getProductsBoxLeft(), this.aligner.getScreenRight(), termNodesTandem );

    this.disposeEmitter.addListener( () => {
      this.arrowNode.dispose();
      this.termNodes.forEach( termNode => termNode.dispose() );
    } );
  }

  /**
   * Creates one side of the equation.
   * @param terms
   * @param xOffsets
   * @param minX - minimal possible x for equation
   * @param maxX - maximum possible x for equation
   * @param parentTandem
   */
  private createSideOfEquation( terms: EquationTerm[], xOffsets: number[], minX: number, maxX: number, parentTandem: Tandem ): void {
    assert && assert( terms.length > 0 );

    let plusNode;
    let termNode: EquationTermNode | null = null;
    const minSeparation = 15;
    const tempNodes = []; // contains all nodes for position adjustment if needed

    for ( let i = 0; i < terms.length; i++ ) {

      const term = terms[ i ];

      const tandemName = `${term.molecule.symbolPlainText}Node`;

      // term
      termNode = new EquationTermNode( term, this.coefficientRange, {
        fontSize: this.fontSize,
        tandem: parentTandem.createTandem( tandemName )
      } );
      this.termNodes.push( termNode );
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

    // check if equation fits minX (eg, C2H5OH + 3O2 -> 2CO2 + 3H2O)
    if ( tempNodes[ 0 ].bounds.minX < minX ) { // adjust all terms to the right
      let rightBound = minX; // current right bound of passed terms, if term.minX<rightBound move term to the right
      tempNodes.forEach( term => {
        term.x += Math.max( 0, rightBound - term.bounds.minX );
        rightBound = term.bounds.maxX + minSeparation;
      } );
    }

    // check if equation fits maxX (eg, CH3OH -> CO + 2H2)
    if ( tempNodes[ tempNodes.length - 1 ].bounds.maxX > maxX ) { // adjust all terms to the left
      let leftBound = maxX; // current left bound of passed terms, if term.maxX > leftBound, move term to the left
      for ( let i = tempNodes.length - 1; i > -1; i-- ) {
        const term = tempNodes[ i ];
        term.x -= Math.max( 0, term.bounds.maxX - leftBound );
        leftBound = term.bounds.minX - minSeparation;
      }
    }

    assert && assert( termNode );
    this.arrowNode.centerY = termNode!.centerY;
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