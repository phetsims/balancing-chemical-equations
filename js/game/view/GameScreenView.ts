// Copyright 2014-2025, University of Colorado Boulder

/**
 * GameScreenView is the top-level view for the 'Game' screen.
 *
 * @author Vasily Shakhov (MLearner)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ScreenView from '../../../../joist/js/ScreenView.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import isSettingPhetioStateProperty from '../../../../tandem/js/isSettingPhetioStateProperty.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import GameAudioPlayer from '../../../../vegas/js/GameAudioPlayer.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import BCEConstants from '../../common/BCEConstants.js';
import BCEQueryParameters from '../../common/BCEQueryParameters.js';
import GameModel from '../model/GameModel.js';
import BCELevelCompletedNode from './BCELevelCompletedNode.js';
import BCERewardNode from './BCERewardNode.js';
import GameViewProperties from './GameViewProperties.js';
import LevelNode from './LevelNode.js';
import LevelSelectionNode from './LevelSelectionNode.js';

export default class GameScreenView extends ScreenView {

  public readonly model: GameModel;
  public readonly viewProperties: GameViewProperties;
  public readonly audioPlayer: GameAudioPlayer;

  private readonly screenViewRootNode: Node; // parent for all game-related nodes

  private readonly levelSelectionNode: Node;
  private readonly levelNode: Node;
  private levelCompletedNode: BCELevelCompletedNode | null; // created on demand
  private rewardNode: BCERewardNode | null; // created on demand

  public constructor( model: GameModel, tandem: Tandem ) {

    super( {
      layoutBounds: BCEConstants.LAYOUT_BOUNDS,
      tandem: tandem
    } );

    this.model = model;
    this.viewProperties = new GameViewProperties( tandem.createTandem( 'viewProperties' ) );
    this.audioPlayer = new GameAudioPlayer();

    this.levelSelectionNode = new LevelSelectionNode( this.model, this.viewProperties, this.layoutBounds,
      tandem.createTandem( 'levelSelectionNode' ) );

    this.levelNode = new LevelNode( this.model, this.viewProperties, this.audioPlayer,
      this.layoutBounds, this.visibleBoundsProperty, tandem.createTandem( 'levelNode' ) );

    this.levelCompletedNode = null;

    this.rewardNode = null;

    this.screenViewRootNode = new Node( {
      children: [ this.levelSelectionNode, this.levelNode ]
    } );
    this.addChild( this.screenViewRootNode );

    model.levelProperty.link( level => {
      if ( level ) {
        this.initStartGame();
      }
    } );

    // Call an initializer to set up the UI to correspond to the game state.
    model.gameStateProperty.link( gameState => {
      if ( gameState === 'levelSelection' ) {
        this.initLevelSelection();
      }
      else if ( gameState === 'levelCompleted' ) {
        this.initLevelCompleted();
      }
    } );

    // Play Area focus order
    this.pdomPlayAreaNode.pdomOrder = [
      //TODO https://github.com/phetsims/balancing-chemical-equations/issues/161 Alt input for Game is deferred.
    ];

    // Control Area focus order
    this.pdomControlAreaNode.pdomOrder = [
      // TODO https://github.com/phetsims/balancing-chemical-equations/issues/161 Alt input for Game is deferred.
    ];
  }

  public override step( dt: number ): void {
    if ( this.rewardNode ) {
      this.rewardNode.step( dt );
    }
    super.step( dt );
  }

  /**
   * Set up the UI for the 'levelSelection' game state.
   */
  private initLevelSelection(): void {

    this.levelSelectionNode.visible = true;
    this.levelNode.visible = false;

    if ( this.levelCompletedNode ) {
      this.screenViewRootNode.removeChild( this.levelCompletedNode );
      this.levelCompletedNode.dispose();
      this.levelCompletedNode = null;
    }

    // Remove rewardNode, if we have one.
    if ( this.rewardNode ) {
      this.screenViewRootNode.removeChild( this.rewardNode );
      this.rewardNode.dispose();
      this.rewardNode = null;
    }
  }

  /**
   * Set up the UI to begin playing a game level.
   */
  private initStartGame(): void {
    if ( !isSettingPhetioStateProperty.value ) {
      this.viewProperties.reactantsAccordionBoxExpandedProperty.reset();
      this.viewProperties.productsAccordionBoxExpandedProperty.reset();
    }
    this.levelSelectionNode.visible = false;
    this.levelNode.visible = true;
  }

  /**
   * Set up the UI for the 'levelCompleted' game state.
   */
  private initLevelCompleted(): void {

    const level = this.model.levelProperty.value!;
    assert && assert( level );

    this.levelSelectionNode.visible = false;
    this.levelNode.visible = false;

    // Game reward, shown for perfect score, or with ?showReward.
    if ( this.model.isPerfectScore() || BCEQueryParameters.showReward ) {
      this.rewardNode = new BCERewardNode( level.levelNumber );
      this.screenViewRootNode.addChild( this.rewardNode );
    }

    // Tandem.OPT_OUT because levelCompletedNode is created dynamically.
    this.levelCompletedNode = new BCELevelCompletedNode( this.model, () => this.continue(), Tandem.OPT_OUT );

    this.screenViewRootNode.addChild( this.levelCompletedNode );

    this.levelCompletedNode.localBoundsProperty.link( () => {
      const levelCompletedNode = this.levelCompletedNode!;
      assert && assert( levelCompletedNode );
      levelCompletedNode.center = this.layoutBounds.center;
    } );

    // Play the appropriate audio feedback.
    if ( this.model.isPerfectScore() || BCEQueryParameters.showReward ) {
      this.audioPlayer.gameOverPerfectScore();
    }
    else {
      this.audioPlayer.gameOverImperfectScore();
    }
  }

  /**
   * Called when the 'Continue' button is pressed.
   */
  private continue(): void {
    this.model.startOver();
  }
}

balancingChemicalEquations.register( 'GameScreenView', GameScreenView );