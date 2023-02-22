// Copyright 2023, University of Colorado Boulder

/**
 * States for the game. For lack of better names, the state names correspond to the main action that the user
 * can take in that state.  For example. the CHECK state is where the user can enter coefficients and press
 * the "Check" button to check their answer.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';

export default class GameState extends EnumerationValue {

  public static readonly LEVEL_SELECTION = new GameState();
  public static readonly CHECK = new GameState();
  public static readonly TRY_AGAIN = new GameState();
  public static readonly SHOW_ANSWER = new GameState();
  public static readonly NEXT = new GameState();
  public static readonly LEVEL_COMPLETED = new GameState();

  public static readonly enumeration = new Enumeration( GameState );
}

balancingChemicalEquations.register( 'GameState', GameState );