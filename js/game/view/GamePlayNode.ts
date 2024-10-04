// Copyright 2014-2024, University of Colorado Boulder

/**
 * Node that contains all user-interface elements related to playing game challenges.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Node, Text } from '../../../../scenery/js/imports.js';
import TextPushButton, { TextPushButtonOptions } from '../../../../sun/js/buttons/TextPushButton.js';
import FiniteStatusBar from '../../../../vegas/js/FiniteStatusBar.js';
import GameAudioPlayer from '../../../../vegas/js/GameAudioPlayer.js';
import ScoreDisplayLabeledNumber from '../../../../vegas/js/ScoreDisplayLabeledNumber.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import BalancingChemicalEquationsStrings from '../../BalancingChemicalEquationsStrings.js';
import BoxesNode from '../../common/view/BoxesNode.js';
import EquationNode from '../../common/view/EquationNode.js';
import HorizontalAligner from '../../common/view/HorizontalAligner.js';
import GameModel from '../model/GameModel.js';
import GameFeedbackPanel from './GameFeedbackPanel.js';
import GameViewProperties from './GameViewProperties.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import BCEColors from '../../common/BCEColors.js';

// constants
const BOX_SIZE = new Dimension2( 285, 340 );
const BOX_X_SPACING = 140; // horizontal spacing between boxes
const STATUS_BAR_FONT = new PhetFont( 14 );
const STATUS_BAR_TEXT_FILL = 'white';

export default class GamePlayNode extends Node {

  private readonly model: GameModel;
  private readonly audioPlayer: GameAudioPlayer;
  private readonly layoutBounds: Bounds2;
  private readonly aligner: HorizontalAligner;
  private feedbackPanel: GameFeedbackPanel | null; // created on demand
  private readonly boxesNode: BoxesNode; // boxes that show molecules corresponding to the equation coefficients
  private readonly equationNode: EquationNode;
  private readonly checkButton: TextPushButton;
  private readonly nextButton: TextPushButton;

  public constructor( model: GameModel, viewProperties: GameViewProperties, audioPlayer: GameAudioPlayer,
                      layoutBounds: Bounds2, visibleBoundsProperty: TReadOnlyProperty<Bounds2> ) {

    super( {

      // NodeOptions
      isDisposable: false
    } );

    this.model = model;
    this.audioPlayer = audioPlayer;
    this.layoutBounds = layoutBounds;
    this.aligner = new HorizontalAligner( layoutBounds.width, BOX_SIZE.width, BOX_X_SPACING );
    this.feedbackPanel = null;

    // status bar
    const statusBar = new FiniteStatusBar( layoutBounds, visibleBoundsProperty, model.pointsProperty, {
      createScoreDisplay: scoreProperty => new ScoreDisplayLabeledNumber( scoreProperty, {
        font: STATUS_BAR_FONT,
        textFill: STATUS_BAR_TEXT_FILL
      } ),
      levelProperty: model.levelProperty, // FiniteStatusBar levelProperty is 1-based number, and so is model.levelProperty
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
        listener: () => {
          this.interruptSubtreeInput();
          this.model.newGame();
        },
        xMargin: 10,
        yMargin: 5
      }
    } );
    this.addChild( statusBar );

    this.boxesNode = new BoxesNode( model.currentEquationProperty, model.coefficientsRange, this.aligner,
      BOX_SIZE, BCEColors.BOX_COLOR, viewProperties.reactantsBoxExpandedProperty, viewProperties.productsBoxExpandedProperty,
      { y: statusBar.bottom + 15 } );
    this.addChild( this.boxesNode );

    this.equationNode = new EquationNode( this.model.currentEquationProperty, this.model.coefficientsRange, this.aligner );
    this.addChild( this.equationNode );
    this.equationNode.centerY = this.layoutBounds.height - ( this.layoutBounds.height - this.boxesNode.bottom ) / 2;

    // buttons: Check, Next
    const BUTTONS_OPTIONS = {
      font: new PhetFont( 20 ),
      baseColor: 'yellow',
      maxWidth: 0.85 * BOX_X_SPACING
    };

    this.checkButton = new TextPushButton( BalancingChemicalEquationsStrings.checkStringProperty,
      combineOptions<TextPushButtonOptions>( {}, BUTTONS_OPTIONS, {
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

    this.nextButton = new TextPushButton( BalancingChemicalEquationsStrings.nextStringProperty,
      combineOptions<TextPushButtonOptions>( {}, BUTTONS_OPTIONS, {
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
        answerNode.string = equation.getCoefficientsString();
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
      if ( state === 'check' ) {
        this.initCheck();
      }
      else if ( state === 'tryAgain' ) {
        this.initTryAgain();
      }
      else if ( state === 'showAnswer' ) {
        this.initShowAnswer();
      }
      else if ( state === 'next' ) {
        this.initNext();
      }
    } );

    // Disable 'Check' button when all coefficients are zero.
    const coefficientsSumObserver = ( coefficientsSum: number ) => {
      this.checkButton.enabled = ( coefficientsSum > 0 );
    };
    model.currentEquationProperty.link( ( newEquation, oldEquation ) => {
      if ( oldEquation ) { oldEquation.coefficientsSumProperty.unlink( coefficientsSumObserver ); }
      if ( newEquation ) { newEquation.coefficientsSumProperty.link( coefficientsSumObserver ); }
    } );
  }

  private initCheck(): void {
    this.equationNode.setCoefficientsEditable( true );
    this.checkButton.visible = true;
    this.nextButton.visible = false;
    this.setFeedbackPanelVisible( false );
    this.setBalancedHighlightEnabled( false );
  }

  private initTryAgain(): void {
    this.equationNode.setCoefficientsEditable( false );
    this.checkButton.visible = this.nextButton.visible = false;
    this.setFeedbackPanelVisible( true );
    this.setBalancedHighlightEnabled( false );
  }

  private initShowAnswer(): void {
    this.equationNode.setCoefficientsEditable( false );
    this.checkButton.visible = this.nextButton.visible = false;
    this.setFeedbackPanelVisible( true );
    this.setBalancedHighlightEnabled( false );
  }

  private initNext(): void {

    this.equationNode.setCoefficientsEditable( false );
    this.checkButton.visible = false;

    const currentEquation = this.model.currentEquationProperty.value;
    this.nextButton.visible = !currentEquation.balancedAndSimplified; // 'Next' button is in the feedbackPanel
    this.setFeedbackPanelVisible( currentEquation.balancedAndSimplified );
    this.setBalancedHighlightEnabled( true );
    currentEquation.balance(); // show the correct answer (do this last!)
  }

  /*
   * Turns on/off the highlighting feature that indicates whether the equation is balanced.
   * We need to be able to control this so that a balanced equation doesn't highlight
   * until after the user has completed a challenge.
   */
  private setBalancedHighlightEnabled( enabled: boolean ): void {
    this.equationNode.setBalancedHighlightEnabled( enabled );
    this.boxesNode.setBalancedHighlightEnabled( enabled );
  }

  /**
   * Plays a sound corresponding to whether the user's guess is correct or incorrect.
   */
  private playGuessAudio(): void {
    if ( this.model.currentEquationProperty.value.balancedAndSimplified ) {
      this.audioPlayer.correctAnswer();
    }
    else {
      this.audioPlayer.wrongAnswer();
    }
  }

  /**
   * Controls the visibility of the game feedback panel.
   * This tells the user whether their guess is correct or not.
   */
  private setFeedbackPanelVisible( visible: boolean ): void {
    if ( this.feedbackPanel ) {
      this.removeChild( this.feedbackPanel );
      this.feedbackPanel.dispose();
      this.feedbackPanel = null;
    }
    if ( visible ) {
      const feedbackPanel = new GameFeedbackPanel( this.model, this.aligner );
      feedbackPanel.localBoundsProperty.link( () => {
        feedbackPanel.centerX = this.layoutBounds.centerX;
        feedbackPanel.top = this.boxesNode.top + 10;
      } );
      this.addChild( feedbackPanel ); // visible and in front
      this.feedbackPanel = feedbackPanel;
    }
  }
}

balancingChemicalEquations.register( 'GamePlayNode', GamePlayNode );