// Copyright 2014-2023, University of Colorado Boulder

/**
 * Equation is the base class for all chemical equations.
 * A chemical equation has 2 sets of terms, reactants and products.
 * During the chemical reaction represented by the equation, reactants are transformed into products.
 * <p/>
 * An equation is "balanced" when each term's user coefficient is an integer multiple N of
 * the balanced coefficient, N is the same for all terms in the equation, and N >= 1.
 * An equation is "balanced and simplified" when it is balanced and N=1.
 *
 * @author Vasily Shakhov (mlearner.com)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import AtomCount from './AtomCount.js';
import EquationTerm from './EquationTerm.js';

export default class Equation {

  // terms on the left side of the equation
  public readonly reactants: EquationTerm[];

  // terms on the right side of the equation
  public readonly products: EquationTerm[];

  // whether the equation is balanced
  public readonly balancedProperty: Property<boolean>;

  // a sum of all coefficients, so we know when the sum is non-zero
  public readonly coefficientsSumProperty: Property<number>;

  // true = balanced with the lowest possible coefficients
  public balancedAndSimplified: boolean;

  /**
   * @param reactants terms on the left side of the equation
   * @param products terms on the right side of the equation
   */
  protected constructor( reactants: EquationTerm[], products: EquationTerm[] ) {

    this.reactants = reactants;
    this.products = products;
    this.balancedProperty = new BooleanProperty( false );
    this.coefficientsSumProperty = new NumberProperty( 0, { numberType: 'Integer' } );
    this.balancedAndSimplified = false;

    this.addCoefficientsObserver( this.updateBalanced.bind( this ) );

    // keep a sum of all coefficients, so we know when the sum is non-zero
    this.addCoefficientsObserver( () => {
      let coefficientsSum = 0;
      const addCoefficients = ( equationTerm: EquationTerm ) => {
        coefficientsSum += equationTerm.userCoefficientProperty.value;
      };
      this.reactants.forEach( reactant => addCoefficients( reactant ) );
      this.products.forEach( product => addCoefficients( product ) );
      this.coefficientsSumProperty.value = coefficientsSum;
    } );
  }

  public reset(): void {

    this.balancedProperty.reset();
    this.coefficientsSumProperty.reset();

    this.reactants.forEach( reactant => reactant.reset() );
    this.products.forEach( product => product.reset() );
  }

  /**
   * An equation is balanced if all of its terms have a coefficient that is the same integer multiple of the term's
   * balanced coefficient. If the integer multiple is 1, then the term is "balanced and simplified" - balanced with
   * the lowest possible coefficients.
   */
  private updateBalanced(): void {

    // Get integer multiplier from the first reactant term.
    const multiplier = this.reactants[ 0 ].userCoefficientProperty.value / this.reactants[ 0 ].balancedCoefficient;
    let balanced = ( multiplier > 0 );

    // Check each term to see if the actual coefficient is the same integer multiple of the balanced coefficient.
    this.reactants.forEach( reactant => {
      balanced = balanced && ( reactant.userCoefficientProperty.value === multiplier * reactant.balancedCoefficient );
    } );
    this.products.forEach( product => {
      balanced = balanced && ( product.userCoefficientProperty.value === multiplier * product.balancedCoefficient );
    } );

    this.balancedAndSimplified = balanced && ( multiplier === 1 ); // set the more specific value first
    this.balancedProperty.value = balanced;
  }

  /**
   * Convenience method for adding an observer to all coefficients.
   */
  public addCoefficientsObserver( observer: () => void ): void {
    this.reactants.forEach( reactant => reactant.userCoefficientProperty.lazyLink( observer ) );
    this.products.forEach( product => product.userCoefficientProperty.lazyLink( observer ) );
    observer();
  }

  /**
   * Convenience method for removing an observer from all coefficients.
   */
  public removeCoefficientsObserver( observer: () => void ): void {
    this.reactants.forEach( reactant => reactant.userCoefficientProperty.unlink( observer ) );
    this.products.forEach( product => product.userCoefficientProperty.unlink( observer ) );
  }

  /**
   * Returns a count of each type of atom, based on the user coefficients.
   */
  public getAtomCounts(): AtomCount[] {
    return AtomCount.countAtoms( this );
  }

  /**
   * Does this equation contain at least one "big" molecule? This affects degree of difficulty in the Game.
   */
  public hasBigMolecule(): boolean {
    return !!_.find( this.reactants, reactant => reactant.molecule.isBig() ) ||
           !!_.find( this.products, product => product.molecule.isBig() );
  }

  /**
   * Balances the equation by copying the balanced coefficient value to
   * the user coefficient value for each term in the equation.
   */
  public balance(): void {
    this.reactants.forEach( term => {
      term.userCoefficientProperty.value = term.balancedCoefficient;
    } );
    this.products.forEach( term => {
      term.userCoefficientProperty.value = term.balancedCoefficient;
    } );
  }

  /**
   * Gets a string that shows just the coefficients of the equations.
   * This is used to show game answers when running in 'dev' mode.
   */
  public getCoefficientsString(): string {
    let string = '';
    for ( let i = 0; i < this.reactants.length; i++ ) {
      string += this.reactants[ i ].balancedCoefficient;
      string += ( i < this.reactants.length - 1 ) ? ' + ' : ' ';
    }
    string += '\u2192 '; // right arrow
    for ( let i = 0; i < this.products.length; i++ ) {
      string += this.products[ i ].balancedCoefficient;
      string += ( i < this.products.length - 1 ) ? ' + ' : '';
    }
    return string;
  }

  /**
   * String value of an equation, shows balanced coefficients, for debugging. Do not rely on this format!
   */
  public toString(): string {
    let string = '';

    // reactants
    for ( let i = 0; i < this.reactants.length; i++ ) {
      string += this.reactants[ i ].balancedCoefficient;
      string += ' ';
      string += this.reactants[ i ].molecule.symbol;
      if ( i < this.reactants.length - 1 ) {
        string += ' + ';
      }
    }

    // right arrow
    string += ' \u2192 ';

    // products
    for ( let i = 0; i < this.products.length; i++ ) {
      string += this.products[ i ].balancedCoefficient;
      string += ' ';
      string += this.products[ i ].molecule.symbol;
      if ( i < this.products.length - 1 ) {
        string += ' + ';
      }
    }

    // strip out HTML tags to improve readability
    string = string.replace( /<sub>/g, '' );
    string = string.replace( /<\/sub>/g, '' );

    return string;
  }
}

balancingChemicalEquations.register( 'Equation', Equation );