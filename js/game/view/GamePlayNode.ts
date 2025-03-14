// Copyright 2014-2025, University of Colorado Boulder

/**
 * GamePlayNode contains all user-interface elements related to playing game challenges.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import TextPushButton, { TextPushButtonOptions } from '../../../../sun/js/buttons/TextPushButton.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FiniteStatusBar from '../../../../vegas/js/FiniteStatusBar.js';
import GameAudioPlayer from '../../../../vegas/js/GameAudioPlayer.js';
import ScoreDisplayLabeledNumber from '../../../../vegas/js/ScoreDisplayLabeledNumber.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import BalancingChemicalEquationsStrings from '../../BalancingChemicalEquationsStrings.js';
import BCEColors from '../../common/BCEColors.js';
import BoxesNode from '../../common/view/BoxesNode.js';
import EquationNode from '../../common/view/EquationNode.js';
import HorizontalAligner from '../../common/view/HorizontalAligner.js';
import GameModel from '../model/GameModel.js';
import GameFeedbackPanel from './GameFeedbackPanel.js';
import GameViewProperties from './GameViewProperties.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';

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
  private readonly accordionBoxes: BoxesNode; // boxes that show molecules corresponding to the equation coefficients
  private readonly equationNode: EquationNode;
  private readonly checkButton: TextPushButton;
  private readonly nextButton: TextPushButton;

  public constructor( model: GameModel,
                      viewProperties: GameViewProperties,
                      audioPlayer: GameAudioPlayer,
                      layoutBounds: Bounds2,
                      visibleBoundsProperty: TReadOnlyProperty<Bounds2>,
                      tandem: Tandem ) {

    super( {

      // NodeOptions
      isDisposable: false,
      tandem: tandem,
      phetioVisiblePropertyInstrumented: false
    } );

    this.model = model;
    this.audioPlayer = audioPlayer;
    this.layoutBounds = layoutBounds;
    this.aligner = new HorizontalAligner( layoutBounds.width, BOX_SIZE.width, BOX_X_SPACING );
    this.feedbackPanel = null;

    // status bar
    const statusBar = new FiniteStatusBar( layoutBounds, visibleBoundsProperty, model.scoreProperty, {
      createScoreDisplay: scoreProperty => new ScoreDisplayLabeledNumber( scoreProperty, {
        font: STATUS_BAR_FONT,
        textFill: STATUS_BAR_TEXT_FILL
      } ),
      levelProperty: new DerivedProperty( [ model.levelProperty ], level => level ? level.levelNumber : 0 ),
      challengeIndexProperty: model.currentEquationIndexProperty,
      numberOfChallengesProperty: model.numberOfEquationsProperty,
      elapsedTimeProperty: model.timer.elapsedTimeProperty,
      timerEnabledProperty: model.timerEnabledProperty,
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
          model.startOver();
        },
        xMargin: 10,
        yMargin: 5
      },
      tandem: tandem.createTandem( 'statusBar' ),
      phetioVisiblePropertyInstrumented: false
    } );
    this.addChild( statusBar );

    this.accordionBoxes = new BoxesNode( model.currentEquationProperty, model.coefficientsRange, this.aligner, BOX_SIZE,
      BCEColors.BOX_COLOR, viewProperties.reactantsAccordionBoxExpandedProperty, viewProperties.productsAccordionBoxExpandedProperty, {
        y: statusBar.bottom + 15,
        parentTandem: tandem
      } );
    this.addChild( this.accordionBoxes );

    this.equationNode = new EquationNode( this.model.currentEquationProperty, this.model.coefficientsRange, this.aligner, {
      centerY: this.layoutBounds.height - ( this.layoutBounds.height - this.accordionBoxes.bottom ) / 2,
      tandem: tandem.createTandem( 'equationNode' )
    } );
    this.addChild( this.equationNode );

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
        },
        tandem: tandem.createTandem( 'checkButton' ),
        phetioEnabledPropertyInstrumented: false,
        phetioVisiblePropertyInstrumented: false
      } ) );
    this.addChild( this.checkButton );

    this.checkButton.boundsProperty.link( bounds => {
      this.checkButton.centerX = this.layoutBounds.centerX;
      this.checkButton.bottom = this.accordionBoxes.bottom;
    } );

    this.nextButton = new TextPushButton( BalancingChemicalEquationsStrings.nextStringProperty,
      combineOptions<TextPushButtonOptions>( {}, BUTTONS_OPTIONS, {
        listener: () => {
          this.model.next();
        },
        tandem: tandem.createTandem( 'nextButton' ),
        phetioEnabledPropertyInstrumented: false,
        phetioVisiblePropertyInstrumented: false
      } ) );
    this.addChild( this.nextButton );

    this.nextButton.boundsProperty.link( bounds => {
      this.nextButton.centerX = this.layoutBounds.centerX;
      this.nextButton.bottom = this.accordionBoxes.bottom;
    } );

    if ( phet.chipper.queryParameters.showAnswers ) {

      // Show the answer at bottom center.
      const answerNode = new Text( '', {
        fill: 'red',
        font: new PhetFont( 20 ),
        bottom: this.layoutBounds.bottom - 5
      } );
      this.addChild( answerNode );
      this.model.currentEquationProperty.link( equation => {
        answerNode.string = equation.getShowAnswersString();
        answerNode.centerX = this.layoutBounds.centerX;
      } );

      // Add a 'Skip' button to skip the current equation.
      const skipButton = new TextPushButton( 'Skip', {
        font: new PhetFont( 20 ),
        baseColor: 'red',
        textFill: 'white',
        listener: model.next.bind( model ), // equivalent to 'Next'
        centerX: this.checkButton.centerX,
        bottom: this.checkButton.top - 15,
        tandem: Tandem.OPT_OUT
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
    this.nextButton.visible = !currentEquation.isBalancedAndSimplified; // 'Next' button is in the feedbackPanel
    this.setFeedbackPanelVisible( currentEquation.isBalancedAndSimplified );
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
    this.accordionBoxes.setBalancedHighlightEnabled( enabled );
  }

  /**
   * Plays a sound corresponding to whether the user's guess is correct or incorrect.
   */
  private playGuessAudio(): void {
    if ( this.model.currentEquationProperty.value.isBalancedAndSimplified ) {
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
        feedbackPanel.top = this.accordionBoxes.top + 10;
      } );
      this.addChild( feedbackPanel ); // visible and in front
      this.feedbackPanel = feedbackPanel;
    }
  }
}

balancingChemicalEquations.register( 'GamePlayNode', GamePlayNode );