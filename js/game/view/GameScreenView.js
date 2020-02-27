// Copyright 2014-2019, University of Colorado Boulder

/**
 * Scene graph for the 'Balancing game' screen.
 *
 * @author Vasily Shakhov (MLearner)
 */
define( require => {
  'use strict';

  // modules
  const balancingChemicalEquations = require( 'BALANCING_CHEMICAL_EQUATIONS/balancingChemicalEquations' );
  const BCEConstants = require( 'BALANCING_CHEMICAL_EQUATIONS/common/BCEConstants' );
  const BCEQueryParameters = require( 'BALANCING_CHEMICAL_EQUATIONS/common/BCEQueryParameters' );
  const BCERewardNode = require( 'BALANCING_CHEMICAL_EQUATIONS/game/view/BCERewardNode' );
  const GameAudioPlayer = require( 'VEGAS/GameAudioPlayer' );
  const GamePlayNode = require( 'BALANCING_CHEMICAL_EQUATIONS/game/view/GamePlayNode' );
  const GameViewProperties = require( 'BALANCING_CHEMICAL_EQUATIONS/game/view/GameViewProperties' );
  const LevelCompletedNode = require( 'VEGAS/LevelCompletedNode' );
  const LevelSelectionNode = require( 'BALANCING_CHEMICAL_EQUATIONS/game/view/LevelSelectionNode' );
  const Node = require( 'SCENERY/nodes/Node' );
  const ScreenView = require( 'JOIST/ScreenView' );

  class GameScreenView extends ScreenView {

    /**
     * @param {GameModel} model
     */
    constructor( model ) {

      super( BCEConstants.SCREEN_VIEW_OPTIONS );

      // @public view-specific Properties
      this.viewProperties = new GameViewProperties();

      this.model = model; // @public
      this.audioPlayer = new GameAudioPlayer(); // @public

      // @private Add a root node where all of the game-related nodes will live.
      this.rootNode = new Node();
      this.addChild( this.rootNode );

      // @private level-selection interface
      this.levelSelectionNode = new LevelSelectionNode( this.model, this.viewProperties, this.layoutBounds,
        this.initStartGame.bind( this ), { visible: false } );
      this.rootNode.addChild( this.levelSelectionNode );

      // @private game-play interface, created on demand
      this.gamePlayNode = null;

      // Call an initializer to set up the game for the state.
      model.stateProperty.link( state => {
        if ( state === model.states.LEVEL_SELECTION ) {
          this.initLevelSelection();
        }
        else if ( state === model.states.LEVEL_COMPLETED ) {
          this.initLevelCompleted();
        }
      } );
    }

    // No dispose needed, instances of this type persist for lifetime of the sim.

    // @public
    step( dt ) {
      if ( this.rewardNode ) {
        this.rewardNode.step( dt );
      }
    }

    // @private
    initLevelSelection() {
      if ( this.gamePlayNode ) { this.gamePlayNode.visible = false; }
      this.levelSelectionNode.visible = true;
    }

    /**
     * Performs initialization to start a game for a specified level.
     * @param {number} level
     * @private
     */
    initStartGame( level ) {
      this.model.levelProperty.set( level );
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

    // @private
    initLevelCompleted() {

      const self = this;
      const level = this.model.levelProperty.get();

      this.levelSelectionNode.visible = this.gamePlayNode.visible = false;

      // game reward, shown for perfect score (or with 'reward' query parameter)
      if ( this.model.isPerfectScore() || BCEQueryParameters.showReward ) {
        this.rewardNode = new BCERewardNode( level );
        this.rootNode.addChild( this.rewardNode );
      }

      // bestTime on level, must be null to not show in popup
      const bestTimeOnThisLevel = this.model.bestTimeProperties[ level ].get() === 0 ? null : this.model.bestTimeProperties[ level ].get();

      // Add the dialog node that indicates that the level has been completed.
      const numberOfEquations = this.model.getNumberOfEquations( level );
      var levelCompletedNode = new LevelCompletedNode( level + 1, this.model.pointsProperty.get(), this.model.getPerfectScore( level ),
        numberOfEquations, this.viewProperties.timerEnabledProperty.value,
        this.model.timer.elapsedTimeProperty.value, bestTimeOnThisLevel, this.model.isNewBestTime,

        // function called when 'Continue' button is pressed
        function() {
          // remove the reward, if we have one
          if ( self.rewardNode ) {
            self.rootNode.removeChild( self.rewardNode );
            self.rewardNode.dispose();
            self.rewardNode = null;
          }
          // remove the level-completed dialog
          self.rootNode.removeChild( levelCompletedNode );
          // go back to the level-selection screen
          self.model.stateProperty.set( self.model.states.LEVEL_SELECTION );
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

  return balancingChemicalEquations.register( 'GameScreenView', GameScreenView );
} );
