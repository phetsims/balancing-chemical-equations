// Copyright 2014-2024, University of Colorado Boulder

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
import IOType from '../../../../tandem/js/types/IOType.js';
import ReferenceIO, { ReferenceIOState } from '../../../../tandem/js/types/ReferenceIO.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';

export default class Equation extends PhetioObject {

  // terms on the left side of the equation
  public readonly reactants: EquationTerm[];

  // terms on the right side of the equation
  public readonly products: EquationTerm[];

  // whether the equation is balanced
  public readonly isBalancedProperty: TReadOnlyProperty<boolean>;
  private readonly _isBalancedProperty: Property<boolean>;

  // whether the equation is balanced with the smallest possible coefficients
  private isBalancedAndSimplifiedProperty: Property<boolean>;

  // a sum of all coefficients, so we know when the sum is non-zero
  public readonly coefficientsSumProperty: TReadOnlyProperty<number>;
  private readonly _coefficientsSumProperty: Property<number>;

  /**
   * @param reactants terms on the left side of the equation
   * @param products terms on the right side of the equation
   * @param tandem
   */
  protected constructor( reactants: EquationTerm[], products: EquationTerm[], tandem = Tandem.OPT_OUT ) {

    super( {
      tandem: tandem,
      phetioType: Equation.EquationIO
    } );

    this.reactants = reactants;
    this.products = products;

    //TODO https://github.com/phetsims/balancing-chemical-equations/issues/160 Can isBalancedProperty be a DerivedProperty?
    this._isBalancedProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'isBalancedProperty' ),
      phetioFeatured: true,
      phetioReadOnly: true
    } );
    this.isBalancedProperty = this._isBalancedProperty;

    //TODO https://github.com/phetsims/balancing-chemical-equations/issues/160 Can isBalancedAndSimplifiedProperty be a DerivedProperty?
    this.isBalancedAndSimplifiedProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'isBalancedAndSimplifiedProperty' ),
      phetioFeatured: true,
      phetioReadOnly: true
    } );

    //TODO https://github.com/phetsims/balancing-chemical-equations/issues/160 Can coefficientsSumProperty be a DerivedProperty?
    this._coefficientsSumProperty = new NumberProperty( 0, {
      numberType: 'Integer',
      tandem: tandem.createTandem( 'coefficientsSumProperty' ),
      phetioFeatured: true,
      phetioReadOnly: true
    } );
    this.coefficientsSumProperty = this._coefficientsSumProperty;

    this.addCoefficientsObserver( this.updateBalanced.bind( this ) );

    // keep a sum of all coefficients, so we know when the sum is non-zero
    this.addCoefficientsObserver( () => {
      let coefficientsSum = 0;
      const addCoefficients = ( equationTerm: EquationTerm ) => {
        coefficientsSum += equationTerm.userCoefficientProperty.value;
      };
      this.reactants.forEach( reactant => addCoefficients( reactant ) );
      this.products.forEach( product => addCoefficients( product ) );
      this._coefficientsSumProperty.value = coefficientsSum;
    } );
  }

  public get isBalancedAndSimplified(): boolean {
    return this.isBalancedAndSimplifiedProperty.value;
  }

  public reset(): void {

    this._isBalancedProperty.reset();
    this.isBalancedAndSimplifiedProperty.reset();
    this._coefficientsSumProperty.reset();

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
    let isBalanced = ( multiplier > 0 );

    // Check each term to see if the actual coefficient is the same integer multiple of the balanced coefficient.
    this.reactants.forEach( reactant => {
      isBalanced = isBalanced && ( reactant.userCoefficientProperty.value === multiplier * reactant.balancedCoefficient );
    } );
    this.products.forEach( product => {
      isBalanced = isBalanced && ( product.userCoefficientProperty.value === multiplier * product.balancedCoefficient );
    } );

    this.isBalancedAndSimplifiedProperty.value = isBalanced && ( multiplier === 1 ); // set the more specific value first
    this._isBalancedProperty.value = isBalanced;
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
  public override toString(): string {
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

  /**
   * EquationIO handles serialization an Equation. It implements reference-type serialization, as
   * described in https://github.com/phetsims/phet-io/blob/main/doc/phet-io-instrumentation-technical-guide.md#serialization.
   */
  public static readonly EquationIO = new IOType<Equation, ReferenceIOState>( 'EquationIO', {
    valueType: Equation,
    supertype: ReferenceIO( IOType.ObjectIO )
  } );
}

balancingChemicalEquations.register( 'Equation', Equation );