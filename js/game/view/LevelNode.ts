// Copyright 2014-2026, University of Colorado Boulder

/**
 * LevelNode contains all user-interface elements related to playing game challenges.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import PDOMUtils from '../../../../scenery/js/accessibility/pdom/PDOMUtils.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import TextPushButton, { TextPushButtonOptions } from '../../../../sun/js/buttons/TextPushButton.js';
import nullSoundPlayer from '../../../../tambo/js/nullSoundPlayer.js';
import isSettingPhetioStateProperty from '../../../../tandem/js/isSettingPhetioStateProperty.js';
import phetioStateSetEmitter from '../../../../tandem/js/phetioStateSetEmitter.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import ChallengeScreenNode from '../../../../vegas/js/ChallengeScreenNode.js';
import GameAudioPlayer from '../../../../vegas/js/GameAudioPlayer.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import BalancingChemicalEquationsStrings from '../../BalancingChemicalEquationsStrings.js';
import BCEColors from '../../common/BCEColors.js';
import EquationNode from '../../common/view/EquationNode.js';
import HorizontalAligner from '../../common/view/HorizontalAligner.js';
import ParticlesNode from '../../common/view/ParticlesNode.js';
import GameModel from '../model/GameModel.js';
import { BCEFiniteStatusBar } from './BCEFiniteStatusBar.js';
import GameFeedbackNode from './GameFeedbackNode.js';
import GameViewProperties from './GameViewProperties.js';

const BOX_SIZE = new Dimension2( 285, 340 );
const BOX_X_SPACING = 140; // horizontal spacing between boxes
const TEXT_PUSH_BUTTON_OPTIONS: TextPushButtonOptions = {
  font: new PhetFont( 20 ),
  baseColor: 'yellow',
  maxTextWidth: 0.75 * BOX_X_SPACING
};

export default class LevelNode extends ChallengeScreenNode {

  private readonly model: GameModel;
  private readonly audioPlayer: GameAudioPlayer;
  private readonly layoutBounds: Bounds2;
  private readonly aligner: HorizontalAligner;

  // Shows particles corresponding to the equation coefficients
  private readonly particlesNode: ParticlesNode;

  private equationNode: EquationNode;
  private readonly equationNodeParent: Node;

  private readonly checkButton: TextPushButton;
  private readonly nextButton: TextPushButton;

  private readonly feedbackNode: GameFeedbackNode;

  public constructor( model: GameModel,
                      viewProperties: GameViewProperties,
                      audioPlayer: GameAudioPlayer,
                      layoutBounds: Bounds2,
                      visibleBoundsProperty: TReadOnlyProperty<Bounds2>,
                      tandem: Tandem ) {

    super( {
      levelNumberProperty: model.levelNumberProperty,

      // Node Options
      isDisposable: false,

      // PhET-iO Options
      tandem: tandem,
      phetioDocumentation: 'The user interface for playing a game level.',
      phetioVisiblePropertyInstrumented: false
    } );

    this.model = model;
    this.audioPlayer = audioPlayer;
    this.layoutBounds = layoutBounds;
    this.aligner = new HorizontalAligner( layoutBounds.width, BOX_SIZE.width, BOX_X_SPACING );

    const statusBar = new BCEFiniteStatusBar( model, layoutBounds, visibleBoundsProperty, tandem.createTandem( 'statusBar' ) );
    this.addChild( statusBar );

    this.particlesNode = new ParticlesNode( model.challengeProperty, model.coefficientsRange, this.aligner, BOX_SIZE,
      BCEColors.BOX_COLOR, viewProperties.reactantsAccordionBoxExpandedProperty, viewProperties.productsAccordionBoxExpandedProperty, {
        y: statusBar.bottom + 15,
        parentTandem: tandem
      } );
    this.addChild( this.particlesNode );

    this.equationNode = new EquationNode( model.challengeProperty.value, this.aligner, {
      tandem: Tandem.OPT_OUT // ... because equationNode is created dynamically.
    } );

    this.equationNodeParent = new Node();
    this.addChild( this.equationNodeParent );
    this.equationNodeParent.children = [ this.equationNode ];

    // x position is handled by this.aligner.
    this.equationNodeParent.centerY = this.layoutBounds.height - ( this.layoutBounds.height - this.particlesNode.bottom ) / 2;

    model.challengeProperty.lazyLink( challenge => {

      // Dispose of the previous equationNode.
      this.equationNode.dispose();

      // Create a new equationNode for the current challenge.
      this.equationNode = new EquationNode( challenge, this.aligner, {
        tandem: Tandem.OPT_OUT // ... because equationNode is created dynamically.
      } );
      this.equationNodeParent.children = [ this.equationNode ];
    } );

    this.checkButton = new TextPushButton( BalancingChemicalEquationsStrings.checkStringProperty,
      combineOptions<TextPushButtonOptions>( {}, TEXT_PUSH_BUTTON_OPTIONS, {
        listener: () => {
          this.playGuessAudio();
          this.model.check();
        },
        soundPlayer: nullSoundPlayer,
        tandem: tandem.createTandem( 'checkButton' ),
        phetioEnabledPropertyInstrumented: false,
        phetioVisiblePropertyInstrumented: false
      } ) );
    this.addChild( this.checkButton );

    this.checkButton.boundsProperty.link( () => {
      this.checkButton.centerX = this.layoutBounds.centerX;
      this.checkButton.bottom = this.particlesNode.bottom;
    } );

    this.nextButton = new TextPushButton( BalancingChemicalEquationsStrings.nextStringProperty,
      combineOptions<TextPushButtonOptions>( {}, TEXT_PUSH_BUTTON_OPTIONS, {
        listener: () => {
          this.model.next();
        },
        tandem: tandem.createTandem( 'nextButton' ),
        phetioEnabledPropertyInstrumented: false,
        phetioVisiblePropertyInstrumented: false
      } ) );
    this.addChild( this.nextButton );

    this.nextButton.boundsProperty.link( () => {
      this.nextButton.centerX = this.layoutBounds.centerX;
      this.nextButton.bottom = this.particlesNode.bottom;
    } );

    if ( phet.chipper.queryParameters.showAnswers ) {

      // Show the answer at bottom center.
      const answerNode = new Text( '', {
        fill: 'red',
        font: new PhetFont( 20 ),
        bottom: this.layoutBounds.bottom - 5
      } );
      this.addChild( answerNode );
      this.model.challengeProperty.link( challenge => {
        answerNode.string = challenge.getAnswerString();
        answerNode.centerX = this.layoutBounds.centerX;
      } );

      // Add a 'Skip' button to skip the current equation.
      const skipButton = new TextPushButton( 'Skip', combineOptions<TextPushButtonOptions>( {}, TEXT_PUSH_BUTTON_OPTIONS, {
        baseColor: 'red',
        textFill: 'white',
        listener: () => model.skip(),
        centerX: this.checkButton.centerX,
        bottom: this.checkButton.top - 15,
        enabledProperty: new DerivedProperty( [ model.gameStateProperty ], gameState => gameState === 'check' ),
        accessibleHelpText: 'This button allows you to skip the current equation only when the showAnswers query parameter is enabled.',
        tandem: Tandem.OPT_OUT // skipButton is optional with ?showAnswers, not part of the PhET-iO API.
      } ) );
      this.addChild( skipButton );
    }

    this.feedbackNode = new GameFeedbackNode( model, this.aligner, tandem.createTandem( 'feedbackNode' ) );
    this.feedbackNode.boundsProperty.link( () => {
      this.feedbackNode.centerX = this.layoutBounds.centerX;
      this.feedbackNode.top = this.particlesNode.top + 10;
    } );
    this.addChild( this.feedbackNode );

    // Updating the UI for the game state depends on several other Properties, so there is an ordering problem.
    // So we need to defer calling updateGameState until after PhET-iO state has been set.
    model.gameStateProperty.link( () => {
      if ( !isSettingPhetioStateProperty.value ) {
        this.updateGameState();
      }
    } );
    phetioStateSetEmitter.addListener( () => this.updateGameState() );

    // Enable the 'Check' button when at least one coefficient is non-zero.
    const hasNonZeroCoefficientListener = ( hasNonZeroCoefficient: boolean ) => {
      this.checkButton.enabled = hasNonZeroCoefficient;
    };
    model.challengeProperty.link( ( newChallenge, oldChallenge ) => {
      if ( oldChallenge ) {
        oldChallenge.hasNonZeroCoefficientProperty.unlink( hasNonZeroCoefficientListener );
      }
      if ( newChallenge ) {
        newChallenge.hasNonZeroCoefficientProperty.link( hasNonZeroCoefficientListener );
      }
    } );

    this.accessibleChallengeSectionNode.pdomOrder = [
      this.equationNodeParent,
      this.particlesNode
    ];
    this.accessibleAnswerSectionNode.pdomOrder = [
      this.feedbackNode,
      this.checkButton,
      this.nextButton
    ];
    this.accessibleStatusSectionNode.pdomOrder = [
      statusBar
    ];
  }

  /**
   * Updates the UI for the specified game state.
   */
  private updateGameState(): void {
    const gameState = this.model.gameStateProperty.value;
    phet.log && phet.log( `gameState=${gameState}` );
    if ( gameState === 'check' ) {
      this.initCheck();
    }
    else if ( gameState === 'tryAgain' ) {
      this.initTryAgain();
    }
    else if ( gameState === 'showAnswer' ) {
      this.initShowAnswer();
    }
    else if ( gameState === 'next' ) {
      this.initNext();
    }
  }

  /**
   * Set up the UI for the 'check' game state.
   */
  private initCheck(): void {
    this.equationNode.setCoefficientsEditable( true );
    this.checkButton.visible = true;
    this.nextButton.visible = false;
    this.setFeedbackNodeVisible( false );
    this.setBalancedHighlightEnabled( false );
  }

  /**
   * Set up the UI for the 'tryAgain' game state.
   */
  private initTryAgain(): void {
    this.equationNode.setCoefficientsEditable( false );
    this.checkButton.visible = this.nextButton.visible = false;
    this.setFeedbackNodeVisible( true );
    this.setBalancedHighlightEnabled( false );
  }

  /**
   * Set up the UI for the 'showAnswer' game state.
   */
  private initShowAnswer(): void {
    this.equationNode.setCoefficientsEditable( false );
    this.checkButton.visible = this.nextButton.visible = false;
    this.setFeedbackNodeVisible( true );
    this.setBalancedHighlightEnabled( false );
  }

  /**
   * Set up the UI for the 'next' game state.
   */
  private initNext(): void {

    this.equationNode.setCoefficientsEditable( false );
    this.checkButton.visible = false;

    const currentEquation = this.model.challengeProperty.value;
    this.nextButton.visible = !currentEquation.isSimplifiedProperty.value;
    this.setFeedbackNodeVisible( currentEquation.isSimplifiedProperty.value );
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
    this.particlesNode.setBalancedHighlightEnabled( enabled );
  }

  /**
   * Plays a sound corresponding to whether the user's guess is correct or incorrect.
   */
  private playGuessAudio(): void {
    if ( this.model.challengeProperty.value.isSimplifiedProperty.value ) {
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
  private setFeedbackNodeVisible( visible: boolean ): void {
    this.feedbackNode.update();
    this.feedbackNode.moveToFront();
    this.feedbackNode.visible = visible;
    if ( visible ) {
     this.feedbackNode.buttonToFocus && this.feedbackNode.buttonToFocus.visible && this.feedbackNode.buttonToFocus.focus();
    }
    else {
      PDOMUtils.focusTop();
    }
  }
}

balancingChemicalEquations.register( 'LevelNode', LevelNode );