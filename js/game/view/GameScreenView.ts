// Copyright 2014-2023, University of Colorado Boulder

/**
 * Scene graph for the 'Balancing game' screen.
 *
 * @author Vasily Shakhov (MLearner)
 */

import ScreenView from '../../../../joist/js/ScreenView.js';
import { Node } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import GameAudioPlayer from '../../../../vegas/js/GameAudioPlayer.js';
import LevelCompletedNode from '../../../../vegas/js/LevelCompletedNode.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import BCEConstants from '../../common/BCEConstants.js';
import BCEQueryParameters from '../../common/BCEQueryParameters.js';
import GameModel from '../model/GameModel.js';
import GameState from '../model/GameState.js';
import BCERewardNode from './BCERewardNode.js';
import GamePlayNode from './GamePlayNode.js';
import GameViewProperties from './GameViewProperties.js';
import LevelSelectionNode from './LevelSelectionNode.js';

export default class GameScreenView extends ScreenView {

  public readonly model: GameModel;
  public readonly viewProperties: GameViewProperties;
  public readonly audioPlayer: GameAudioPlayer;

  private readonly rootNode: Node; // parent for all game-related nodes

  private readonly levelSelectionNode: Node;
  private gamePlayNode: Node | null; // game-play interface, created on demand

  private rewardNode: BCERewardNode | null; // created on demand

  public constructor( model: GameModel, tandem: Tandem ) {

    super( {
      layoutBounds: BCEConstants.LAYOUT_BOUNDS,
      tandem: tandem
    } );

    this.model = model;
    this.viewProperties = new GameViewProperties();
    this.audioPlayer = new GameAudioPlayer();

    this.rootNode = new Node();
    this.addChild( this.rootNode );

    this.levelSelectionNode = new LevelSelectionNode( this.model, this.viewProperties, this.layoutBounds,
      this.initStartGame.bind( this ), tandem.createTandem( 'levelSelectionNode' ) );
    this.levelSelectionNode.visible = ( model.stateProperty.value === GameState.LEVEL_SELECTION );
    this.rootNode.addChild( this.levelSelectionNode );

    this.gamePlayNode = null;
    this.rewardNode = null;

    // Call an initializer to set up the game for the state.
    model.stateProperty.link( state => {
      if ( state === GameState.LEVEL_SELECTION ) {
        this.initLevelSelection();
      }
      else if ( state === GameState.LEVEL_COMPLETED ) {
        this.initLevelCompleted();
      }
    } );
  }

  // No dispose needed, instances of this type persist for lifetime of the sim.

  public override step( dt: number ): void {
    if ( this.rewardNode ) {
      this.rewardNode.step( dt );
    }
    super.step( dt );
  }

  private initLevelSelection(): void {
    if ( this.gamePlayNode ) { this.gamePlayNode.visible = false; }
    this.levelSelectionNode.visible = true;
  }

  /**
   * Performs initialization to start a game for a specified level.
   */
  private initStartGame( level: number ): void {
    this.model.levelProperty.value = level;
    if ( !this.gamePlayNode ) {
      this.gamePlayNode = new GamePlayNode( this.model, this.viewProperties, this.audioPlayer,
        this.layoutBounds, this.visibleBoundsProperty );
      this.rootNode.addChild( this.gamePlayNode );
    }
    this.viewProperties.reactantsBoxExpandedProperty.reset();
    this.viewProperties.productsBoxExpandedProperty.reset();
    this.levelSelectionNode.visible = false;
    this.gamePlayNode.visible = true;
    this.model.startGame();
  }

  private initLevelCompleted(): void {

    const level = this.model.levelProperty.value;

    this.levelSelectionNode.visible = false;
    if ( this.gamePlayNode ) {
      this.gamePlayNode.visible = false;
    }

    // game reward, shown for perfect score (or with 'reward' query parameter)
    if ( this.model.isPerfectScore() || BCEQueryParameters.showReward ) {
      this.rewardNode = new BCERewardNode( level );
      this.rootNode.addChild( this.rewardNode );
    }

    // bestTime on level, must be null to not show in popup
    const bestTimeOnThisLevel = this.model.bestTimeProperties[ level ].value === 0 ? null : this.model.bestTimeProperties[ level ].value;

    // Node displaying notification that the level has been completed
    const numberOfEquations = this.model.getNumberOfEquations( level );
    const levelCompletedNode = new LevelCompletedNode( level + 1, this.model.pointsProperty.value, this.model.getPerfectScore( level ),
      numberOfEquations, this.viewProperties.timerEnabledProperty.value,
      this.model.timer.elapsedTimeProperty.value, bestTimeOnThisLevel, this.model.isNewBestTime,

      // function called when 'Continue' button is pressed
      () => {
        // remove the reward, if we have one
        if ( this.rewardNode ) {
          this.rootNode.removeChild( this.rewardNode );
          this.rewardNode.dispose();
          this.rewardNode = null;
        }
        // remove the level-completed notification
        this.rootNode.removeChild( levelCompletedNode );
        // go back to the level-selection screen
        this.model.stateProperty.value = GameState.LEVEL_SELECTION;
      },
      {
        // LevelCompletedNode options
        starDiameter: Math.min( 60, 300 / numberOfEquations ),
        centerX: this.layoutBounds.centerX,
        centerY: this.layoutBounds.centerY,
        levelVisible: false,
        maxWidth: 0.85 * this.layoutBounds.width // constrain width for i18n
      }
    );
    this.rootNode.addChild( levelCompletedNode );

    // Play the appropriate audio feedback.
    if ( this.model.isPerfectScore() ) {
      this.audioPlayer.gameOverPerfectScore();
    }
    else {
      this.audioPlayer.gameOverImperfectScore();
    }
  }
}

balancingChemicalEquations.register( 'GameScreenView', GameScreenView );