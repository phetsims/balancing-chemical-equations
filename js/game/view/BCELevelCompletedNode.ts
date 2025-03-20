// Copyright 2025, University of Colorado Boulder

/**
 * BCELevelCompletedNode presents a summary of how the user did on a level, after all challenges have been played.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import LevelCompletedNode from '../../../../vegas/js/LevelCompletedNode.js';
import GameModel from '../model/GameModel.js';
import Tandem from '../../../../tandem/js/Tandem.js';

export default class BCELevelCompletedNode extends LevelCompletedNode {

  public constructor( model: GameModel, continueButtonCallback: () => void, tandem: Tandem ) {

    // So that we have a non-null level when the archetype is created for BCELevelCompletedNodeGroup.
    const level = model.levelProperty.value || model.levels[ 0 ];

    const numberOfChallenges = level.getNumberOfChallenges();

    // bestTime of zero must be converted to null to not be displayed.
    const bestTimeOnThisLevel = level.bestTimeProperty.value === 0 ? null : level.bestTimeProperty.value;

    super(
      level.levelNumber,
      model.scoreProperty.value,
      level.getPerfectScore(),
      numberOfChallenges,
      model.timerEnabledProperty.value,
      model.timer.elapsedTimeProperty.value,
      bestTimeOnThisLevel,
      model.isNewBestTime,
      continueButtonCallback,

      // LevelCompletedNodeOptions
      {
        starDiameter: Math.min( 60, 300 / numberOfChallenges ),
        levelVisible: false,
        contentMaxWidth: 500,
        tandem: tandem
      }
    );
  }
}

balancingChemicalEquations.register( 'BCELevelCompletedNode', BCELevelCompletedNode );