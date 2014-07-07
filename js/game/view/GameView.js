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
  var Property = require( 'AXON/Property' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var HorizontalAligner = require( 'BALANCING_CHEMICAL_EQUATIONS/common/view/HorizontalAligner' );
  var TextPushButton = require( 'SUN/buttons/TextPushButton' );
  var NotBalancedTerseNode = require( 'BALANCING_CHEMICAL_EQUATIONS/game/view/popup/NotBalancedTerseNode' );
  var NotBalancedVerboseNode = require( 'BALANCING_CHEMICAL_EQUATIONS/game/view/popup/NotBalancedVerboseNode' );
  var BalancedNode = require( 'BALANCING_CHEMICAL_EQUATIONS/game/view/popup/BalancedNode' );
  var BalancedNotSimplifiedNode = require( 'BALANCING_CHEMICAL_EQUATIONS/game/view/popup/BalancedNotSimplifiedNode' );
  var LevelSelectionNode = require( 'BALANCING_CHEMICAL_EQUATIONS/game/view/LevelSelectionNode' );
  var BCERewardNode = require( 'BALANCING_CHEMICAL_EQUATIONS/game/view/BCERewardNode' );
  var LevelCompletedNode = require( 'VEGAS/LevelCompletedNode' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Vector2 = require( 'DOT/Vector2' );

  // strings
  var checkString = require( 'string!BALANCING_CHEMICAL_EQUATIONS/check' );
  var nextString = require( 'string!BALANCING_CHEMICAL_EQUATIONS/next' );
  var tryAgainString = require( 'string!BALANCING_CHEMICAL_EQUATIONS/tryAgain' );
  var showAnswerString = require( 'string!BALANCING_CHEMICAL_EQUATIONS/showAnswer' );

  // Constants
  var BOX_SIZE = new Dimension2( 285, 360 );
  var BOX_X_SPACING = 140; // horizontal spacing between boxes

  /**
   * @param {GameModel} model
   * @constructor
   */
  function GameView( model ) {

    var self = this;
    ScreenView.call( this, {renderer: BCEConstants.RENDERER} );

    this.model = model;
    this.audioPlayer = new GameAudioPlayer( model.soundEnabledProperty );
    this.aligner = new HorizontalAligner( BOX_SIZE, BOX_X_SPACING, this.layoutBounds.width / 2, 0, this.layoutBounds.width );

    // Add a root node where all of the game-related nodes will live.
    this.rootNode = new Node();
    this.addChild( this.rootNode );

    // main nodes, start and game
    this.levelSelectionNode = new LevelSelectionNode( this.model, this.layoutBounds );
    this.gamePlayNode = new Node();

    // Scoreboard bar at the top of the screen
    var scoreboard = new ScoreboardBar(
      this.layoutBounds.width,
      model.currentEquationIndexProperty,
      new Property( model.EQUATIONS_PER_GAME ),
      model.currentLevelProperty,
      model.pointsProperty,
      model.timer.elapsedTimeProperty,
      model.timerEnabledProperty,
      self.model.newGame.bind( self.model ),
      {
        font: new PhetFont( 14 ),
        yMargin: 5,
        leftMargin: 30,
        rightMargin: 30,
        centerX: this.layoutBounds.centerX,
        top: this.layoutBounds.top
      }
    );
    this.gamePlayNode.addChild( scoreboard );

    // boxes that show molecules corresponding to the equation coefficients
    this.boxesNode = new BoxesNode( model, this.aligner, BCEConstants.BOX_COLOR, { y: scoreboard.bottom + 15 } );
    this.gamePlayNode.addChild( this.boxesNode );

    // Equation
    this.equationNode = new EquationNode( this.model.currentEquationProperty, this.model.COEFFICENTS_RANGE, this.aligner );
    this.gamePlayNode.addChild( this.equationNode );
    this.equationNode.centerY = this.layoutBounds.height - ( this.layoutBounds.height - this.boxesNode.bottom ) / 2;

    // buttons: Check, Next, Try Again, Show Answer
    var BUTTONS_OPTIONS = {
      baseColor: 'yellow',
      centerX: 0,
      bottom: this.boxesNode.bottom
    };
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

    // scale buttons uniformly to fit the horizontal space between the boxes, see issue #68
    var buttonsParent = new Node( { children: [ this.checkButton, this.nextButton, this.tryAgainButton, this.showAnswerButton ] } );
    buttonsParent.setScaleMagnitude( Math.min( 1, 0.85 * BOX_X_SPACING / buttonsParent.width ) );
    buttonsParent.centerX = this.layoutBounds.centerX;
    buttonsParent.bottom = this.boxesNode.bottom;
    this.gamePlayNode.addChild( buttonsParent );

    // popups
    this.popupNode = null; // @private looks like a dialog, tells user how they did
    this.popupLocationProperty = new Property( new Vector2( this.layoutBounds.centerX, this.boxesNode.top + 20 ) ); // @private
    // listeners
    this.showWhyButtonListener = function() {
      self.swapPopups( new NotBalancedVerboseNode( self.popupLocationProperty, self.model.currentEquationProperty, self.hideWhyButtonListener, self.model.balancedRepresentation, self.aligner ) );
    };
    this.hideWhyButtonListener = function() {
      self.swapPopups( new NotBalancedTerseNode( self.popupLocationProperty, self.showWhyButtonListener ) );
    };

    // Monitor the game state and update the view accordingly.
    model.stateProperty.link( function( state ) {

      self.equationNode.setEditable( state === self.model.states.CHECK );

      // call an initializer to setup the game for the state
      var states = model.states;
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
    model.currentEquationProperty.link( function( newEquation, oldEquation ) {
      if ( oldEquation ) { oldEquation.coefficientsSumProperty.unlink( coefficientsSumObserver ); }
      if ( newEquation ) { newEquation.coefficientsSumProperty.link( coefficientsSumObserver ); }
    } );
  }

  return inherit( ScreenView, GameView, {

    step: function( dt ) {
      if ( this.rewardNode ) {
        this.rewardNode.step( dt );
      }
    },

    initLevelSelection: function() {
      this.rootNode.removeAllChildren();
      this.rootNode.addChild( this.levelSelectionNode );
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

      // game reward, shown for perfect score (or with 'reward' query parameter)
      if ( this.model.isPerfectScore() || window.phetcommon.getQueryParameter( 'reward' ) ) {
        this.rewardNode = new BCERewardNode( this.model.currentLevel );
        this.rootNode.addChild( this.rewardNode );
      }

      // bestTime on level, must be null to not show in popup
      var bestTimeOnThisLevel = this.model.bestTimes[ this.model.currentLevel ].get() === 0 ? null : this.model.bestTimes[ this.model.currentLevel ].get();

      // Add the dialog node that indicates that the level has been completed.
      this.rootNode.addChild( new LevelCompletedNode( this.model.currentLevel, this.model.points, this.model.getPerfectScore(),
        this.model.EQUATIONS_PER_GAME, this.model.timerEnabled, this.model.timer.elapsedTime, bestTimeOnThisLevel, this.model.isNewBestTime,
        function() {
          self.rootNode.removeChild( self.rewardNode );
          self.rewardNode = null;
          self.model.state = self.model.states.LEVEL_SELECTION;
        }, {
          centerX: this.layoutBounds.centerX,
          centerY: this.layoutBounds.centerY,
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
        this.popupLocationProperty.reset();
      }
      if ( visible ) {

        // evaluate the user's answer and create the proper type of node
        var equation = this.model.currentEquation;
        if ( equation.balancedAndSimplified ) {
          this.popupNode = new BalancedNode( this.popupLocationProperty, this.model.currentPoints );
        }
        else if ( equation.balanced ) {
          this.popupNode = new BalancedNotSimplifiedNode( this.popupLocationProperty );
        }
        else {
          this.popupNode = new NotBalancedTerseNode( this.popupLocationProperty, this.showWhyButtonListener );
        }
        this.gamePlayNode.addChild( this.popupNode ); // visible and in front
      }
    },

    /*
     * Replaces the current popup with a new popup.
     * This is used for the "Not Balanced" popup, which has terse and verbose versions.
     * The new popup is positioned so that it has the same top-center as the old popup.
     */
    swapPopups: function( newPopupNode ) {
      this.gamePlayNode.removeChild( this.popupNode );
      this.popupNode = newPopupNode;
      this.gamePlayNode.addChild( this.popupNode );
    }
  } );
} )
;
