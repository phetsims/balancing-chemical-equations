// Copyright 2025, University of Colorado Boulder

/**
* EquationPool2 is the pool of equations for Game level 2.
 *
 * @author Chris Malley (PixelZoom, Inc.)
*/

import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Range from '../../../../dot/js/Range.js';
import EquationPool, { ExclusionsMap } from './EquationPool.js';
import Molecule from '../../common/model/Molecule.js';
import Equation from '../../common/model/Equation.js';
import DisplacementEquation from '../../common/model/DisplacementEquation.js';

export default class EquationPool3 extends EquationPool {

  public constructor( coefficientsRange: Range, tandem: Tandem ) {

    let equationIndex = 0;

    // Define equations as const so that they can be added to exclusionMap.
    const equation_C2H5OH_3O2_2CO2_3H2O = new DisplacementEquation( 1, Molecule.C2H5OH, 3, Molecule.O2, 2, Molecule.CO2, 3, Molecule.H2O, coefficientsRange,
      tandem.createTandem( `equation${equationIndex++}` ) );
    const equation_2CO2_3H2O_C2H5OH_3O2 = new DisplacementEquation( 2, Molecule.CO2, 3, Molecule.H2O, 1, Molecule.C2H5OH, 3, Molecule.O2, coefficientsRange,
      tandem.createTandem( `equation${equationIndex++}` ) );
    const equation_2C2H6_7O2_4CO2_6H2O = new DisplacementEquation( 2, Molecule.C2H6, 7, Molecule.O2, 4, Molecule.CO2, 6, Molecule.H2O, coefficientsRange,
      tandem.createTandem( `equation${equationIndex++}` ) );
    const equation_4CO2_6H2O_2C2H6_7O2 = new DisplacementEquation( 4, Molecule.CO2, 6, Molecule.H2O, 2, Molecule.C2H6, 7, Molecule.O2, coefficientsRange,
      tandem.createTandem( `equation${equationIndex++}` ) );
    const equation_2C2H2_5O2_4CO2_2H2O = new DisplacementEquation( 2, Molecule.C2H2, 5, Molecule.O2, 4, Molecule.CO2, 2, Molecule.H2O, coefficientsRange,
      tandem.createTandem( `equation${equationIndex++}` ) );
    const equation_4CO2_2H2O_2C2H2_5O2 = new DisplacementEquation( 4, Molecule.CO2, 2, Molecule.H2O, 2, Molecule.C2H2, 5, Molecule.O2, coefficientsRange,
      tandem.createTandem( `equation${equationIndex++}` ) );
    const equation_4NH3_3O2_2N2_6H2O = new DisplacementEquation( 4, Molecule.NH3, 3, Molecule.O2, 2, Molecule.N2, 6, Molecule.H2O, coefficientsRange,
      tandem.createTandem( `equation${equationIndex++}` ) );
    const equation_2N2_6H2O_4NH3_3O2 = new DisplacementEquation( 2, Molecule.N2, 6, Molecule.H2O, 4, Molecule.NH3, 3, Molecule.O2, coefficientsRange,
      tandem.createTandem( `equation${equationIndex++}` ) );
    const equation_4NH3_5O2_4NO_6H2O = new DisplacementEquation( 4, Molecule.NH3, 5, Molecule.O2, 4, Molecule.NO, 6, Molecule.H2O, coefficientsRange,
      tandem.createTandem( `equation${equationIndex++}` ) );
    const equation_4NO_6H2O_4NH3_5O2 = new DisplacementEquation( 4, Molecule.NO, 6, Molecule.H2O, 4, Molecule.NH3, 5, Molecule.O2, coefficientsRange,
      tandem.createTandem( `equation${equationIndex++}` ) );
    const equation_4NH3_7O2_4NO2_6H2O = new DisplacementEquation( 4, Molecule.NH3, 7, Molecule.O2, 4, Molecule.NO2, 6, Molecule.H2O, coefficientsRange,
      tandem.createTandem( `equation${equationIndex++}` ) );
    const equation_4NO2_6H2O_4NH3_7O2 = new DisplacementEquation( 4, Molecule.NO2, 6, Molecule.H2O, 4, Molecule.NH3, 7, Molecule.O2, coefficientsRange,
      tandem.createTandem( `equation${equationIndex++}` ) );
    const equation_4NH3_6NO_5N2_6H2O = new DisplacementEquation( 4, Molecule.NH3, 6, Molecule.NO, 5, Molecule.N2, 6, Molecule.H2O, coefficientsRange,
      tandem.createTandem( `equation${equationIndex++}` ) );
    const equation_5N2_6H2O_4NH3_6NO = new DisplacementEquation( 5, Molecule.N2, 6, Molecule.H2O, 4, Molecule.NH3, 6, Molecule.NO, coefficientsRange,
      tandem.createTandem( `equation${equationIndex++}` ) );

    const equations: Equation[] = [
      // This is the longest equation, and requires minX adjustment in EquationNode. Put it first to simplify layout testing with ?playAll.
      equation_C2H5OH_3O2_2CO2_3H2O,
      // This is the reverse of the previous equation. Put it here to simplify layout testing with ?playAll.
      equation_2CO2_3H2O_C2H5OH_3O2,
      equation_2C2H6_7O2_4CO2_6H2O,
      equation_4CO2_6H2O_2C2H6_7O2,
      equation_2C2H2_5O2_4CO2_2H2O,
      equation_4CO2_2H2O_2C2H2_5O2,
      equation_4NH3_3O2_2N2_6H2O,
      equation_2N2_6H2O_4NH3_3O2,
      equation_4NH3_5O2_4NO_6H2O,
      equation_4NO_6H2O_4NH3_5O2,
      equation_4NH3_7O2_4NO2_6H2O,
      equation_4NO2_6H2O_4NH3_7O2,
      equation_4NH3_6NO_5N2_6H2O,
      equation_5N2_6H2O_4NH3_6NO
    ];

    // Level 3 exclusions map:
    // This mess deserves some explanation... For level 3, the design team wanted a complicated
    // strategy for selecting equations, where selection of an equation causes other equations to be
    // ruled out as possible choices.  For example, if we choose an equation that contains 4NH3 as
    // a reactant, we don't want to choose any other equations with 4NH3 as a reactant, and we don't
    // want to choose the reverse equation.  Since this "exclusion" strategy was a moving target and
    // the rules kept changing, I implemented this general solution, whereby a list of exclusions
    // can be specified for each equation.
    const exclusionsMap: ExclusionsMap = new Map<Equation, Equation[]>();
    exclusionsMap.set( equation_2C2H6_7O2_4CO2_6H2O, [
      equation_4CO2_6H2O_2C2H6_7O2, /* reverse equation */
      equation_2C2H2_5O2_4CO2_2H2O
    ] );
    exclusionsMap.set( equation_4CO2_6H2O_2C2H6_7O2, [
      equation_2C2H6_7O2_4CO2_6H2O, /* reverse equation */
      equation_4CO2_2H2O_2C2H2_5O2
    ] );
    exclusionsMap.set( equation_2C2H2_5O2_4CO2_2H2O, [
      equation_4CO2_2H2O_2C2H2_5O2, /* reverse equation */
      equation_2C2H6_7O2_4CO2_6H2O
    ] );
    exclusionsMap.set( equation_4CO2_2H2O_2C2H2_5O2, [
      equation_2C2H2_5O2_4CO2_2H2O, /* reverse equation */
      equation_4CO2_6H2O_2C2H6_7O2
    ] );
    exclusionsMap.set( equation_C2H5OH_3O2_2CO2_3H2O, [
      equation_2CO2_3H2O_C2H5OH_3O2 /* reverse equation */
    ] );
    exclusionsMap.set( equation_2CO2_3H2O_C2H5OH_3O2, [
      equation_C2H5OH_3O2_2CO2_3H2O /* reverse equation */
    ] );
    exclusionsMap.set( equation_4NH3_3O2_2N2_6H2O, [
      equation_2N2_6H2O_4NH3_3O2, /* reverse equation */
      equation_4NH3_5O2_4NO_6H2O, /* other equations with reactant 4NH3 */
      equation_4NH3_7O2_4NO2_6H2O,
      equation_4NH3_6NO_5N2_6H2O
    ] );
    exclusionsMap.set( equation_4NH3_5O2_4NO_6H2O, [
      equation_4NO_6H2O_4NH3_5O2, /* reverse equation */
      equation_4NH3_3O2_2N2_6H2O, /* other equations with reactant 4NH3 */
      equation_4NH3_7O2_4NO2_6H2O,
      equation_4NH3_6NO_5N2_6H2O
    ] );
    exclusionsMap.set( equation_4NH3_7O2_4NO2_6H2O, [
      equation_4NO2_6H2O_4NH3_7O2, /* reverse equation */
      equation_4NH3_3O2_2N2_6H2O, /* other equations with reactant 4NH3 */
      equation_4NH3_5O2_4NO_6H2O,
      equation_4NH3_6NO_5N2_6H2O
    ] );
    exclusionsMap.set( equation_4NH3_6NO_5N2_6H2O, [
      equation_5N2_6H2O_4NH3_6NO, /* reverse equation */
      equation_4NH3_3O2_2N2_6H2O, /* other equations with reactant 4NH3 */
      equation_4NH3_5O2_4NO_6H2O,
      equation_4NH3_7O2_4NO2_6H2O
    ] );
    exclusionsMap.set( equation_2N2_6H2O_4NH3_3O2, [
      equation_4NH3_3O2_2N2_6H2O, /* reverse equation */
      equation_4NO_6H2O_4NH3_5O2, /* other equations with product 4NH3 */
      equation_4NO2_6H2O_4NH3_7O2,
      equation_5N2_6H2O_4NH3_6NO
    ] );
    exclusionsMap.set( equation_4NO_6H2O_4NH3_5O2, [
      equation_4NH3_5O2_4NO_6H2O, /* reverse equation */
      equation_2N2_6H2O_4NH3_3O2, /* other equations with product 4NH3 */
      equation_4NO2_6H2O_4NH3_7O2,
      equation_5N2_6H2O_4NH3_6NO
    ] );
    exclusionsMap.set( equation_4NO2_6H2O_4NH3_7O2, [
      equation_4NH3_7O2_4NO2_6H2O, /* reverse equation */
      equation_2N2_6H2O_4NH3_3O2, /* other equations with product 4NH3 */
      equation_4NO_6H2O_4NH3_5O2,
      equation_5N2_6H2O_4NH3_6NO
    ] );
    exclusionsMap.set( equation_5N2_6H2O_4NH3_6NO, [
      equation_4NH3_6NO_5N2_6H2O, /* reverse equation */
      equation_2N2_6H2O_4NH3_3O2, /* other equations with product 4NH3 */
      equation_4NO_6H2O_4NH3_5O2,
      equation_4NO2_6H2O_4NH3_7O2
    ] );

    super( equations, {
      exclusionsMap: exclusionsMap,
      tandem: tandem
    } );
  }
}

balancingChemicalEquations.register( 'EquationPool3', EquationPool3 );