// Copyright 2002-2014, University of Colorado Boulder

/**
 * Scene graph for the 'Balancing game' screen.
 *
 * @author Vasily Shakhov (MLearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var GameAudioPlayer = require( 'VEGAS/GameAudioPlayer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var BoxesNode = require( 'BALANCING_CHEMICAL_EQUATIONS/common/view/BoxesNode' );
  var EquationNode = require( 'BALANCING_CHEMICAL_EQUATIONS/common/view/EquationNode' );
  var BCEConstants = require( 'BALANCING_CHEMICAL_EQUATIONS/common/BCEConstants' );
  var ScoreboardBar = require( 'VEGAS/ScoreboardBar' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var HorizontalAligner = require( 'BALANCING_CHEMICAL_EQUATIONS/common/view/HorizontalAligner' );
  var TextPushButton = require( 'SUN/buttons/TextPushButton' );
  var GameFeedbackDialog = require( 'BALANCING_CHEMICAL_EQUATIONS/game/view/GameFeedbackDialog' );
  var LevelSelectionNode = require( 'BALANCING_CHEMICAL_EQUATIONS/game/view/LevelSelectionNode' );
  var BCERewardNode = require( 'BALANCING_CHEMICAL_EQUATIONS/game/view/BCERewardNode' );
  var LevelCompletedNode = require( 'VEGAS/LevelCompletedNode' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );
  var BCEQueryParameters = require( 'BALANCING_CHEMICAL_EQUATIONS/common/BCEQueryParameters' );
  var GamePlayNode = require( 'BALANCING_CHEMICAL_EQUATIONS/game/view/GamePlayNode' );
  var PropertySet = require( 'AXON/PropertySet' );

  // Constants
  var BOX_SIZE = new Dimension2( 285, 340 );
  var BOX_X_SPACING = 140; // horizontal spacing between boxes

  /**
   * @param {GameModel} model
   * @constructor
   */
  function GameView( model ) {

    var self = this;
    ScreenView.call( this, {renderer: BCEConstants.RENDERER} );

    this.viewProperties = new PropertySet( {
      soundEnabled: true,
      timerEnabled: false,
      reactantsBoxExpanded: true,
      productsBoxExpanded: true
    } );

    this.model = model;
    this.audioPlayer = new GameAudioPlayer( this.viewProperties.soundEnabledProperty );
    this.aligner = new HorizontalAligner( this.layoutBounds.width, BOX_SIZE.width, BOX_X_SPACING );

    // Add a root node where all of the game-related nodes will live.
    this.rootNode = new Node();
    this.addChild( this.rootNode );

    // level-selection interface
    this.levelSelectionNode = new LevelSelectionNode( this.model, this.viewProperties, this.layoutBounds, { visible: false } );
    this.rootNode.addChild( this.levelSelectionNode );

    // game-play interface, all the UI elements for a challenge, created on demand
    this.gamePlayNode = null;

    // Call an initializer to set up the game for the state.
    model.stateProperty.link( function( state ) {
      if ( state === model.states.LEVEL_SELECTION ) {
        self.initLevelSelection();
      }
      else if ( state === model.states.START_GAME ) {
        self.initStartGame();
      }
      else if ( state === model.states.LEVEL_COMPLETED ) {
        self.initLevelCompleted();
      }
    } );
  }

  return inherit( ScreenView, GameView, {

    step: function( dt ) {
      if ( this.rewardNode ) {
        this.rewardNode.step( dt );
      }
    },

    initLevelSelection: function() {
      if ( this.gamePlayNode ) { this.gamePlayNode.visible = false; }
      this.levelSelectionNode.visible = true;
    },

    initStartGame: function() {
      if ( !this.gamePlayNode ) {
        this.gamePlayNode = new GamePlayNode( this.model, this.viewProperties, this.audioPlayer, this.layoutBounds, this.aligner, BOX_SIZE, BOX_X_SPACING );
        this.rootNode.addChild( this.gamePlayNode );
      }
      this.viewProperties.reactantsBoxExpandedProperty.reset();
      this.viewProperties.productsBoxExpandedProperty.reset();
      this.levelSelectionNode.visible = false;
      this.gamePlayNode.visible = true;
      this.model.startGame();
    },

    initLevelCompleted: function() {
      var self = this;

      this.levelSelectionNode.visible = this.gamePlayNode.visible = false;

      // game reward, shown for perfect score (or with 'reward' query parameter)
      if ( this.model.isPerfectScore() || BCEQueryParameters.REWARD ) {
        this.rewardNode = new BCERewardNode( this.model.level );
        this.rootNode.addChild( this.rewardNode );
      }

      // bestTime on level, must be null to not show in popup
      var bestTimeOnThisLevel = this.model.bestTimes[ this.model.level ].get() === 0 ? null : this.model.bestTimes[ this.model.level ].get();

      // Add the dialog node that indicates that the level has been completed.
      var numberOfEquations = this.model.getNumberOfEquations( this.model.level );
      var levelCompletedNode = new LevelCompletedNode( this.model.level, this.model.points, this.model.getPerfectScore( this.model.level ),
        numberOfEquations, this.model.timerEnabled, this.model.timer.elapsedTime, bestTimeOnThisLevel, this.model.isNewBestTime,
        // function called when 'Continue' button is pressed
        function() {
          // remove the reward, if we have one
          if ( self.rewardNode ) {
            self.rootNode.removeChild( self.rewardNode );
            self.rewardNode = null;
          }
          // remove the level-completed dialog
          self.rootNode.removeChild( levelCompletedNode );
          // go back to the level-selection screen
          self.model.state = self.model.states.LEVEL_SELECTION;
        },
        {
          // LevelCompletedNode options
          starDiameter: Math.min( 60, 300 / numberOfEquations ),
          centerX: this.layoutBounds.centerX,
          centerY: this.layoutBounds.centerY,
          levelVisible: false
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
  } );
} )
;
