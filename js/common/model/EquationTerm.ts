// Copyright 2014-2025, University of Colorado Boulder

/**
 * EquationTerm is a term in a chemical equation.
 *
 * @author Vasily Shakhov (mlearner.com)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import optionize from '../../../../phet-core/js/optionize.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import BCEQueryParameters from '../BCEQueryParameters.js';
import Molecule from './Molecule.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import Range from '../../../../dot/js/Range.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';

type SelfOptions = {
  coefficientRange: Range;
  coefficientPropertyPhetioReadOnly?: boolean;
};

type EquationTermOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class EquationTerm extends PhetioObject {

  // The lowest possible coefficient (simplified) that will balance the equation.
  public readonly balancedCoefficient: number;

  // The molecule associated with this term.
  public readonly molecule: Molecule;

  // The coefficient entered by the user. NumberProperty because we need rangeProperty.
  public readonly coefficientProperty: NumberProperty;

  public constructor( balancedCoefficient: number, molecule: Molecule, providedOptions: EquationTermOptions ) {

    assert && assert( Number.isInteger( balancedCoefficient ) && balancedCoefficient > 0,
      `balancedCoefficient must be a positive integer: ${balancedCoefficient}` );

    const options = optionize<EquationTermOptions, SelfOptions, PhetioObjectOptions>()( {

      // SelfOptions
      coefficientPropertyPhetioReadOnly: false,

      // PhetioObjectOptions
      phetioDocumentation: molecule.symbol,
      phetioState: false
    }, providedOptions );
    
    assert && assert( Number.isInteger( options.coefficientRange.min ) && options.coefficientRange.min >= 0,
      `coefficientRange.min must be a non-negative integer: ${options.coefficientRange.min}` );
    assert && assert( Number.isInteger( options.coefficientRange.max ) && options.coefficientRange.max >= 0,
      `coefficientRange.max must be a non-negative integer: ${options.coefficientRange.max}` );

    super( options );

    this.balancedCoefficient = balancedCoefficient;
    this.molecule = molecule;

    const initialCoefficient = BCEQueryParameters.autoBalance ? balancedCoefficient : BCEQueryParameters.initialCoefficient;

    this.coefficientProperty = new NumberProperty( initialCoefficient, {
      numberType: 'Integer',
      range: options.coefficientRange,
      tandem: options.tandem.createTandem( 'coefficientProperty' ),
      phetioFeatured: true,
      phetioReadOnly: options.coefficientPropertyPhetioReadOnly
    } );
  }

  public reset(): void {
    this.coefficientProperty.reset();
  }
}

balancingChemicalEquations.register( 'EquationTerm', EquationTerm );