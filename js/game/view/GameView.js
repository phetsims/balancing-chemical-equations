// Copyright 2002-2014, University of Colorado Boulder

/**
 * Scene graph for the 'Balancing game' screen.
 *
 * @author Vasily Shakhov (MLearner)
 */

define( function( require ) {
  'use strict';

  // Imports
  var GameAudioPlayer = require( 'VEGAS/GameAudioPlayer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var BoxesNode = require( 'BALANCING_CHEMICAL_EQUATIONS/common/view/BoxesNode' );
  var EquationNode = require( 'BALANCING_CHEMICAL_EQUATIONS/common/view/EquationNode' );
  var BCEConstants = require( 'BALANCING_CHEMICAL_EQUATIONS/common/BCEConstants' );
  var Scoreboard = require( 'VEGAS/Scoreboard' );
  var Property = require( 'AXON/Property' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var HorizontalAligner = require( 'BALANCING_CHEMICAL_EQUATIONS/common/view/HorizontalAligner' );
  var TextPushButton = require( 'SUN/buttons/TextPushButton' );
  var NotBalancedTerseNode = require( 'BALANCING_CHEMICAL_EQUATIONS/game/view/popup/NotBalancedTerseNode' );
  var NotBalancedVerboseNode = require( 'BALANCING_CHEMICAL_EQUATIONS/game/view/popup/NotBalancedVerboseNode' );
  var BalancedNode = require( 'BALANCING_CHEMICAL_EQUATIONS/game/view/popup/BalancedNode' );
  var BalancedNotSimplifiedNode = require( 'BALANCING_CHEMICAL_EQUATIONS/game/view/popup/BalancedNotSimplifiedNode' );
  var StartGameLevelNode = require( 'BALANCING_CHEMICAL_EQUATIONS/game/view/StartGameLevelNode' );
  var RewardNode = require( 'VEGAS/RewardNode' );
  var LevelCompletedNode = require( 'VEGAS/LevelCompletedNode' );
  var AtomNode = require( 'NITROGLYCERIN/nodes/AtomNode' );
  var Element = require( 'NITROGLYCERIN/Element' );

  // strings
  var checkString = require( 'string!BALANCING_CHEMICAL_EQUATIONS/check' );
  var nextString = require( 'string!BALANCING_CHEMICAL_EQUATIONS/next' );
  var tryAgainString = require( 'string!BALANCING_CHEMICAL_EQUATIONS/tryAgain' );
  var showAnswerString = require( 'string!BALANCING_CHEMICAL_EQUATIONS/showAnswer' );


  // Constants
  var BOX_SIZE = new Dimension2( 285, 360 );
  var BOX_SEPARATION = 140; // horizontal spacing between boxes

  /**
   * @param {gameModel} gameModel - balancing model object.
   * @constructor
   */
  function GameView( gameModel ) {
    var self = this;

    //Constants
    var BUTTONS_OPTIONS = {
      baseColor: 'yellow',
      centerX: gameModel.width / 2,
      y: 290
    };

    ScreenView.call( this, {renderer: BCEConstants.RENDERER} );

    this.model = gameModel;
    this.audioPlayer = new GameAudioPlayer( gameModel.soundEnabledProperty );
    this.aligner = new HorizontalAligner( BOX_SIZE, BOX_SEPARATION, gameModel.width / 2, 0, gameModel.width );

    // Add a root node where all of the game-related nodes will live.
    this.rootNode = new Node();
    this.addChild( this.rootNode );

    //main nodes, start and game
    this.startGameLevelNode = new StartGameLevelNode( this.model );
    this.gamePlayNode = new Node();


    //startGame nodes
    //game nodes
    //scoreboard at the bottom of the screen
    var scoreboard = new Scoreboard(
      gameModel.currentEquationIndexProperty,
      new Property( gameModel.EQUATIONS_PER_GAME ),
      gameModel.currentLevelProperty,
      gameModel.pointsProperty,
      gameModel.timer.elapsedTimeProperty,
      gameModel.timerEnabledProperty,
      self.model.newGame.bind( self.model ),
      {
        centerX: this.aligner.centerXOffset,
        bottom: this.model.height - 10
      }
    );
    this.gamePlayNode.addChild( scoreboard );

    // Equation
    this.equationNode = new EquationNode( this.model.currentEquationProperty, this.model.COEFFICENTS_RANGE, this.aligner, {y: this.model.height - 100} );
    this.gamePlayNode.addChild( this.equationNode );

    // boxes that show molecules corresponding to the equation coefficients
    this.boxesNode = new BoxesNode( gameModel, this.aligner, BCEConstants.BOX_COLOR, {y: 10} );
    this.gamePlayNode.addChild( this.boxesNode );

    //buttons check, next, tryAgain, showAnswer
    this.checkButton = new TextPushButton( checkString, _.extend( BUTTONS_OPTIONS, {
      listener: function() {
        self.playGuessAudio();
        self.model.check();
      }
    } ) );
    this.nextButton = new TextPushButton( nextString, _.extend( BUTTONS_OPTIONS, {
      listener: function() {
        self.model.next();
      }
    } ) );
    this.tryAgainButton = new TextPushButton( tryAgainString, _.extend( BUTTONS_OPTIONS, {
      listener: function() {
        self.model.tryAgain();
      }
    } ) );
    this.showAnswerButton = new TextPushButton( showAnswerString, _.extend( BUTTONS_OPTIONS, {
      listener: function() {
        self.model.showAnswer();
      }
    } ) );
    this.gamePlayNode.addChild( this.checkButton );
    this.gamePlayNode.addChild( this.nextButton );
    this.gamePlayNode.addChild( this.tryAgainButton );
    this.gamePlayNode.addChild( this.showAnswerButton );

    //popups
    this.popupNode = null; // looks like a dialog, tells user how they did
    //listeners
    this.showWhyButtonListener = function() {
      self.swapPopups( new NotBalancedVerboseNode( self.model.currentEquationProperty, self.hideWhyButtonListener, self.model.balancedRepresentation, self.aligner ) );
    };
    this.hideWhyButtonListener = function() {
      self.swapPopups( new NotBalancedTerseNode( self.showWhyButtonListener ) );
    };

    //observers
    // Monitor the game state and update the view accordingly.
    gameModel.stateProperty.link( function( state ) {

      self.equationNode.setEditable( state === self.model.gameState.CHECK );

      // call an initializer to setup the game for the state
      var states = gameModel.gameState;
      switch( state ) {
        case states.LEVEL_SELECTION:
          self.initLevelSelection();
          break;
        case states.START_GAME:
          self.initStartGame();
          break;
        case states.CHECK:
          self.initCheck();
          break;
        case states.TRY_AGAIN:
          self.initTryAgain();
          break;
        case states.SHOW_ANSWER:
          self.initShowAnswer();
          break;
        case states.NEXT:
          self.initNext();
          break;
        case states.LEVEL_COMPLETED:
          self.initLevelCompleted();
          break;
        default:
          throw new Error( 'unsupported state: ' + state );
      }
    } );

    // Disable 'Check' button when all coefficients are zero.
    var coefficientsSumObserver = function( coefficientsSum ) {
      self.checkButton.enabled = ( coefficientsSum > 0 );
    };
    gameModel.currentEquationProperty.link( function( newEquation, oldEquation ) {
      if ( oldEquation ) { oldEquation.coefficientsSumProperty.unlink( coefficientsSumObserver ); }
      if ( newEquation ) { newEquation.coefficientsSumProperty.link( coefficientsSumObserver ); }
    } );
  }

  return inherit( ScreenView, GameView, {
    step: function( dt ) {
      if ( this.animateReward ) {
        this.rewardNode.step( dt );
      }
    },
    initLevelSelection: function() {
      this.rootNode.removeAllChildren();
      this.rootNode.addChild( this.startGameLevelNode );
    },
    initStartGame: function() {
      this.rootNode.removeAllChildren();
      this.rootNode.addChild( this.gamePlayNode );
      this.model.startGame();
    },
    initCheck: function() {
      this.setBalancedHighlightEnabled( false );
      this.setButtonNodeVisible( this.checkButton );
      this.setPopupVisible( false );
    },
    initTryAgain: function() {
      this.setButtonNodeVisible( this.tryAgainButton );
      this.setPopupVisible( true );
    },
    initShowAnswer: function() {
      this.setButtonNodeVisible( this.showAnswerButton );
      this.setPopupVisible( true );
    },
    initNext: function() {
      this.setBalancedHighlightEnabled( true );
      this.setButtonNodeVisible( this.nextButton );
      this.setPopupVisible( this.model.currentEquation.balancedAndSimplified );
      this.model.currentEquation.balance(); // show the correct answer
    },
    initLevelCompleted: function() {
      var self = this;
      this.rootNode.removeAllChildren();

      if ( this.model.isPerfectScore() ) {
        // Perfect score, add the reward node.
        //reward node
        this.rewardNode = new RewardNode( {
          nodes: [
            new AtomNode( Element.C ),
            new AtomNode( Element.Cl ),
            new AtomNode( Element.F ),
            new AtomNode( Element.H ),
            new AtomNode( Element.N ),
            new AtomNode( Element.O ),
            new AtomNode( Element.P ),
            new AtomNode( Element.S )
          ]
        } );
        this.rootNode.addChild( this.rewardNode );
        this.animateReward = true;
      }


      // bestTime on level, must be null to not show in popup
      var bestTimeOnThisLevel = this.model.bestTimes[ this.model.currentLevel ].get() === 0 ? null : this.model.bestTimes[ this.model.currentLevel ].get();

      // Add the dialog node that indicates that the level has been completed.
      this.rootNode.addChild( new LevelCompletedNode( this.model.currentLevel, this.model.points, this.model.getPerfectScore(),
        this.model.EQUATIONS_PER_GAME, this.model.timerEnabled, this.model.timer.elapsedTime, bestTimeOnThisLevel, this.model.isNewBestTime,
        function() {
          self.animateReward = false;
          self.model.state = self.model.gameState.LEVEL_SELECTION;
        }, {
          centerX: this.model.width / 2,
          centerY: this.model.height / 2,
          levelVisible: false
        } ) );

      // Play the appropriate audio feedback.
      if ( this.model.isPerfectScore() ) {
        this.audioPlayer.gameOverPerfectScore();
      }
      else {
        this.audioPlayer.gameOverImperfectScore();
      }
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
      if ( this.model.currentEquation.balancedAndSimplified ) {
        this.audioPlayer.correctAnswer();
      }
      else {
        this.audioPlayer.wrongAnswer();
      }
    },
    /**
     * Controls the visibility of the games results "popup".
     * This tells the user whether their guess is correct or not.
     *
     * @param visible
     */
    setPopupVisible: function( visible ) {
      if ( this.popupNode !== null ) {
        this.gamePlayNode.removeChild( this.popupNode );
        this.popupNode = null;
      }
      if ( visible ) {

        // evaluate the user's answer and create the proper type of node
        var equation = this.model.currentEquation;
        if ( equation.balancedAndSimplified ) {
          this.popupNode = new BalancedNode( this.model.currentPoints );
        }
        else if ( equation.balanced ) {
          this.popupNode = new BalancedNotSimplifiedNode();
        }
        else {
          this.popupNode = new NotBalancedTerseNode( this.showWhyButtonListener );
        }

        this.popupNode.centerX = this.aligner.centerXOffset;
        this.popupNode.top = 20;

        this.gamePlayNode.addChild( this.popupNode ); // visible and in front
      }
    },
    /*
     * Replaces the current popup with a new popup.
     * This is used for the "Not Balanced" popup, which has terse and verbose versions.
     * The new popup is positioned so that it has the same top-center as the old popup.
     * As an additional constrain, the new popup is guaranteed to be above the Try Again button,
     * so that that buttons is not obscured by the popup.
     */
    swapPopups: function( newPopupNode ) {
      var oldPopupNode = this.popupNode;
      this.gamePlayNode.removeChild( this.popupNode );
      this.popupNode = newPopupNode;

      // align with top-center of old popup
      this.popupNode.centerX = oldPopupNode.centerX;
      this.popupNode.y = oldPopupNode.y;

      this.gamePlayNode.addChild( this.popupNode );
    }
  } );
} )
;
