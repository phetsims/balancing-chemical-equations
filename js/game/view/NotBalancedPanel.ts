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
import { BalancedRepresentation } from '../../common/model/BalancedRepresentation.js';
import Equation from '../../common/model/Equation.js';
import HBalanceScalesNode from '../../common/view/HBalanceScalesNode.js';
import BarChartNode from '../../common/view/BarChartNode.js';
import HorizontalAligner from '../../common/view/HorizontalAligner.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import { GameState } from '../model/GameState.js';
import GameFeedbackPanel from './GameFeedbackPanel.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import RectangularToggleButton from '../../../../sun/js/buttons/RectangularToggleButton.js';
import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';
import PhetColorScheme from '../../../../scenery-phet/js/PhetColorScheme.js';

export default class NotBalancedPanel extends GameFeedbackPanel {

  // 'Show Why' and 'Hide Why' buttons
  private static readonly WHY_BUTTON_FONT = new PhetFont( GameFeedbackPanel.PUSH_BUTTON_FONT.numericSize - 4 );
  private static readonly WHY_BUTTON_FILL = '#d9d9d9';

  private readonly balancedRepresentationVisibleProperty: Property<boolean>;
  private readonly balancedRepresentationNode: BalancedRepresentationNode;

  public constructor( equation: Equation,
                      balancedRepresentation: Exclude<BalancedRepresentation, 'none'>,
                      gameStateProperty: TReadOnlyProperty<GameState>,
                      tryAgainButtonCallback: () => void,
                      showAnswerButtonCallback: () => void,
                      aligner: HorizontalAligner,
                      tandem: Tandem ) {

    // maxWidth for UI elements
    const maxWidth = 0.5 * aligner.getScreenWidth();

    const textOptions = {
      font: GameFeedbackPanel.TEXT_FONT,
      maxWidth: maxWidth
    };

    // sad face
    const faceNode = new FaceNode( 75 );
    faceNode.frown();

    const redX = new Path( timesSolidShape, {
      scale: 0.08,
      fill: PhetColorScheme.RED_COLORBLIND
    } );

    const notBalancedText = new Text( BalancingChemicalEquationsStrings.notBalancedStringProperty, textOptions );

    const tryAgainButton = new TextPushButton( BalancingChemicalEquationsStrings.tryAgainStringProperty, {
      font: GameFeedbackPanel.PUSH_BUTTON_FONT,
      baseColor: GameFeedbackPanel.PUSH_BUTTON_COLOR,
      maxWidth: maxWidth,
      listener: tryAgainButtonCallback,
      visibleProperty: new DerivedProperty( [ gameStateProperty ], gameState => gameState === 'tryAgain' ),
      tandem: tandem.createTandem( 'tryAgainButton' )
    } );

    const showAnswerButton = new TextPushButton( BalancingChemicalEquationsStrings.showAnswerStringProperty, {
      font: GameFeedbackPanel.PUSH_BUTTON_FONT,
      baseColor: GameFeedbackPanel.PUSH_BUTTON_COLOR,
      maxWidth: maxWidth,
      listener: showAnswerButtonCallback,
      visibleProperty: new DerivedProperty( [ gameStateProperty ], gameState => gameState === 'showAnswer' ),
      tandem: tandem.createTandem( 'showAnswerButton' )
    } );

    const balancedRepresentationVisibleProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'balancedRepresentationVisibleProperty' ),
      phetioDocumentation: 'Visibility of the representation that shows why the equation is not balanced.',
      phetioReadOnly: true
    } );

    // 'Show Why' or 'Hide Why'
    const showHideWhyStringProperty = new DerivedStringProperty(
      [ balancedRepresentationVisibleProperty, BalancingChemicalEquationsStrings.showWhyStringProperty, BalancingChemicalEquationsStrings.hideWhyStringProperty ],
      ( whyVisible, showWhyString, hideWhyString ) => whyVisible ? hideWhyString : showWhyString );

    // Toggle button that shows/hides the 'balanced' representation, to explain why the equation is not balanced.
    const showHideWhyToggleButton = new RectangularToggleButton<boolean>( balancedRepresentationVisibleProperty, false, true, {
      content: new Text( showHideWhyStringProperty, {
        font: NotBalancedPanel.WHY_BUTTON_FONT
      } ),
      baseColor: NotBalancedPanel.WHY_BUTTON_FILL,
      maxWidth: maxWidth,
      tandem: tandem.createTandem( 'showHideWhyToggleButton' )
    } );

    const balancedRepresentationNode = new BalancedRepresentationNode( equation, balancedRepresentation, aligner,
      balancedRepresentationVisibleProperty );

    const content = new VBox( {
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

        showHideWhyToggleButton,
        balancedRepresentationNode
      ]
    } );

    super( content, {
      tandem: tandem,
      phetioDocumentation: 'Provides feedback when the challenge is not balanced.'
    } );

    this.balancedRepresentationVisibleProperty = balancedRepresentationVisibleProperty;
    this.balancedRepresentationNode = balancedRepresentationNode;
  }

  public updateBalancedRepresentation( equation: Equation, balancedRepresentation: Exclude<BalancedRepresentation, 'none'> ): void {
    this.balancedRepresentationVisibleProperty.reset();
    this.balancedRepresentationNode.update( equation, balancedRepresentation );
  }
}

/**
 * BalancedRepresentationNode shows why the equation is not balanced.
 */
class BalancedRepresentationNode extends Node {

  private readonly aligner: HorizontalAligner;

  public constructor( equation: Equation,
                      balancedRepresentation: Exclude<BalancedRepresentation, 'none'>,
                      aligner: HorizontalAligner,
                      visibleProperty: TReadOnlyProperty<boolean> ) {
    super( {
      isDisposable: false,
      visibleProperty: visibleProperty
    } );

    this.aligner = aligner;
    this.update( equation, balancedRepresentation );
  }

  public update( equation: Equation, balancedRepresentation: Exclude<BalancedRepresentation, 'none'> ): void {

    this.removeAllChildren();

    let balancedRepresentationNode;
    if ( balancedRepresentation === 'balanceScales' ) {
      balancedRepresentationNode = new HBalanceScalesNode( new Property( equation ), this.aligner );
    }
    else {
      balancedRepresentationNode = new BarChartNode( new Property( equation ), this.aligner );
    }

    // Shrink size so that it doesn't cover so much of the screen.
    // See https://github.com/phetsims/balancing-chemical-equations/issues/29.
    balancedRepresentationNode.setScaleMagnitude( 0.65 );

    this.addChild( balancedRepresentationNode );
  }
}

balancingChemicalEquations.register( 'NotBalancedPanel', NotBalancedPanel );