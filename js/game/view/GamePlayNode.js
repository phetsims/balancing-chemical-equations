// Copyright 2002-2014, University of Colorado Boulder

/**
 * Node that contains all of the user-interface elements related to playing game challenges.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var BCEConstants = require( 'BALANCING_CHEMICAL_EQUATIONS/common/BCEConstants' );
  var BCEQueryParameters = require( 'BALANCING_CHEMICAL_EQUATIONS/common/BCEQueryParameters' );
  var BoxesNode = require( 'BALANCING_CHEMICAL_EQUATIONS/common/view/BoxesNode' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var EquationNode = require( 'BALANCING_CHEMICAL_EQUATIONS/common/view/EquationNode' );
  var GameFeedbackDialog = require( 'BALANCING_CHEMICAL_EQUATIONS/game/view/GameFeedbackDialog' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var ScoreboardBar = require( 'VEGAS/ScoreboardBar' );
  var Text = require( 'SCENERY/nodes/Text' );
  var TextPushButton = require( 'SUN/buttons/TextPushButton' );

  // strings
  var checkString = require( 'string!BALANCING_CHEMICAL_EQUATIONS/check' );
  var nextString = require( 'string!BALANCING_CHEMICAL_EQUATIONS/next' );

  function GamePlayNode( model, viewProperties, audioPlayer, layoutBounds, aligner, boxSize, boxXSpacing, options ) {

    var self = this;
    this.model = model; // @private
    this.audioPlayer = audioPlayer; // @private
    this.aligner = aligner; // @private
    this.layoutBounds = layoutBounds; // @private
    this.feedbackDialog = null; // @private game feedback dialog, created on demand

    Node.call( this );

    // scoreboard
    var scoreboard = new ScoreboardBar(
      layoutBounds.width,
      model.currentEquationIndexProperty,
      model.numberOfEquationsProperty,
      model.levelProperty,
      model.pointsProperty,
      model.timer.elapsedTimeProperty,
      viewProperties.timerEnabledProperty,
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
    this.addChild( scoreboard );

    // @private boxes that show molecules corresponding to the equation coefficients
    this.boxesNode = new BoxesNode( model.currentEquationProperty, model.COEFFICENTS_RANGE, this.aligner,
      boxSize, BCEConstants.BOX_COLOR, viewProperties.reactantsBoxExpandedProperty, viewProperties.productsBoxExpandedProperty,
      { y: scoreboard.bottom + 15 } );
    this.addChild( this.boxesNode );

    // @private equation
    this.equationNode = new EquationNode( this.model.currentEquationProperty, this.model.COEFFICENTS_RANGE, this.aligner );
    this.addChild( this.equationNode );
    this.equationNode.centerY = this.layoutBounds.height - ( this.layoutBounds.height - this.boxesNode.bottom ) / 2;

    // buttons: Check, Next
    var BUTTONS_OPTIONS = {
      baseColor: 'yellow',
      centerX: 0,
      bottom: this.boxesNode.bottom
    };
    // @private
    this.checkButton = new TextPushButton( checkString, _.extend( BUTTONS_OPTIONS, {
      listener: function() {
        self.playGuessAudio();
        self.model.check();
      }
    } ) );
    // @private
    this.nextButton = new TextPushButton( nextString, _.extend( BUTTONS_OPTIONS, {
      listener: function() {
        self.model.next();
      }
    } ) );

    // scale buttons uniformly to fit the horizontal space between the boxes, see issue #68
    var buttonsParent = new Node( { children: [ this.checkButton, this.nextButton ] } );
    buttonsParent.setScaleMagnitude( Math.min( 1, 0.85 * boxXSpacing / buttonsParent.width ) );
    buttonsParent.centerX = this.layoutBounds.centerX;
    buttonsParent.bottom = this.boxesNode.bottom;
    this.addChild( buttonsParent );

    // developer stuff
    if ( BCEQueryParameters.DEV ) {

      // display correct coefficient at bottom center of the screen
      var answerNode = new Text( '', { font: new PhetFont( 12 ), bottom: this.layoutBounds.bottom - 5 } );
      this.addChild( answerNode );
      this.model.currentEquationProperty.link( function( equation ) {
        answerNode.text = equation.getCoefficientsString();
        answerNode.centerX = self.layoutBounds.centerX;
      } );

      // skips the current equation
      var skipButton = new TextPushButton( 'Skip', {
        font: new PhetFont( 10 ),
        baseColor: 'red',
        textFill: 'white',
        listener: model.next.bind( model ), // equivalent to 'Next'
        left: this.layoutBounds.left + 4,
        bottom: this.layoutBounds.bottom - 2
      } );
      this.addChild( skipButton );
    }

    model.stateProperty.link( function( state ) {

      var states = model.states;

      // equation interactivity enabled only when the 'Check' button is visible
      self.equationNode.pickable = ( state === states.CHECK );
      self.checkButton.visible = ( state === states.CHECK );

      // if correct, the 'Next' button is in the game feedback dialog
      self.nextButton.visible = ( state === states.NEXT && !self.model.currentEquation.balancedAndSimplified );

      // feedback dialog
      self.setFeedbackDialogVisible( state === states.TRY_AGAIN ||
                                     state === states.SHOW_ANSWER ||
                                     ( state === states.NEXT && self.model.currentEquation.balancedAndSimplified ) );

      self.setBalancedHighlightEnabled( state === states.NEXT );
      if ( state === states.NEXT ) {
        self.model.currentEquation.balance(); // show the correct answer
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

    this.mutate( options );
  }

  return inherit( Node, GamePlayNode, {

    /*
     * Turns on/off the highlighting feature that indicates whether the equation is balanced.
     * We need to be able to control this so that a balanced equation doesn't highlight
     * until after the user has completed a challenge.
     * @private
     */
    setBalancedHighlightEnabled: function( enabled ) {
      this.equationNode.setBalancedHighlightEnabled( enabled );
      this.boxesNode.setBalancedHighlightEnabled( enabled );
    },

    /**
     * Plays a sound corresponding to whether the user's guess is correct or incorrect.
     * @private
     */
    playGuessAudio: function() {
      if ( this.model.currentEquation.balancedAndSimplified ) {
        this.audioPlayer.correctAnswer();
      }
      else {
        this.audioPlayer.wrongAnswer();
      }
    },

    /**
     * Controls the visibility of the game feedback dialog.
     * This tells the user whether their guess is correct or not.
     * @param visible
     * @private
     */
    setFeedbackDialogVisible: function( visible ) {
      if ( this.feedbackDialog ) {
        this.removeChild( this.feedbackDialog );
        this.feedbackDialog = null;
      }
      if ( visible ) {
        this.feedbackDialog = new GameFeedbackDialog( this.model, this.aligner,
          { centerX: this.layoutBounds.centerX, top: this.boxesNode.top + 10 } );
        this.addChild( this.feedbackDialog ); // visible and in front
      }
    }
  } );
} );
