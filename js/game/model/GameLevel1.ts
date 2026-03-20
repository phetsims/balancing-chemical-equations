// Copyright 2025-2026, University of Colorado Boulder

/**
 * GameLevel1 is level 1 in the Game screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import GameLevel from './GameLevel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Range from '../../../../dot/js/Range.js';
import Molecule from '../../common/model/Molecule.js';
import EquationPool1 from './EquationPool1.js';

export default class GameLevel1 extends GameLevel {

  public constructor( coefficientsRange: Range, tandem: Tandem ) {

    super( {
      levelNumber: 1,
      iconMolecule: Molecule.HCl,
      coefficientsRange: coefficientsRange,
      equationPool: new EquationPool1( coefficientsRange, tandem.createTandem( 'equationPool' ) ),
      getViewMode: () => 'balanceScales',
      tandem: tandem
    } );
  }
}
