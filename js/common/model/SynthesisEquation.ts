// Copyright 2014-2025, University of Colorado Boulder

/**
 * SynthesisEquation is the model for synthesis equations.
 * In a synthesis reaction two or more chemical species combine to form a more complex product.
 * All synthesis equations in this sim have 2 reactants and 1 product.
 *
 * @author Vasily Shakhov (mlearner.com)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import Range from '../../../../dot/js/Range.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import Equation from './Equation.js';
import EquationTerm from './EquationTerm.js';
import Molecule from './Molecule.js';

export default class SynthesisEquation extends Equation {

  /**
   * @param r1 - balanced coefficient for reactant1
   * @param reactant1
   * @param r2 - balanced coefficient for reactant2
   * @param reactant2
   * @param p1 - balanced coefficient for product1
   * @param product1
   * @param coefficientsRange  - range of all coefficients in the equation
   * @param tandem
   */
  public constructor( r1: number, reactant1: Molecule,
                      r2: number, reactant2: Molecule,
                      p1: number, product1: Molecule,
                      coefficientsRange: Range,
                      tandem = Tandem.OPT_OUT ) {

    const termsTandem = tandem.createTandem( 'terms' );

    super(
      [
        new EquationTerm( r1, reactant1, {
          coefficientRange: coefficientsRange,
          tandem: termsTandem.createTandem( reactant1.symbolPlainText )
        } ),
        new EquationTerm( r2, reactant2, {
          coefficientRange: coefficientsRange,
          tandem: termsTandem.createTandem( reactant2.symbolPlainText )
        } )
      ],
      [
        new EquationTerm( p1, product1, {
          coefficientRange: coefficientsRange,
          tandem: termsTandem.createTandem( product1.symbolPlainText )
        } )
      ],
      tandem
    );
  }
}

balancingChemicalEquations.register( 'SynthesisEquation', SynthesisEquation );