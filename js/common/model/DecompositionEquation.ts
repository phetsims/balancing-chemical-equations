// Copyright 2014-2025, University of Colorado Boulder

/**
 * DecompositionEquation is the model for decomposition equations.
 * In a decomposition reaction, a more complex substance breaks down into its more simple parts.
 * All decomposition equations in this sim have 1 reactant and 2 products.
 * This class adds no new functionality to Equation, it simply provides convenient factory methods.
 *
 * @author Vasily Shakhov (mlearner.com)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import Equation from './Equation.js';
import EquationTerm from './EquationTerm.js';
import Molecule from './Molecule.js';
import Range from '../../../../dot/js/Range.js';

export default class DecompositionEquation extends Equation {

  /**
   * @param r1 - balanced coefficient for reactant1
   * @param reactant1
   * @param p1 - balanced coefficient for product1
   * @param product1
   * @param p2 - balanced coefficient for product2
   * @param product2
   * @param coefficientsRange - range of all coefficients in the equation
   * @param tandem
   */
  public constructor( r1: number, reactant1: Molecule,
                      p1: number, product1: Molecule,
                      p2: number, product2: Molecule,
                      coefficientsRange: Range,
                      tandem: Tandem ) {

    let reactantNumber = 1;
    let productNumber = 1;

    super(
      [
        new EquationTerm( r1, reactant1, {
          coefficientRange: coefficientsRange,
          tandem: tandem.createTandem( `reactant${reactantNumber++}` )
        } )
      ],
      [
        new EquationTerm( p1, product1, {
          coefficientRange: coefficientsRange,
          tandem: tandem.createTandem( `product${productNumber++}` )
        } ),
        new EquationTerm( p2, product2, {
          coefficientRange: coefficientsRange,
          tandem: tandem.createTandem( `product${productNumber++}` )
        } )
      ],
      tandem
    );
  }
}

balancingChemicalEquations.register( 'DecompositionEquation', DecompositionEquation );