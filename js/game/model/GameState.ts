// Copyright 2023-2025, University of Colorado Boulder

/**
 * GameState is the enumeration of states for the game. For lack of better names, the state names correspond to the
 * main action that the user can take in that state.  For example. the 'check' state is where the user can enter
 * coefficients and press the "Check" button to check their answer.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

export const GameStateValues = [ 'levelSelection', 'check', 'tryAgain', 'showAnswer', 'next', 'levelCompleted' ] as const;
export type GameState = ( typeof GameStateValues )[number];