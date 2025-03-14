// Copyright 2014-2025, University of Colorado Boulder

/**
 * GameScreenView is the top-level view for the 'Game' screen.
 *
 * @author Vasily Shakhov (MLearner)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ScreenView from '../../../../joist/js/ScreenView.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import GameAudioPlayer from '../../../../vegas/js/GameAudioPlayer.js';
import LevelCompletedNode from '../../../../vegas/js/LevelCompletedNode.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import BCEConstants from '../../common/BCEConstants.js';
import BCEQueryParameters from '../../common/BCEQueryParameters.js';
import GameModel from '../model/GameModel.js';
import BCERewardNode from './BCERewardNode.js';
import GamePlayNode from './GamePlayNode.js';
import GameViewProperties from './GameViewProperties.js';
import LevelSelectionNode from './LevelSelectionNode.js';

export default class GameScreenView extends ScreenView {

  public readonly model: GameModel;
  public readonly viewProperties: GameViewProperties;
  public readonly audioPlayer: GameAudioPlayer;

  private readonly screenViewRootNode: Node; // parent for all game-related nodes

  private readonly levelSelectionNode: Node;
  private gamePlayNode: Node; // game-play interface

  private rewardNode: BCERewardNode | null; // created on demand

  public constructor( model: GameModel, tandem: Tandem ) {

    super( {
      isDisposable: false,
      layoutBounds: BCEConstants.LAYOUT_BOUNDS,
      tandem: tandem
    } );

    this.model = model;
    this.viewProperties = new GameViewProperties( tandem.createTandem( 'viewProperties' ) );
    this.audioPlayer = new GameAudioPlayer();

    this.levelSelectionNode = new LevelSelectionNode( this.model, this.viewProperties, this.layoutBounds,
      tandem.createTandem( 'levelSelectionNode' ) );

    this.gamePlayNode = new GamePlayNode( this.model, this.viewProperties, this.audioPlayer,
      this.layoutBounds, this.visibleBoundsProperty, tandem.createTandem( 'gamePlayNode' ) );

    this.rewardNode = null;

    this.screenViewRootNode = new Node( {
      children: [ this.levelSelectionNode, this.gamePlayNode ]
    } );
    this.addChild( this.screenViewRootNode );

    model.levelProperty.link( level => {
      if ( level ) {
        this.initStartGame();
      }
    } );

    // Call an initializer to set up the game for the state.
    model.stateProperty.link( state => {
      if ( state === 'levelSelection' ) {
        this.initLevelSelection();
      }
      else if ( state === 'levelCompleted' ) {
        this.initLevelCompleted();
      }
    } );

    // Play Area focus order
    this.pdomPlayAreaNode.pdomOrder = [
      //TODO https://github.com/phetsims/balancing-chemical-equations/issues/161
      this.levelSelectionNode
    ];

    // Control Area focus order
    this.pdomControlAreaNode.pdomOrder = [
      // TODO https://github.com/phetsims/balancing-chemical-equations/issues/161
    ];
  }

  public override step( dt: number ): void {
    if ( this.rewardNode ) {
      this.rewardNode.step( dt );
    }
    super.step( dt );
  }

  private initLevelSelection(): void {
    this.gamePlayNode.visible = false;
    this.levelSelectionNode.visible = true;
  }

  /**
   * Performs initialization to play a game for a specified level.
   */
  private initStartGame(): void {
    this.viewProperties.reactantsAccordionBoxExpandedProperty.reset();
    this.viewProperties.productsAccordionBoxExpandedProperty.reset();
    this.levelSelectionNode.visible = false;
    this.gamePlayNode.visible = true;
  }

  private initLevelCompleted(): void {

    const level = this.model.levelProperty.value!;
    assert && assert( level );

    this.levelSelectionNode.visible = false;
    this.gamePlayNode.visible = false;

    // game reward, shown for perfect score (or with 'reward' query parameter)
    if ( this.model.isPerfectScore() || BCEQueryParameters.showReward ) {
      this.rewardNode = new BCERewardNode( level.levelNumber );
      this.screenViewRootNode.addChild( this.rewardNode );
    }

    // bestTime on level, must be null to not show in popup
    const bestTimeOnThisLevel = level.bestTimeProperty.value === 0 ? null : level.bestTimeProperty.value;

    // Node displaying notification that the level has been completed
    const numberOfEquations = level.getNumberOfEquations();
    const levelCompletedNode = new LevelCompletedNode( level.levelNumber, this.model.scoreProperty.value,
      level.getPerfectScore(), numberOfEquations, this.model.timerEnabledProperty.value,
      this.model.timer.elapsedTimeProperty.value, bestTimeOnThisLevel, this.model.isNewBestTime,

      // function called when 'Continue' button is pressed
      () => {
        // remove the reward, if we have one
        if ( this.rewardNode ) {
          this.screenViewRootNode.removeChild( this.rewardNode );
          this.rewardNode.dispose();
          this.rewardNode = null;
        }
        // remove the level-completed notification
        this.screenViewRootNode.removeChild( levelCompletedNode );
        // go back to the level-selection screen
        this.model.startOver();
      },
      {
        // LevelCompletedNode options
        starDiameter: Math.min( 60, 300 / numberOfEquations ),
        levelVisible: false,
        contentMaxWidth: 500
      }
    );
    levelCompletedNode.localBoundsProperty.link( () => {
      levelCompletedNode.center = this.layoutBounds.center;
    } );
    this.screenViewRootNode.addChild( levelCompletedNode );

    // Play the appropriate audio feedback.
    if ( this.model.isPerfectScore() || BCEQueryParameters.showReward ) {
      this.audioPlayer.gameOverPerfectScore();
    }
    else {
      this.audioPlayer.gameOverImperfectScore();
    }
  }
}

balancingChemicalEquations.register( 'GameScreenView', GameScreenView );