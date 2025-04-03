// Copyright 2025, University of Colorado Boulder

/**
 * GameLevel2 is level 2 in the Game screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import GameLevel from './GameLevel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Range from '../../../../dot/js/Range.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import Molecule from '../../common/model/Molecule.js';
import EquationPool2 from './EquationPool2.js';

export default class GameLevel2 extends GameLevel {

  public constructor( coefficientsRange: Range, tandem: Tandem ) {

    super( {
      levelNumber: 2,
      iconMolecule: Molecule.H2O,
      coefficientsRange: coefficientsRange,
      equationPool: new EquationPool2( coefficientsRange, tandem.createTandem( 'equationPool' ) ),
      getBalancedRepresentation: () => dotRandom.nextDouble() < 0.5 ? 'balanceScales' : 'barChart',
      tandem: tandem
    } );
  }
}

balancingChemicalEquations.register( 'GameLevel2', GameLevel2 );