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

type SelfOptions = EmptySelfOptions;

type GameFeedbackPanelOptions = SelfOptions & PickRequired<PanelOptions, 'tandem' | 'phetioDocumentation'>;

export default class GameFeedbackPanel extends Panel {

  public static readonly CORNER_RADIUS = 0;

  // Constants used exclusively by subclasses.
  protected static readonly TEXT_FONT = new PhetFont( 18 );
  protected static readonly PUSH_BUTTON_FONT = new PhetFont( 20 );
  protected static readonly PUSH_BUTTON_COLOR = 'yellow';
  protected static readonly ACTION_AREA_Y_SPACING = 8; // vertical space that separates the 'action area' (buttons) from stuff above it
  protected static readonly HBOX_SPACING = 5;
  protected static readonly VBOX_SPACING = 7;

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
}

balancingChemicalEquations.register( 'GameFeedbackPanel', GameFeedbackPanel );