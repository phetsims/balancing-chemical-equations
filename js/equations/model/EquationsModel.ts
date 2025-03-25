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
      new SynthesisEquation( 1, Molecule.C2H2, 2, Molecule.H2, 1, Molecule.C2H6,
        this.coefficientsRange, synthesisEquationsTandem.createTandem( `equation${equationIndex++}` ) ),
      new SynthesisEquation( 2, Molecule.C, 1, Molecule.O2, 2, Molecule.CO,
        this.coefficientsRange, synthesisEquationsTandem.createTandem( `equation${equationIndex++}` ) )
      //TODO https://github.com/phetsims/balancing-chemical-equations/issues/170 2 N2 + 5 O2 -> 2 N2O5
      //TODO https://github.com/phetsims/balancing-chemical-equations/issues/170 2 S + 3 O2 -> 2 SO3
      //TODO https://github.com/phetsims/balancing-chemical-equations/issues/170 4 P + 5 O2 -> 2 P2O5
    ];

    const decompositionEquationsTandem = tandem.createTandem( 'decompositionEquations' );
    equationIndex = 0;
    this.decompositionEquations = [
      new DecompositionEquation( 1, Molecule.CH3OH, 1, Molecule.CO, 2, Molecule.H2,
        this.coefficientsRange, decompositionEquationsTandem.createTandem( `equation${equationIndex++}` ) ),
      new DecompositionEquation( 2, Molecule.NO2, 2, Molecule.NO, 1, Molecule.O2,
        this.coefficientsRange, decompositionEquationsTandem.createTandem( `equation${equationIndex++}` ) )
      //TODO https://github.com/phetsims/balancing-chemical-equations/issues/170 2 PCl3 -> 2P + 3 Cl2
      //TODO https://github.com/phetsims/balancing-chemical-equations/issues/170 2 H2O2 -> 2 H2O + 1 O2
    ];

    const combustionEquationsTandem = tandem.createTandem( 'combustionEquations' );
    equationIndex = 0;
    this.combustionEquations = [
      new DisplacementEquation( 1, Molecule.C2H4, 3, Molecule.O2, 2, Molecule.CO2, 2, Molecule.H2O,
        this.coefficientsRange, combustionEquationsTandem.createTandem( `equation${equationIndex++}` ) ),
      //TODO https://github.com/phetsims/balancing-chemical-equations/issues/170 2 C2H2 + 5 O2 -> 4 CO2 + 2H2O
      new DisplacementEquation( 1, Molecule.C2H5OH, 3, Molecule.O2, 2, Molecule.CO2, 3, Molecule.H2O,
        this.coefficientsRange, combustionEquationsTandem.createTandem( `equation${equationIndex++}` ) )
      //TODO https://github.com/phetsims/balancing-chemical-equations/issues/170 2 CH3OH + 3 O2 -> 2 CO2 + 4 H2O
    ];

    this.synthesisEquationProperty = new Property( this.synthesisEquations[ 0 ], {
      tandem: tandem.createTandem( 'synthesisEquationProperty' ),
      validValues: this.synthesisEquations,
      phetioValueType: Equation.EquationIO
    } );

    this.decompositionEquationProperty = new Property( this.decompositionEquations[ 0 ], {
      tandem: tandem.createTandem( 'decompositionEquationProperty' ),
      validValues: this.decompositionEquations,
      phetioValueType: Equation.EquationIO
    } );

    this.combustionEquationProperty = new Property( this.combustionEquations[ 0 ], {
      tandem: tandem.createTandem( 'combustionEquationProperty' ),
      validValues: this.combustionEquations,
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