// Copyright 2014-2023, University of Colorado Boulder

/**
 * Displays a chemical equation.
 * Reactants are on the left-hand size, products are on the right-hand side.
 *
 * @author Vasily Shakhov (mlearner.com)
 */

import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import PlusNode from '../../../../scenery-phet/js/PlusNode.js';
import { Node, NodeOptions, NodeTranslationOptions } from '../../../../scenery/js/imports.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import RightArrowNode from './RightArrowNode.js';
import TermNode from './TermNode.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import HorizontalAligner from './HorizontalAligner.js';
import Equation from '../model/Equation.js';
import optionize from '../../../../phet-core/js/optionize.js';
import EquationTerm from '../model/EquationTerm.js';

type SelfOptions = {
  fontSize?: number;
};

type EquationNodeOptions = SelfOptions & NodeTranslationOptions;

export default class EquationNode extends Node {

  private readonly equationProperty: TReadOnlyProperty<Equation>;
  private readonly coefficientRange: Range;
  private readonly aligner: HorizontalAligner;
  private readonly fontSize: number;
  private readonly arrowNode: RightArrowNode;

  // the set of TermNodes in the equation
  private readonly terms: TermNode[];

  // the parent for all terms and the "+" operators
  private readonly termsParent: Node;

  /**
   * @param equationProperty
   * @param coefficientRange - range of the coefficients
   * @param aligner - provides layout information to ensure horizontal alignment with other user-interface elements
   * @param [providedOptions]
   */
  public constructor( equationProperty: TReadOnlyProperty<Equation>, coefficientRange: Range,
                      aligner: HorizontalAligner, providedOptions?: EquationNodeOptions ) {

    const options = optionize<EquationNodeOptions, SelfOptions, NodeOptions>()( {

      // SelfOptions
      fontSize: 32
    }, providedOptions );

    super();

    this.equationProperty = equationProperty;
    this.coefficientRange = coefficientRange;
    this.aligner = aligner;
    this.fontSize = options.fontSize;

    // arrow node, at a fixed position
    this.arrowNode = new RightArrowNode( equationProperty, {
      centerX: this.aligner.getScreenCenterX()
    } );
    this.addChild( this.arrowNode );

    this.terms = [];
    this.termsParent = new Node();
    this.addChild( this.termsParent );

    // if the equation changes...
    equationProperty.link( ( newEquation, oldEquation ) => this.updateNode() );

    this.mutate( options );
  }

  // No dispose needed, instances of this type persist for lifetime of the sim.

  /**
   * Rebuilds the left and right sides of the equation.
   */
  private updateNode(): void {

    // dispose of existing instances of TermNode
    this.terms.forEach( termNode => termNode.dispose() );
    this.terms.length = 0;
    this.termsParent.removeAllChildren();

    const equation = this.equationProperty.value;
    this.updateSideOfEquation( equation.reactants, this.aligner.getReactantXOffsets( equation ),
      this.aligner.getReactantsBoxLeft(), this.aligner.getReactantsBoxRight() );
    this.updateSideOfEquation( equation.products, this.aligner.getProductXOffsets( equation ),
      this.aligner.getProductsBoxLeft(), this.aligner.getScreenRight() );
  }

  /**
   * Rebuilds one side of the equation.
   * @param terms
   * @param xOffsets
   * @param minX - minimal possible x for equation
   * @param maxX - maximum possible x for equation
   */
  private updateSideOfEquation( terms: EquationTerm[], xOffsets: number[], minX: number, maxX: number ): void {
    assert && assert( terms.length > 0 );

    let plusNode;
    let termNode: TermNode | null = null;
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
    for ( let i = 0; i < this.terms.length; i++ ) {
      this.terms[ i ].setCoefficientEditable( editable );
    }
  }
}

balancingChemicalEquations.register( 'EquationNode', EquationNode );