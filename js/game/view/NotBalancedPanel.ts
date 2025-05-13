// Copyright 2025, University of Colorado Boulder

/**
 * NotBalancedPanel presents feedback when the answer to a challenge is not balanced.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import FaceNode from '../../../../scenery-phet/js/FaceNode.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VStrut from '../../../../scenery/js/nodes/VStrut.js';
import timesSolidShape from '../../../../sherpa/js/fontawesome-5/timesSolidShape.js';
import TextPushButton from '../../../../sun/js/buttons/TextPushButton.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import BalancingChemicalEquationsStrings from '../../BalancingChemicalEquationsStrings.js';
import { ShowWhyViewMode } from '../../common/model/ViewMode.js';
import Equation from '../../common/model/Equation.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import { GameState } from '../model/GameState.js';
import GameFeedbackPanel from './GameFeedbackPanel.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import RectangularToggleButton from '../../../../sun/js/buttons/RectangularToggleButton.js';
import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';
import PhetColorScheme from '../../../../scenery-phet/js/PhetColorScheme.js';
import BalanceScalesNode from '../../common/view/BalanceScalesNode.js';
import BarChartsNode from '../../common/view/BarChartsNode.js';
import isSettingPhetioStateProperty from '../../../../tandem/js/isSettingPhetioStateProperty.js';
import BCEConstants from '../../common/BCEConstants.js';

const MAX_TEXT_WIDTH = 385; // maxWidth for Text elements

export default class NotBalancedPanel extends GameFeedbackPanel {

  // 'Show Why' and 'Hide Why' buttons
  private static readonly WHY_BUTTON_FONT = new PhetFont( GameFeedbackPanel.PUSH_BUTTON_FONT.numericSize - 4 );
  private static readonly WHY_BUTTON_FILL = '#d9d9d9';

  private readonly showWhyVisibleProperty: Property<boolean>;
  private readonly showWhyNode: ShowWhyNode;

  public constructor( equation: Equation,
                      gameStateProperty: TReadOnlyProperty<GameState>,
                      tryAgainButtonCallback: () => void,
                      showAnswerButtonCallback: () => void,
                      tandem: Tandem ) {

    const textOptions = {
      font: GameFeedbackPanel.TEXT_FONT,
      maxWidth: MAX_TEXT_WIDTH
    };

    // sad face
    const faceNode = new FaceNode( 75, BCEConstants.FACE_NODE_OPTIONS );
    faceNode.frown();

    const redX = new Path( timesSolidShape, {
      scale: GameFeedbackPanel.ICONS_SCALE,
      fill: PhetColorScheme.RED_COLORBLIND
    } );

    const notBalancedText = new Text( BalancingChemicalEquationsStrings.notBalancedStringProperty, textOptions );

    const tryAgainButton = new TextPushButton( BalancingChemicalEquationsStrings.tryAgainStringProperty, {
      font: GameFeedbackPanel.PUSH_BUTTON_FONT,
      baseColor: GameFeedbackPanel.PUSH_BUTTON_COLOR,
      maxTextWidth: MAX_TEXT_WIDTH,
      listener: tryAgainButtonCallback,
      visibleProperty: new DerivedProperty( [ gameStateProperty ], gameState => gameState === 'tryAgain' ),
      tandem: tandem.createTandem( 'tryAgainButton' ),
      phetioEnabledPropertyInstrumented: false // See https://github.com/phetsims/balancing-chemical-equations/issues/197
    } );

    const showAnswerButton = new TextPushButton( BalancingChemicalEquationsStrings.showAnswerStringProperty, {
      font: GameFeedbackPanel.PUSH_BUTTON_FONT,
      baseColor: GameFeedbackPanel.PUSH_BUTTON_COLOR,
      maxTextWidth: MAX_TEXT_WIDTH,
      listener: showAnswerButtonCallback,
      visibleProperty: new DerivedProperty( [ gameStateProperty ], gameState => gameState === 'showAnswer' ),
      tandem: tandem.createTandem( 'showAnswerButton' ),
      phetioEnabledPropertyInstrumented: false // See https://github.com/phetsims/balancing-chemical-equations/issues/197
    } );

    const showWhyVisibleProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'showWhyVisibleProperty' ),
      phetioDocumentation: 'Visibility of the view that shows why the equation is not balanced.',
      phetioReadOnly: true
    } );

    // 'Show Why' or 'Hide Why'
    const showHideWhyStringProperty = new DerivedStringProperty(
      [ showWhyVisibleProperty, BalancingChemicalEquationsStrings.showWhyStringProperty, BalancingChemicalEquationsStrings.hideWhyStringProperty ],
      ( whyVisible, showWhyString, hideWhyString ) => whyVisible ? hideWhyString : showWhyString );

    // Toggle button that shows/hides the 'balanced' representation, to explain why the equation is not balanced.
    const showHideWhyToggleButton = new RectangularToggleButton<boolean>( showWhyVisibleProperty, false, true, {
      content: new Text( showHideWhyStringProperty, {
        font: NotBalancedPanel.WHY_BUTTON_FONT,
        maxWidth: MAX_TEXT_WIDTH
      } ),
      baseColor: NotBalancedPanel.WHY_BUTTON_FILL,
      tandem: tandem.createTandem( 'showHideWhyToggleButton' )
    } );

    const showWhyNode = new ShowWhyNode( equation, showWhyVisibleProperty );

    const vBox = new VBox( {
      excludeInvisibleChildrenFromBounds: true,
      align: 'center',
      spacing: GameFeedbackPanel.VBOX_SPACING,
      children: [

        // sad face
        faceNode,

        // red X + 'not balanced'
        new HBox( {
          children: [ redX, notBalancedText ],
          spacing: GameFeedbackPanel.HBOX_SPACING
        } ),

        // space
        new VStrut( GameFeedbackPanel.ACTION_AREA_Y_SPACING ),

        // Try Again / Show Answer buttons, one of which will be visible at a time.
        // Wrap these in an HBox (not a Node!) so that dynamic layout will work properly.
        new HBox( {
          children: [ tryAgainButton, showAnswerButton ]
        } ),

        showHideWhyToggleButton
      ]
    } );

    const content = new HBox( {
      children: [ vBox, showWhyNode ],
      spacing: 50
    } );

    super( content, {
      tandem: tandem,
      phetioDocumentation: 'Provides feedback when the challenge is not balanced.'
    } );

    this.showWhyVisibleProperty = showWhyVisibleProperty;
    this.showWhyNode = showWhyNode;
  }

  public updateViewMode( equation: Equation, viewMode: ShowWhyViewMode ): void {
    if ( !isSettingPhetioStateProperty.value ) {
      this.showWhyVisibleProperty.reset();
    }
    this.showWhyNode.update( equation, viewMode );
  }
}

/**
 * ShowWhyNode shows why the equation is not balanced.
 */
class ShowWhyNode extends Node {

  private balanceNode: BalanceScalesNode | BarChartsNode | null;

  public constructor( equation: Equation,
                      visibleProperty: TReadOnlyProperty<boolean> ) {
    super( {
      isDisposable: false,
      visibleProperty: visibleProperty
    } );

    this.balanceNode = null;

    this.update( equation, 'balanceScales' ); // any ShowWhyViewMode value will do for instantiation
  }

  public update( equation: Equation, viewMode: ShowWhyViewMode ): void {

    this.balanceNode && this.balanceNode.dispose();

    if ( viewMode === 'balanceScales' ) {
      this.balanceNode = new BalanceScalesNode( new Property( equation ) );
    }
    else {
      this.balanceNode = new BarChartsNode( new Property( equation ) );
    }

    // Shrink size so that it doesn't cover so much of the screen.
    // See https://github.com/phetsims/balancing-chemical-equations/issues/29.
    this.balanceNode.setScaleMagnitude( 0.65 );

    this.addChild( this.balanceNode );
  }
}

balancingChemicalEquations.register( 'NotBalancedPanel', NotBalancedPanel );