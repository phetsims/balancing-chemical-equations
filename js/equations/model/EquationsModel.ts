// Copyright 2025, University of Colorado Boulder

/**
 * EquationsModel is the top-level model for the 'Equations' screen
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import Range from '../../../../dot/js/Range.js';
import TModel from '../../../../joist/js/TModel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import Equation from '../../common/model/Equation.js';
import StringUnionProperty from '../../../../axon/js/StringUnionProperty.js';
import SynthesisEquation from '../../common/model/SynthesisEquation.js';
import Molecule from '../../common/model/Molecule.js';
import DecompositionEquation from '../../common/model/DecompositionEquation.js';
import DisplacementEquation from '../../common/model/DisplacementEquation.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';

const EquationTypeValues = [ 'synthesis', 'decomposition', 'combustion' ];
export type EquationType = ( typeof EquationTypeValues )[number];

export default class EquationsModel implements TModel {

  // Range of possible equation coefficients
  public readonly coefficientsRange: Range;

  // The type of equation that is selected
  public readonly equationTypeProperty: Property<EquationType>;

  public readonly synthesisEquations: SynthesisEquation[];
  public readonly decompositionEquations: DecompositionEquation[];
  public readonly combustionEquations: DisplacementEquation[];

  public readonly synthesisEquationProperty: Property<SynthesisEquation>;
  public readonly decompositionEquationProperty: Property<DecompositionEquation>;
  public readonly combustionEquationProperty: Property<DisplacementEquation>;

  // the equation that is selected
  public readonly equationProperty: TReadOnlyProperty<Equation>;

  public constructor( tandem: Tandem ) {

    this.coefficientsRange = new Range( 0, 6 );

    this.equationTypeProperty = new StringUnionProperty<EquationType>( 'synthesis', {
      validValues: EquationTypeValues,
      tandem: tandem.createTandem( 'equationTypeProperty' ),
      phetioFeatured: true
    } );

    const synthesisEquationsTandem = tandem.createTandem( 'synthesisEquations' );
    let equationIndex = 0;
    this.synthesisEquations = [
      new SynthesisEquation( 2, Molecule.C, 1, Molecule.O2, 2, Molecule.CO,
        this.coefficientsRange, synthesisEquationsTandem.createTandem( `equation${equationIndex++}` ) ),
      new SynthesisEquation( 2, Molecule.N2, 5, Molecule.O2, 2, Molecule.N2O5,
        this.coefficientsRange, synthesisEquationsTandem.createTandem( `equation${equationIndex++}` ) ),
      new SynthesisEquation( 2, Molecule.S, 3, Molecule.O2, 2, Molecule.SO3,
        this.coefficientsRange, synthesisEquationsTandem.createTandem( `equation${equationIndex++}` ) ),
      new SynthesisEquation( 4, Molecule.P, 5, Molecule.O2, 2, Molecule.P2O5,
        this.coefficientsRange, synthesisEquationsTandem.createTandem( `equation${equationIndex++}` ) ),
      new SynthesisEquation( 1, Molecule.C2H2, 2, Molecule.H2, 1, Molecule.C2H6,
        this.coefficientsRange, synthesisEquationsTandem.createTandem( `equation${equationIndex++}` ) )
    ];

    const decompositionEquationsTandem = tandem.createTandem( 'decompositionEquations' );
    equationIndex = 0;
    this.decompositionEquations = [
      new DecompositionEquation( 1, Molecule.CH3OH, 1, Molecule.CO, 2, Molecule.H2,
        this.coefficientsRange, decompositionEquationsTandem.createTandem( `equation${equationIndex++}` ) ),
      new DecompositionEquation( 2, Molecule.NO2, 2, Molecule.NO, 1, Molecule.O2,
        this.coefficientsRange, decompositionEquationsTandem.createTandem( `equation${equationIndex++}` ) ),
      new DecompositionEquation( 2, Molecule.PCl3, 2, Molecule.P, 3, Molecule.Cl2,
        this.coefficientsRange, decompositionEquationsTandem.createTandem( `equation${equationIndex++}` ) ),
      new DecompositionEquation( 2, Molecule.H2O2, 2, Molecule.H2O, 1, Molecule.O2,
        this.coefficientsRange, decompositionEquationsTandem.createTandem( `equation${equationIndex++}` ) )
    ];

    const combustionEquationsTandem = tandem.createTandem( 'combustionEquations' );
    equationIndex = 0;
    this.combustionEquations = [
      new DisplacementEquation( 1, Molecule.C2H4, 3, Molecule.O2, 2, Molecule.CO2, 2, Molecule.H2O,
        this.coefficientsRange, combustionEquationsTandem.createTandem( `equation${equationIndex++}` ) ),
      new DisplacementEquation( 1, Molecule.C2H5OH, 3, Molecule.O2, 2, Molecule.CO2, 3, Molecule.H2O,
        this.coefficientsRange, combustionEquationsTandem.createTandem( `equation${equationIndex++}` ) ),
      new DisplacementEquation( 3, Molecule.CH3OH, 3, Molecule.O2, 2, Molecule.CO2, 4, Molecule.H2O,
        this.coefficientsRange, combustionEquationsTandem.createTandem( `equation${equationIndex++}` ) ),
      new DisplacementEquation( 2, Molecule.C2H2, 5, Molecule.O2, 4, Molecule.CO2, 2, Molecule.H2O2,
        this.coefficientsRange, combustionEquationsTandem.createTandem( `equation${equationIndex++}` ) )
    ];

    this.synthesisEquationProperty = new Property( this.synthesisEquations[ 0 ], {
      validValues: this.synthesisEquations,
      tandem: tandem.createTandem( 'synthesisEquationProperty' ),
      phetioFeatured: true,
      phetioValueType: Equation.EquationIO
    } );

    this.decompositionEquationProperty = new Property( this.decompositionEquations[ 0 ], {
      validValues: this.decompositionEquations,
      tandem: tandem.createTandem( 'decompositionEquationProperty' ),
      phetioFeatured: true,
      phetioValueType: Equation.EquationIO
    } );

    this.combustionEquationProperty = new Property( this.combustionEquations[ 0 ], {
      validValues: this.combustionEquations,
      tandem: tandem.createTandem( 'combustionEquationProperty' ),
      phetioFeatured: true,
      phetioValueType: Equation.EquationIO
    } );

    this.equationProperty = new DerivedProperty(
      [ this.equationTypeProperty, this.synthesisEquationProperty, this.decompositionEquationProperty, this.combustionEquationProperty ],
      ( equationType, synthesisEquation, decompositionEquation, combustionEquation ) => {
        if ( equationType === 'synthesis' ) {
          return synthesisEquation;
        }
        else if ( equationType === 'decomposition' ) {
          return decompositionEquation;
        }
        else {
          return combustionEquation;
        }
      }, {
        tandem: tandem.createTandem( 'equationProperty' ),
        validValues: [ ...this.synthesisEquations, ...this.decompositionEquations, ...this.combustionEquations ],
        phetioFeatured: true,
        phetioValueType: Equation.EquationIO
      } );
  }

  public reset(): void {
    this.equationTypeProperty.reset();
    this.synthesisEquations.forEach( equation => equation.reset() );
    this.decompositionEquations.forEach( equation => equation.reset() );
    this.combustionEquations.forEach( equation => equation.reset() );
    this.synthesisEquationProperty.reset();
    this.decompositionEquationProperty.reset();
    this.combustionEquationProperty.reset();
  }
}

balancingChemicalEquations.register( 'EquationsModel', EquationsModel );