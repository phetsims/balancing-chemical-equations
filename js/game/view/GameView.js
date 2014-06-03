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
  var Node = require( 'SCENERY/nodes/Node' );
  var BoxesNode = require( 'BALANCING_CHEMICAL_EQUATIONS/common/view/BoxesNode' );
  var EquationNode = require( 'BALANCING_CHEMICAL_EQUATIONS/common/view/equationNode' );
  var BCEConstants = require( 'BALANCING_CHEMICAL_EQUATIONS/common/BCEConstants' );
  var Scoreboard = require( 'VEGAS/Scoreboard' );
  var Property = require( 'AXON/Property' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var HorizontalAligner = require( 'BALANCING_CHEMICAL_EQUATIONS/common/view/HorizontalAligner' );
  var TextPushButton = require( 'SUN/buttons/TextPushButton' );

  // strings
  var newGameString = require( 'string!BALANCING_CHEMICAL_EQUATIONS/newGame' );
  var checkString = require( 'string!BALANCING_CHEMICAL_EQUATIONS/check' );
  var nextString = require( 'string!BALANCING_CHEMICAL_EQUATIONS/next' );
  var tryAgainString = require( 'string!BALANCING_CHEMICAL_EQUATIONS/tryAgain' );
  var showAnswerString = require( 'string!BALANCING_CHEMICAL_EQUATIONS/showAnswer' );


  // Constants
  var BOX_SIZE = new Dimension2( 285, 310 );
  var BOX_SEPARATION = 140; // horizontal spacing between boxes

  /**
   * Constructor.
   *
   * @param {gameModel} gameModel - balancing model object.
   * @constructor
   */
  function GameView( gameModel ) {
    var self = this;

    //Constants
    var BUTTONS_OPTIONS = {
      baseColor: '#00ff99',
      centerX: gameModel.width / 2,
      y: 290
    };

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
    this.equationNode = new EquationNode( this.model.currentEquationProperty, this.model.COEFFICENTS_RANGE, this.aligner, {y: this.model.height - 120} );
    this.gamePlayNode.addChild( this.equationNode );

    // boxes that show molecules corresponding to the equation coefficients
    this.boxesNode = new BoxesNode( this.model.currentEquationProperty, this.model.COEFFICENTS_RANGE, this.aligner, BCEConstants.BOX_COLOR, {y: 20} );
    this.gamePlayNode.addChild( this.boxesNode );

    //buttons check, next, tryAgain, showAnswer
    this.checkButton = new TextPushButton( checkString, _.extend( {
      listener: function() {
        self.playGuessAudio();
        self.model.check();
      }
    }, BUTTONS_OPTIONS ) );
    this.nextButton = new TextPushButton( nextString, _.extend( {
      listener: function() {
        self.model.next();
      }
    }, BUTTONS_OPTIONS ) );
    this.tryAgainButton = new TextPushButton( tryAgainString, _.extend( {
      listener: function() {
        self.model.tryAgain();
      }
    }, BUTTONS_OPTIONS ) );
    this.showAnswerButton = new TextPushButton( showAnswerString, _.extend( {
      listener: function() {
        self.model.showAnswer();
      }
    }, BUTTONS_OPTIONS ) );
    this.gamePlayNode.addChild( this.checkButton );
    this.gamePlayNode.addChild( this.nextButton );
    this.gamePlayNode.addChild( this.tryAgainButton );
    this.gamePlayNode.addChild( this.showAnswerButton );

    //gameCompleted nodes


    //observers

    // Monitor the game state and update the view accordingly.
    gameModel.stateProperty.link( function( state ) {
      /*
       * Call an initializer to handle setup of the view for a specified state.
       * See the gameModel for GameState for the semantics of states and the significance of their names.
       */
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
      this.setBalancedHighlightEnabled( false );
      this.setButtonNodeVisible( this.checkButton );
    },
    initTryAgain: function() {
      this.setButtonNodeVisible( this.tryAgainButton );
    },
    initShowAnswer: function() {
      this.setButtonNodeVisible( this.showAnswerButton );
    },
    initNext: function() {
      this.setButtonNodeVisible( this.nextButton );
      this.setBalancedHighlightEnabled( true );
    },
    initLevelCompleted: function() {
    },
    /*
     * Turns on/off the highlighting feature that indicates whether the equation is balanced.
     * We need to be able to control this so that a balanced equation doesn't highlight
     * until after the user presses the Check button.
     */
    setBalancedHighlightEnabled: function( enabled ) {
      this.equationNode.setBalancedHighlightEnabled( enabled );
      this.boxesNode.setBalancedHighlightEnabled( enabled );
    },
    /*
     * Make one of the buttons visible.
     * Visibility of the buttons is mutually exclusive.
     */
    setButtonNodeVisible: function( buttonNode ) {
      // hide all button nodes
      this.checkButton.setVisible( false );
      this.tryAgainButton.setVisible( false );
      this.showAnswerButton.setVisible( false );
      this.nextButton.setVisible( false );
      // make one visible
      buttonNode.setVisible( true );
    },
    playGuessAudio: function() {
      //TODO
    }
  } );
} )
;
