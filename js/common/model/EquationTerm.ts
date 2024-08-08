// Copyright 2014-2023, University of Colorado Boulder

/**
 * A term in a chemical equation.
 * The "balanced coefficient" is the lowest coefficient value that will balance the equation, and is immutable.
 * The "user coefficient" is the coefficient set by the user.
 *
 * @author Vasily Shakhov (mlearner.com)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import optionize from '../../../../phet-core/js/optionize.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import BCEQueryParameters from '../BCEQueryParameters.js';
import Molecule from './Molecule.js';

type SelfOptions = {
  initialCoefficient?: number; // initial value of the coefficient
};

type EquationTermOptions = SelfOptions;

export default class EquationTerm {

  public readonly balancedCoefficient: number;
  public readonly molecule: Molecule;
  public readonly userCoefficientProperty: Property<number>;

  public constructor( balancedCoefficient: number, molecule: Molecule, providedOptions?: EquationTermOptions ) {

    const options = optionize<EquationTermOptions, SelfOptions>()( {

      // SelfOptions
      initialCoefficient: 0
    }, providedOptions );

    // If we're inspecting all game challenges, fill in the correct answer to make our job easier.
    if ( BCEQueryParameters.playAll ) {
      options.initialCoefficient = balancedCoefficient;
    }

    this.balancedCoefficient = balancedCoefficient;
    this.molecule = molecule;

    this.userCoefficientProperty = new NumberProperty( options.initialCoefficient, {
      numberType: 'Integer'
    } );
  }

  public reset(): void {
    this.userCoefficientProperty.reset();
  }
}

balancingChemicalEquations.register( 'EquationTerm', EquationTerm );