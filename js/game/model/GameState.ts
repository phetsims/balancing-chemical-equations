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

export const GameStateValues = [ 'levelSelection', 'check', 'tryAgain', 'showAnswer', 'next', 'levelCompleted' ] as const;
export type GameState = ( typeof GameStateValues )[number];

/**
 * Determines whether the game state transition is valid.
 */
export function isValidGameStateTransition( fromState: GameState, toState: GameState ): boolean {
  if ( toState === 'levelSelection' ) {

    // Any state can go to 'levelSelection' by pressing the 'Start Over' button or 'Continue' button.
    return true;
  }
  if ( fromState === 'levelSelection' ) {
    return ( toState === 'check' );
  }
  else if ( fromState === 'check' ) {

    // 'next' if the 'Check' button was pressed and we guessed correctly.
    // 'tryAgain' if the 'Check' button was pressed once and we guessed incorrectly.
    // 'showAnswer' if the 'Check' button was pressed twice and we guessed incorrectly.
    // 'check' if the optional 'Skip' button was pressed and there are more challenges to play.
    // 'levelCompleted' if the optional 'Skip' button was pressed and all challenges have been played.
    return ( toState === 'next' ) || ( toState === 'tryAgain' ) || ( toState === 'showAnswer' ) ||
           ( toState === 'check' ) || ( toState === 'levelCompleted' );
  }
  else if ( fromState === 'tryAgain' ) {
    return ( toState === 'check' );
  }
  else if ( fromState === 'showAnswer' ) {
    return ( toState === 'next' );
  }
  else if ( fromState === 'next' ) {

    // 'check' if there are more challenges to play.
    // 'levelCompleted' if all challenges have been played.
    return ( toState === 'check' ) || ( toState === 'levelCompleted' );
  }
  else {
    return false; // If we got here, there's a programming error.
  }
}