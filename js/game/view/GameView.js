// Copyright 2002-2014, University of Colorado Boulder

/**
 * Scene graph for the 'Balancing game' screen.
 *
 * @author Vasily Shakhov (MLearner)
 */

define( function( require ) {
  'use strict';

  // Imports
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var GameAudioPlayer = require( 'VEGAS/GameAudioPlayer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LevelCompletedNode = require( 'VEGAS/LevelCompletedNode' );
  var Node = require( 'SCENERY/nodes/Node' );
  var BoxesNode = require( 'BALANCING_CHEMICAL_EQUATIONS/common/view/BoxesNode' );
  var EquationNode = require( 'BALANCING_CHEMICAL_EQUATIONS/common/view/equationNode' );
  var BCEConstants = require( 'BALANCING_CHEMICAL_EQUATIONS/common/model/BCEConstants' );
  var Scoreboard = require( 'VEGAS/Scoreboard' );
  var Property = require( 'AXON/Property' );
  var Scoreboard = require( 'VEGAS/Scoreboard' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var StartGameLevelNode = require( 'BALANCING_CHEMICAL_EQUATIONS/game/view/StartGameLevelNode' );
  var HorizontalAligner = require( 'BALANCING_CHEMICAL_EQUATIONS/common/view/HorizontalAligner' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );

  // strings
  var newGameString = require( 'string!BALANCING_CHEMICAL_EQUATIONS/newGame' );

  // Constants
  var BOX_SIZE = new Dimension2( 285, 310 );
  var BOX_SEPARATION = 140; // horizontal spacing between boxes
  var BUTTONS_COLOR = '#00ff99';
  var BUTTONS_FONT = new PhetFont( 30 );

  /**
   * Constructor.
   *
   * @param {gameModel} gameModel - balancing model object.
   * @constructor
   */
  function GameView( gameModel ) {
    var self = this;

    ScreenView.call( this, {renderer: 'svg'} );

    this.model = gameModel;
    this.audioPlayer = new GameAudioPlayer( gameModel.soundEnabledProperty );
    this.aligner = new HorizontalAligner( BOX_SIZE, BOX_SEPARATION, gameModel.width / 2 );

    // Add a root node where all of the game-related nodes will live.
    this.rootNode = new Node();
    this.addChild( this.rootNode );

    //3 main nodes, start, game and complete
    this.startGameLevelNode = new Node();
    this.gamePlayNode = new Node();
    this.gameCompletedLevelNode = new Node();

    //startGame nodes

    //game nodes
    //scoreboard at the bottom of the screen
    var scoreboard = new Scoreboard(
      gameModel.currentEquationIndexProperty,
      new Property( gameModel.EQUATIONS_PER_GAME ),
      new DerivedProperty( [gameModel.currentLevelProperty], function( currentLevel ) {return currentLevel - 1;} ), //because we numbered level 1-2-3 and scoreboard count 0-1-2 we need this workaround
      gameModel.pointsProperty,
      gameModel.elapsedTimeProperty,
      gameModel.timerEnabledProperty,
      function() { gameModel.state = self.model.gameState.START_GAME; },
      {
        startOverButtonText: newGameString,
        centerX: this.aligner.centerXOffset,
        bottom: this.model.height - 20
      }
    );
    this.gamePlayNode.addChild( scoreboard );

    // Equation
    var equationNode = new EquationNode( this.model.currentEquationProperty, this.model.COEFFICENTS_RANGE, this.aligner, {y: this.model.height - 120} );
    this.gamePlayNode.addChild( equationNode );

    // boxes that show molecules corresponding to the equation coefficients
    var boxesNode = new BoxesNode( this.model.currentEquationProperty, this.model.COEFFICENTS_RANGE, this.aligner, BCEConstants.BOX_COLOR, {y: 20} );
    this.gamePlayNode.addChild( boxesNode );


    //gameCompleted nodes


    //observers

    // Monitor the game state and update the view accordingly.
    gameModel.stateProperty.link( function( state ) {
      /*
       * Call an initializer to handle setup of the view for a specified state.
       * See the gameModel for GameState for the semantics of states and the significance of their names.
       */
      console.log( 'init' + state )
      self['init' + state]();
    } );

    //TODO remove
    this.startGame();

  }

  return inherit( ScreenView, GameView, {
    startGame: function() {
      this.rootNode.removeAllChildren();
      this.rootNode.addChild( this.gamePlayNode );
      this.model.currentLevel = 1;
      this.model.startGame();
    },
    initStartGame: function() {
      this.rootNode.removeAllChildren();
      this.rootNode.addChild( this.startGameLevelNode );
    },
    initCheck: function() {
    }
  } );
} )
;
