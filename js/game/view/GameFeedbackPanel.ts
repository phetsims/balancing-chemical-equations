// Copyright 2025, University of Colorado Boulder

/**
 * GameFeedbackPanel is the base class for panels that present feedback when the 'Check' button is pressed.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import TextPushButton from '../../../../sun/js/buttons/TextPushButton.js';
import BalancingChemicalEquationsStrings from '../../BalancingChemicalEquationsStrings.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import { GameState } from '../model/GameState.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import affirm from '../../../../perennial-alias/js/browser-and-node/affirm.js';

type SelfOptions = EmptySelfOptions;

type GameFeedbackPanelOptions = SelfOptions & PickRequired<PanelOptions, 'tandem' | 'phetioDocumentation'>;

export type TryAgainShowAnswerButtons = {
  tryAgainButton: TextPushButton;
  showAnswerButton: TextPushButton;
  visibleButtonProperty: TReadOnlyProperty<Node>;
};

export default class GameFeedbackPanel extends Panel {

  public static readonly CORNER_RADIUS = 0;
  protected static readonly MAX_TEXT_WIDTH = 385; // maxWidth for Text elements
  protected static readonly PUSH_BUTTON_FONT = new PhetFont( 20 );
  protected static readonly PUSH_BUTTON_COLOR = 'yellow';

  // Constants used exclusively by subclasses.
  protected static readonly TEXT_FONT = new PhetFont( 18 );
  protected static readonly ACTION_AREA_Y_SPACING = 8; // vertical space that separates the 'action area' (buttons) from stuff above it
  protected static readonly HBOX_SPACING = 5;
  protected static readonly VBOX_SPACING = 7;
  protected static readonly ICONS_SCALE = 0.05;

  protected constructor( content: Node, providedOptions: GameFeedbackPanelOptions ) {

    const options = optionize<GameFeedbackPanelOptions, SelfOptions, PanelOptions>()( {

      // PanelOptions
      isDisposable: false,
      fill: '#c1d8fe',
      xMargin: 40,
      yMargin: 10,
      cornerRadius: GameFeedbackPanel.CORNER_RADIUS,
      phetioVisiblePropertyInstrumented: false
    }, providedOptions );

    super( content, options );
  }

  /**
   * Creates the Try Again and Show Answer buttons, and a DerivedProperty that tracks which button is visible.
   */
  protected static createTryAgainShowAnswerButtons(
    gameStateProperty: TReadOnlyProperty<GameState>,
    tryAgainButtonCallback: () => void,
    showAnswerButtonCallback: () => void,
    tandem: Tandem
  ): TryAgainShowAnswerButtons {

    const tryAgainButton = new TextPushButton( BalancingChemicalEquationsStrings.tryAgainStringProperty, {
      font: GameFeedbackPanel.PUSH_BUTTON_FONT,
      baseColor: GameFeedbackPanel.PUSH_BUTTON_COLOR,
      maxTextWidth: GameFeedbackPanel.MAX_TEXT_WIDTH,
      listener: tryAgainButtonCallback,
      visibleProperty: new DerivedProperty( [ gameStateProperty ], gameState => gameState === 'tryAgain' ),
      tandem: tandem.createTandem( 'tryAgainButton' ),
      phetioEnabledPropertyInstrumented: false // See https://github.com/phetsims/balancing-chemical-equations/issues/197
    } );

    const showAnswerButton = new TextPushButton( BalancingChemicalEquationsStrings.showAnswerStringProperty, {
      font: GameFeedbackPanel.PUSH_BUTTON_FONT,
      baseColor: GameFeedbackPanel.PUSH_BUTTON_COLOR,
      maxTextWidth: GameFeedbackPanel.MAX_TEXT_WIDTH,
      listener: showAnswerButtonCallback,
      visibleProperty: new DerivedProperty( [ gameStateProperty ], gameState => gameState === 'showAnswer' ),
      tandem: tandem.createTandem( 'showAnswerButton' ),
      phetioEnabledPropertyInstrumented: false // See https://github.com/phetsims/balancing-chemical-equations/issues/197
    } );

    const visibleButtonProperty = new DerivedProperty( [ tryAgainButton.visibleProperty, showAnswerButton.visibleProperty ], ( tryAgainVisible, showAnswerVisible ) => {
      affirm( !( tryAgainVisible && showAnswerVisible ), 'tryAgainButton and showAnswerButton should not be visible at the same time' );

      // Track which button is visible so that we can focus it when the panel is shown.
      // If both buttons are invisible, then it doesn't matter which one we return, so we'll return the Show Answer button.
      return tryAgainVisible ? tryAgainButton : showAnswerButton;
    } );

    return {
      tryAgainButton: tryAgainButton,
      showAnswerButton: showAnswerButton,
      visibleButtonProperty: visibleButtonProperty
    };
  }
}

balancingChemicalEquations.register( 'GameFeedbackPanel', GameFeedbackPanel );