// Copyright 2014-2025, University of Colorado Boulder

/**
 * EquationTerm is a term in a chemical equation.
 * The "balanced coefficient" is the lowest coefficient value that will balance the equation, and is immutable.
 * The "user coefficient" is the coefficient set by the user.
 *
 * @author Vasily Shakhov (mlearner.com)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import optionize from '../../../../phet-core/js/optionize.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import BCEQueryParameters from '../BCEQueryParameters.js';
import Molecule from './Molecule.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import Range from '../../../../dot/js/Range.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';

type SelfOptions = {
  initialCoefficient?: number; // initial value of the coefficient
  coefficientRange: Range;
};

type EquationTermOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class EquationTerm {

  // The lowest possible coefficient (simplified) that will balance the equation.
  public readonly balancedCoefficient: number;

  // The molecule associated with this term.
  public readonly molecule: Molecule;

  // The coefficient entered by the user. NumberProperty because we need rangeProperty.
  public readonly coefficientProperty: NumberProperty;

  public constructor( balancedCoefficient: number, molecule: Molecule, providedOptions: EquationTermOptions ) {

    const options = optionize<EquationTermOptions, SelfOptions, PhetioObjectOptions>()( {

      // SelfOptions
      initialCoefficient: 0
    }, providedOptions );

    // If we're inspecting all game challenges, fill in the correct answer to make our job easier.
    if ( BCEQueryParameters.playAll ) {
      options.initialCoefficient = balancedCoefficient;
    }

    this.balancedCoefficient = balancedCoefficient;
    this.molecule = molecule;

    this.coefficientProperty = new NumberProperty( options.initialCoefficient, {
      numberType: 'Integer',
      range: options.coefficientRange,
      tandem: options.tandem.createTandem( 'coefficientProperty' )
    } );
  }

  public reset(): void {
    this.coefficientProperty.reset();
  }
}

balancingChemicalEquations.register( 'EquationTerm', EquationTerm );