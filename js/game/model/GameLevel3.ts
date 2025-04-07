// Copyright 2025, University of Colorado Boulder

/**
 * GameLevel3 is level 3 in the Game screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import GameLevel from './GameLevel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Range from '../../../../dot/js/Range.js';
import Molecule from '../../common/model/Molecule.js';
import EquationPool3 from './EquationPool3.js';

export default class GameLevel3 extends GameLevel {

  public constructor( coefficientsRange: Range, tandem: Tandem ) {

    super( {
      levelNumber: 3,
      iconMolecule: Molecule.NH3,
      coefficientsRange: coefficientsRange,
      equationPool: new EquationPool3( coefficientsRange, tandem.createTandem( 'equationPool' ) ),
      getBalancedRepresentation: () => 'barCharts',
      tandem: tandem
    } );
  }
}

balancingChemicalEquations.register( 'GameLevel3', GameLevel3 );