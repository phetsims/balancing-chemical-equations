// Copyright 2014-2023, University of Colorado Boulder

/**
 * Node that contains all of the user-interface elements related to playing game challenges.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import merge from '../../../../phet-core/js/merge.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Node, Text } from '../../../../scenery/js/imports.js';
import TextPushButton from '../../../../sun/js/buttons/TextPushButton.js';
import FiniteStatusBar from '../../../../vegas/js/FiniteStatusBar.js';
import ScoreDisplayLabeledNumber from '../../../../vegas/js/ScoreDisplayLabeledNumber.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import BalancingChemicalEquationsStrings from '../../BalancingChemicalEquationsStrings.js';
import BCEConstants from '../../common/BCEConstants.js';
import BoxesNode from '../../common/view/BoxesNode.js';
import EquationNode from '../../common/view/EquationNode.js';
import HorizontalAligner from '../../common/view/HorizontalAligner.js';
import GameFeedbackPanel from './GameFeedbackPanel.js';

// constants
const BOX_SIZE = new Dimension2( 285, 340 );
const BOX_X_SPACING = 140; // horizontal spacing between boxes
const STATUS_BAR_FONT = new PhetFont( 14 );
const STATUS_BAR_TEXT_FILL = 'white';

export default class GamePlayNode extends Node {

  /**
   * @param {GameModel} model
   * @param {GameViewProperties} viewProperties
   * @param {GameAudioPlayer} audioPlayer
   * @param {Bounds2} layoutBounds layout bounds of the parent ScreenView
   * @param {Property.<Bounds2>} visibleBoundsProperty of the parent ScreenView
   * @param {Object} [options]
   */
  constructor( model, viewProperties, audioPlayer, layoutBounds, visibleBoundsProperty, options ) {

    super();

    this.model = model; // @private
    this.audioPlayer = audioPlayer; // @private
    this.layoutBounds = layoutBounds; // @private
    this.aligner = new HorizontalAligner( layoutBounds.width, BOX_SIZE.width, BOX_X_SPACING ); // @private
    this.feedbackPanel = null; // @private game feedback dialog, created on demand

    // status bar
    const statusBar = new FiniteStatusBar( layoutBounds, visibleBoundsProperty, model.pointsProperty, {
      createScoreDisplay: scoreProperty => new ScoreDisplayLabeledNumber( scoreProperty, {
        font: STATUS_BAR_FONT,
        textFill: STATUS_BAR_TEXT_FILL
      } ),

      // FiniteStatusBar uses 1-based level numbering, model is 0-based, see #127.
      levelProperty: new DerivedProperty( [ model.levelProperty ], level => level + 1 ),
      challengeIndexProperty: model.currentEquationIndexProperty,
      numberOfChallengesProperty: model.numberOfEquationsProperty,
      elapsedTimeProperty: model.timer.elapsedTimeProperty,
      timerEnabledProperty: viewProperties.timerEnabledProperty,
      font: STATUS_BAR_FONT,
      textFill: STATUS_BAR_TEXT_FILL,
      barFill: 'rgb( 49, 117, 202 )',
      xMargin: 30,
      yMargin: 5,
      startOverButtonOptions: {
        baseColor: 'rgb( 229, 243, 255 )',
        textFill: 'black',
        listener: this.model.newGame.bind( this.model ),
        xMargin: 10,
        yMargin: 5
      }
    } );
    this.addChild( statusBar );

    // @private boxes that show molecules corresponding to the equation coefficients
    this.boxesNode = new BoxesNode( model.currentEquationProperty, model.COEFFICENTS_RANGE, this.aligner,
      BOX_SIZE, BCEConstants.BOX_COLOR, viewProperties.reactantsBoxExpandedProperty, viewProperties.productsBoxExpandedProperty,
      { y: statusBar.bottom + 15 } );
    this.addChild( this.boxesNode );

    // @private equation
    this.equationNode = new EquationNode( this.model.currentEquationProperty, this.model.COEFFICENTS_RANGE, this.aligner );
    this.addChild( this.equationNode );
    this.equationNode.centerY = this.layoutBounds.height - ( this.layoutBounds.height - this.boxesNode.bottom ) / 2;

    // buttons: Check, Next
    const BUTTONS_OPTIONS = {
      font: new PhetFont( 20 ),
      baseColor: 'yellow',
      maxWidth: 0.85 * BOX_X_SPACING
    };

    // @private
    this.checkButton = new TextPushButton( BalancingChemicalEquationsStrings.checkStringProperty, merge( BUTTONS_OPTIONS, {
      listener: () => {
        this.playGuessAudio();
        this.model.check();
      }
    } ) );
    this.addChild( this.checkButton );

    this.checkButton.boundsProperty.link( bounds => {
      this.checkButton.centerX = this.layoutBounds.centerX;
      this.checkButton.bottom = this.boxesNode.bottom;
    } );

    // @private
    this.nextButton = new TextPushButton( BalancingChemicalEquationsStrings.nextStringProperty, merge( BUTTONS_OPTIONS, {
      listener: () => {
        this.model.next();
      }
    } ) );
    this.addChild( this.nextButton );

    this.nextButton.boundsProperty.link( bounds => {
      this.nextButton.centerX = this.layoutBounds.centerX;
      this.nextButton.bottom = this.boxesNode.bottom;
    } );

    // developer stuff
    if ( phet.chipper.queryParameters.showAnswers ) {

      // display correct coefficient at bottom center of the screen
      const answerNode = new Text( '', {
        fill: 'red',
        font: new PhetFont( 12 ),
        bottom: this.layoutBounds.bottom - 5
      } );
      this.addChild( answerNode );
      this.model.currentEquationProperty.link( equation => {
        answerNode.text = equation.getCoefficientsString();
        answerNode.centerX = this.layoutBounds.centerX;
      } );

      // skips the current equation
      const skipButton = new TextPushButton( 'Skip', {
        font: new PhetFont( 10 ),
        baseColor: 'red',
        textFill: 'white',
        listener: model.next.bind( model ), // equivalent to 'Next'
        right: answerNode.left - 20,
        bottom: this.layoutBounds.bottom - 2
      } );
      this.addChild( skipButton );
    }

    // Call an initializer to set up the game for the state.
    model.stateProperty.link( state => {
      const states = model.states;
      if ( state === states.CHECK ) {
        this.initCheck();
      }
      else if ( state === states.TRY_AGAIN ) {
        this.initTryAgain();
      }
      else if ( state === states.SHOW_ANSWER ) {
        this.initShowAnswer();
      }
      else if ( state === states.NEXT ) {
        this.initNext();
      }
    } );

    // Disable 'Check' button when all coefficients are zero.
    const coefficientsSumObserver = coefficientsSum => {
      this.checkButton.enabled = ( coefficientsSum > 0 );
    };
    model.currentEquationProperty.link( ( newEquation, oldEquation ) => {
      if ( oldEquation ) { oldEquation.coefficientsSumProperty.unlink( coefficientsSumObserver ); }
      if ( newEquation ) { newEquation.coefficientsSumProperty.link( coefficientsSumObserver ); }
    } );

    this.mutate( options );
  }

  // No dispose needed, instances of this type persist for lifetime of the sim.

  // @private
  initCheck() {
    this.equationNode.setCoefficientsEditable( true );
    this.checkButton.visible = true;
    this.nextButton.visible = false;
    this.setFeedbackPanelVisible( false );
    this.setBalancedHighlightEnabled( false );
  }

  // @private
  initTryAgain() {
    this.equationNode.setCoefficientsEditable( false );
    this.checkButton.visible = this.nextButton.visible = false;
    this.setFeedbackPanelVisible( true );
    this.setBalancedHighlightEnabled( false );
  }

  // @private
  initShowAnswer() {
    this.equationNode.setCoefficientsEditable( false );
    this.checkButton.visible = this.nextButton.visible = false;
    this.setFeedbackPanelVisible( true );
    this.setBalancedHighlightEnabled( false );
  }

  // @private
  initNext() {

    this.equationNode.setCoefficientsEditable( false );
    this.checkButton.visible = false;

    const currentEquation = this.model.currentEquationProperty.get();
    this.nextButton.visible = !currentEquation.balancedAndSimplified; // 'Next' button is in the feedbackPanel
    this.setFeedbackPanelVisible( currentEquation.balancedAndSimplified );
    this.setBalancedHighlightEnabled( true );
    currentEquation.balance(); // show the correct answer (do this last!)
  }

  /*
   * Turns on/off the highlighting feature that indicates whether the equation is balanced.
   * We need to be able to control this so that a balanced equation doesn't highlight
   * until after the user has completed a challenge.
   * @private
   */
  setBalancedHighlightEnabled( enabled ) {
    this.equationNode.setBalancedHighlightEnabled( enabled );
    this.boxesNode.setBalancedHighlightEnabled( enabled );
  }

  /**
   * Plays a sound corresponding to whether the user's guess is correct or incorrect.
   * @private
   */
  playGuessAudio() {
    if ( this.model.currentEquationProperty.get().balancedAndSimplified ) {
      this.audioPlayer.correctAnswer();
    }
    else {
      this.audioPlayer.wrongAnswer();
    }
  }

  /**
   * Controls the visibility of the game feedback panel.
   * This tells the user whether their guess is correct or not.
   * @param visible
   * @private
   */
  setFeedbackPanelVisible( visible ) {
    if ( this.feedbackPanel ) {
      this.removeChild( this.feedbackPanel );
      this.feedbackPanel = null;
    }
    if ( visible ) {
      this.feedbackPanel = new GameFeedbackPanel( this.model, this.aligner,
        { centerX: this.layoutBounds.centerX, top: this.boxesNode.top + 10 } );
      this.addChild( this.feedbackPanel ); // visible and in front
    }
  }
}

balancingChemicalEquations.register( 'GamePlayNode', GamePlayNode );