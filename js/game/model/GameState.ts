// Copyright 2023-2025, University of Colorado Boulder

/**
 * GameState is the enumeration of states for the game. For lack of better names, the state names correspond to the
 * main action that the user can take in that state.  For example. the 'check' state is where the user can enter
 * coefficients and press the "Check" button to check their answer.
 *
 * The possible state transitions are documented below.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

export const GameStateValues = [
  'levelSelection', // goes to 'check'
  'check',          // goes to 'tryAgain' or 'showAnswer', depending on how many attempts have been made to solve the current challenge
  'tryAgain',       // goes to 'check'
  'showAnswer',     // goes to 'next'
  'next',           // goes to 'check' if there are more challenges to play, or 'levelCompleted' if all challenges have been played
  'levelCompleted'  // goes to 'levelSelection'
] as const;
export type GameState = ( typeof GameStateValues )[number];