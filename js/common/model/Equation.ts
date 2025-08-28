// Copyright 2014-2025, University of Colorado Boulder

/**
 * Equation is the model for a chemical equation.
 * A chemical equation has 2 sets of terms, reactants and products.
 * During the chemical reaction represented by the equation, reactants are transformed into products.
 *
 * @author Vasily Shakhov (mlearner.com)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import AtomCount from './AtomCount.js';
import EquationTerm from './EquationTerm.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import ReferenceIO, { ReferenceIOState } from '../../../../tandem/js/types/ReferenceIO.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import BooleanIO from '../../../../tandem/js/types/BooleanIO.js';
import Molecule from './Molecule.js';
import Range from '../../../../dot/js/Range.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import isSettingPhetioStateProperty from '../../../../tandem/js/isSettingPhetioStateProperty.js';

// Unicode symbols
const RIGHTWARDS_BLACK_ARROW = '\u2B95';
const WHITE_SQUARE_WITH_ROUNDED_CORNERS = '\u25A2';

export default class Equation extends PhetioObject {

  // terms on the left side of the equation
  public readonly reactants: EquationTerm[];

  // terms on the right side of the equation
  public readonly products: EquationTerm[];

  // all terms
  public readonly terms: EquationTerm[];

  // Whether the equation is balanced.
  public readonly isBalancedProperty: TReadOnlyProperty<boolean>;

  // Whether the equation is balanced with the smallest possible coefficients.
  public readonly isSimplifiedProperty: TReadOnlyProperty<boolean>;

  // Whether the equation has at least one non-zero coefficient.
  public readonly hasNonZeroCoefficientProperty: TReadOnlyProperty<boolean>;

  /**
   * Constructor is private because all Equation instances are created via the static factory methods.
   * @param reactants terms on the left side of the equation
   * @param products terms on the right side of the equation
   * @param tandem
   */
  private constructor( reactants: EquationTerm[], products: EquationTerm[], tandem: Tandem ) {

    super( {
      isDisposable: false,
      tandem: tandem,
      phetioDocumentation: createEquationString( reactants, products ),
      phetioFeatured: true,
      phetioState: false,
      phetioType: Equation.EquationIO
    } );

    this.reactants = reactants;
    this.products = products;
    this.terms = [ ...reactants, ...products ];

    const coefficientProperties = this.terms.map( term => term.coefficientProperty );

    // An equation is balanced if all terms have a non-zero coefficient that is the same integer multiple
    // of the term's balanced coefficient.
    this.isBalancedProperty = DerivedProperty.deriveAny( [ ...coefficientProperties ], () => {
      const multiplier = this.reactants[ 0 ].coefficientProperty.value / this.reactants[ 0 ].balancedCoefficient;
      return _.every( this.terms, term => ( term.coefficientProperty.value !== 0 ) &&
                                          ( term.coefficientProperty.value === multiplier * term.balancedCoefficient ) );
    }, {
      tandem: tandem.createTandem( 'isBalancedProperty' ),
      phetioFeatured: true,
      phetioValueType: BooleanIO
    } );

    // An equation is simplified if the equation is balanced with the lowest possible coefficients for all terms.
    this.isSimplifiedProperty = DerivedProperty.deriveAny( [ ...coefficientProperties ],
      () => _.every( this.terms, term => term.coefficientProperty.value === term.balancedCoefficient ), {
        tandem: tandem.createTandem( 'isSimplifiedProperty' ),
        phetioDocumentation: 'Whether the equation is balanced with the smallest possible coefficients.',
        phetioFeatured: true,
        phetioValueType: BooleanIO
      } );

    this.hasNonZeroCoefficientProperty = DerivedProperty.deriveAny( coefficientProperties,
      () => !!_.find( coefficientProperties, coefficientProperties => coefficientProperties.value !== 0 ) );
  }

  public reset(): void {
    this.reactants.forEach( reactant => reactant.reset() );
    this.products.forEach( product => product.reset() );
  }

  /**
   * Convenience method for adding a listener to all coefficients.
   */
  public lazyLinkCoefficientProperties( listener: () => void ): void {
    this.reactants.forEach( reactant => reactant.coefficientProperty.lazyLink( listener ) );
    this.products.forEach( product => product.coefficientProperty.lazyLink( listener ) );
  }

  /**
   * Convenience method for removing a listener from all coefficients.
   */
  public unlinkCoefficientProperties( listener: () => void ): void {

    this.reactants.forEach( reactant => {
      if ( reactant.coefficientProperty.hasListener( listener ) ) {
        reactant.coefficientProperty.unlink( listener );
      }
    } );

    this.products.forEach( product => {
      if ( product.coefficientProperty.hasListener( listener ) ) {
        product.coefficientProperty.unlink( listener );
      }
    } );
  }

  /**
   * For all terms in the equation, change the initial value of coefficientProperty and reset coefficientProperty.
   */
  public setInitialCoefficients( initialCoefficient: number ): void {
    this.terms.forEach( term => {
      term.coefficientProperty.setInitialValue( initialCoefficient );
      if ( !isSettingPhetioStateProperty.value ) {
        term.coefficientProperty.reset();
      }
    } );
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
      term.coefficientProperty.value = term.balancedCoefficient;
    } );
    this.products.forEach( term => {
      term.coefficientProperty.value = term.balancedCoefficient;
    } );
  }

  /**
   * Gets a string that shows just the coefficients of the equations.
   * This is used to show the balanced coefficients when running with ?showAnswers.
   */
  public getAnswerString(): string {
    let string = '';
    for ( let i = 0; i < this.reactants.length; i++ ) {
      string += this.reactants[ i ].balancedCoefficient;
      if ( i < this.reactants.length - 1 ) {
        string += ' + ';
      }
    }
    string += ` ${RIGHTWARDS_BLACK_ARROW} `; // right arrow, with space before and after
    for ( let i = 0; i < this.products.length; i++ ) {
      string += this.products[ i ].balancedCoefficient;
      if ( i < this.products.length - 1 ) {
        string += ' + ';
      }
    }
    return string;
  }

  /**
   * Gets a string for this equation that is suitable for displaying in the UI.
   * Specifically, this string is used in EquationsComboBox.
   */
  public getDisplayString(): string {
    return createEquationString( this.reactants, this.products, WHITE_SQUARE_WITH_ROUNDED_CORNERS );
  }

  /**
   * String value of an equation that is suitable for debugging. Do not rely on this format!
   */
  public override toString(): string {
    let string = createEquationString( this.reactants, this.products );

    // strip out HTML tags to improve readability
    string = string.replace( /<sub>/g, '' );
    string = string.replace( /<\/sub>/g, '' );

    return string;
  }

  /**
   * Factory method for creating an Equation with 2 reactants and 1 product.
   * @param r1 - balanced coefficient for reactant1
   * @param reactant1
   * @param r2 - balanced coefficient for reactant2
   * @param reactant2
   * @param p1 - balanced coefficient for product1
   * @param product1
   * @param coefficientsRange  - range of all coefficients in the equation
   * @param tandem
   * @param coefficientPropertyPhetioReadOnly
   */
  public static create2Reactants1Product( r1: number, reactant1: Molecule,
                                          r2: number, reactant2: Molecule,
                                          p1: number, product1: Molecule,
                                          coefficientsRange: Range,
                                          tandem: Tandem,
                                          coefficientPropertyPhetioReadOnly = false ): Equation {

    let reactantNumber = 1;
    let productNumber = 1;

    return new Equation(
      // Reactants
      [
        new EquationTerm( r1, reactant1, {
          coefficientRange: coefficientsRange,
          coefficientPropertyPhetioReadOnly: coefficientPropertyPhetioReadOnly,
          tandem: tandem.createTandem( `reactant${reactantNumber++}` )
        } ),
        new EquationTerm( r2, reactant2, {
          coefficientRange: coefficientsRange,
          coefficientPropertyPhetioReadOnly: coefficientPropertyPhetioReadOnly,
          tandem: tandem.createTandem( `reactant${reactantNumber++}` )
        } )
      ],

      // Products
      [
        new EquationTerm( p1, product1, {
          coefficientRange: coefficientsRange,
          coefficientPropertyPhetioReadOnly: coefficientPropertyPhetioReadOnly,
          tandem: tandem.createTandem( `product${productNumber++}` )
        } )
      ],
      tandem
    );
  }

  /**
   * Factory method for creating an Equation with 1 reactant and 2 products.
   * @param r1 - balanced coefficient for reactant1
   * @param reactant1
   * @param p1 - balanced coefficient for product1
   * @param product1
   * @param p2 - balanced coefficient for product2
   * @param product2
   * @param coefficientsRange - range of all coefficients in the equation
   * @param tandem
   * @param coefficientPropertyPhetioReadOnly
   */
  public static create1Reactant2Products( r1: number, reactant1: Molecule,
                                          p1: number, product1: Molecule,
                                          p2: number, product2: Molecule,
                                          coefficientsRange: Range,
                                          tandem: Tandem,
                                          coefficientPropertyPhetioReadOnly = false ): Equation {
    let reactantNumber = 1;
    let productNumber = 1;

    return new Equation(
      // Reactants
      [
        new EquationTerm( r1, reactant1, {
          coefficientRange: coefficientsRange,
          coefficientPropertyPhetioReadOnly: coefficientPropertyPhetioReadOnly,
          tandem: tandem.createTandem( `reactant${reactantNumber++}` )
        } )
      ],

      // Products
      [
        new EquationTerm( p1, product1, {
          coefficientRange: coefficientsRange,
          coefficientPropertyPhetioReadOnly: coefficientPropertyPhetioReadOnly,
          tandem: tandem.createTandem( `product${productNumber++}` )
        } ),
        new EquationTerm( p2, product2, {
          coefficientRange: coefficientsRange,
          coefficientPropertyPhetioReadOnly: coefficientPropertyPhetioReadOnly,
          tandem: tandem.createTandem( `product${productNumber++}` )
        } )
      ],
      tandem
    );
  }

  /**
   * Factory method for creating an Equation with 2 reactant and 2 products.
   * @param r1 - balanced coefficient for reactant1
   * @param reactant1
   * @param r2 - balanced coefficient for reactant2
   * @param reactant2
   * @param p1 - balanced coefficient for product1
   * @param product1
   * @param p2 - balanced coefficient for product2
   * @param product2
   * @param coefficientsRange - range of all coefficients in the equation
   * @param tandem
   * @param coefficientPropertyPhetioReadonly
   */
  public static create2Reactants2Products( r1: number, reactant1: Molecule,
                                           r2: number, reactant2: Molecule,
                                           p1: number, product1: Molecule,
                                           p2: number, product2: Molecule,
                                           coefficientsRange: Range,
                                           tandem: Tandem,
                                           coefficientPropertyPhetioReadOnly = false ): Equation {
    let reactantNumber = 1;
    let productNumber = 1;

    return new Equation(
      // Reactants
      [
        new EquationTerm( r1, reactant1, {
          coefficientRange: coefficientsRange,
          coefficientPropertyPhetioReadOnly: coefficientPropertyPhetioReadOnly,
          tandem: tandem.createTandem( `reactant${reactantNumber++}` )
        } ),
        new EquationTerm( r2, reactant2, {
          coefficientRange: coefficientsRange,
          coefficientPropertyPhetioReadOnly: coefficientPropertyPhetioReadOnly,
          tandem: tandem.createTandem( `reactant${reactantNumber++}` )
        } )
      ],

      // Products
      [
        new EquationTerm( p1, product1, {
          coefficientRange: coefficientsRange,
          coefficientPropertyPhetioReadOnly: coefficientPropertyPhetioReadOnly,
          tandem: tandem.createTandem( `product${productNumber++}` )
        } ),
        new EquationTerm( p2, product2, {
          coefficientRange: coefficientsRange,
          coefficientPropertyPhetioReadOnly: coefficientPropertyPhetioReadOnly,
          tandem: tandem.createTandem( `product${productNumber++}` )
        } )
      ],
      tandem
    );
  }

  /**
   * EquationIO handles serialization of an Equation. It implements reference-type serialization, as
   * described in https://github.com/phetsims/phet-io/blob/main/doc/phet-io-instrumentation-technical-guide.md#serialization.
   */
  public static readonly EquationIO = new IOType<Equation, ReferenceIOState>( 'EquationIO', {
    valueType: Equation,
    supertype: ReferenceIO( IOType.ObjectIO )
  } );
}

/**
 * Creates a string version of an equation. This string is suitable for display in the UI, and for PhET-iO documentation.
 */
function createEquationString( reactants: EquationTerm[], products: EquationTerm[], coefficientsString?: string ): string {
  let string = '';

  // reactants
  for ( let i = 0; i < reactants.length; i++ ) {
    string += coefficientsString || reactants[ i ].balancedCoefficient;
    string += ' ';
    string += reactants[ i ].molecule.symbol;
    if ( i < reactants.length - 1 ) {
      string += ' + ';
    }
  }

  // right arrow, with space before and after
  string += ` ${RIGHTWARDS_BLACK_ARROW} `;

  // products
  for ( let i = 0; i < products.length; i++ ) {
    string += coefficientsString || products[ i ].balancedCoefficient;
    string += ' ';
    string += products[ i ].molecule.symbol;
    if ( i < products.length - 1 ) {
      string += ' + ';
    }
  }

  return string;
}

balancingChemicalEquations.register( 'Equation', Equation );