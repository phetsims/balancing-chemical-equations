// Copyright 2025, University of Colorado Boulder

/**
 * NotBalancedPanel presents feedback to the user when their answer to a challenge is not balanced.
 *
 * NOTE: While the UX here is similar to a Dialog, there are significant differences that make using Dialog impractical
 * and/or undesirable here. See https://github.com/phetsims/balancing-chemical-equations/issues/137 for details.
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
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VStrut from '../../../../scenery/js/nodes/VStrut.js';
import timesSolidShape from '../../../../sherpa/js/fontawesome-5/timesSolidShape.js';
import TextPushButton from '../../../../sun/js/buttons/TextPushButton.js';
import Panel from '../../../../sun/js/Panel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import BalancingChemicalEquationsStrings from '../../BalancingChemicalEquationsStrings.js';
import { BalancedRepresentation } from '../../common/model/BalancedRepresentation.js';
import Equation from '../../common/model/Equation.js';
import BalanceScalesNode from '../../common/view/BalanceScalesNode.js';
import BarChartsNode from '../../common/view/BarChartsNode.js';
import HorizontalAligner from '../../common/view/HorizontalAligner.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import { GameState } from '../model/GameState.js';

const TEXT_FONT = new PhetFont( 18 );
const PUSH_BUTTON_FONT = new PhetFont( 20 );
const PUSH_BUTTON_FILL = 'yellow';
const SHOW_WHY_BUTTON_FONT = new PhetFont( 16 );
const SHOW_WHY_BUTTON_FILL = '#d9d9d9';
const ACTION_AREA_Y_SPACING = 8; // vertical space that separates the 'action area' (buttons) from stuff above it
const HBOX_SPACING = 5;
const VBOX_SPACING = 7;
const SHADOW_X_OFFSET = 5;
const SHADOW_Y_OFFSET = 5;
const CORNER_RADIUS = 0;

export default class NotBalancedPanel extends Node {

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
      font: TEXT_FONT,
      maxWidth: maxWidth
    };

    // sad face
    const faceNode = new FaceNode( 75 );
    faceNode.frown();

    const redX = new Path( timesSolidShape, {
      scale: 0.08,
      fill: 'rgb( 252, 104, 0 )'
    } );

    const notBalancedText = new Text( BalancingChemicalEquationsStrings.notBalancedStringProperty, textOptions );

    const tryAgainButton = new TextPushButton( BalancingChemicalEquationsStrings.tryAgainStringProperty, {
      font: PUSH_BUTTON_FONT,
      baseColor: PUSH_BUTTON_FILL,
      maxWidth: maxWidth,
      listener: tryAgainButtonCallback,
      visibleProperty: new DerivedProperty( [ gameStateProperty ], gameState => gameState === 'tryAgain' ),
      tandem: tandem.createTandem( 'tryAgainButton' )
    } );

    const showAnswerButton = new TextPushButton( BalancingChemicalEquationsStrings.showAnswerStringProperty, {
      font: PUSH_BUTTON_FONT,
      baseColor: PUSH_BUTTON_FILL,
      maxWidth: maxWidth,
      listener: showAnswerButtonCallback,
      visibleProperty: new DerivedProperty( [ gameStateProperty ], gameState => gameState === 'showAnswer' ),
      tandem: tandem.createTandem( 'showAnswerButton' )
    } );

    const balancedRepresentationNode = new BalancedRepresentationNode( equation, balancedRepresentation, aligner );

    // 'Show Why' button, exposes one of the 'balanced' representations to explain why it's not balanced
    const showWhyButton = new TextPushButton( BalancingChemicalEquationsStrings.showWhyStringProperty, {
      listener: () => {
        showWhyButton.visible = false;
        hideWhyButton.visible = true;
        balancedRepresentationNode.visible = true;
      },
      font: SHOW_WHY_BUTTON_FONT,
      baseColor: SHOW_WHY_BUTTON_FILL,
      maxWidth: maxWidth,
      tandem: tandem.createTandem( 'showWhyButton' ),
      phetioVisiblePropertyInstrumented: false
    } );

    // 'Hide Why' button, hides the 'balanced' representation
    const hideWhyButton = new TextPushButton( BalancingChemicalEquationsStrings.hideWhyStringProperty, {
      listener: () => {
        showWhyButton.visible = true;
        hideWhyButton.visible = false;
        balancedRepresentationNode.visible = false;
      },
      font: SHOW_WHY_BUTTON_FONT,
      baseColor: SHOW_WHY_BUTTON_FILL,
      maxWidth: maxWidth,
      tandem: tandem.createTandem( 'hideWhyButton' ),
      phetioVisiblePropertyInstrumented: false
    } );

    const content = new VBox( {
      align: 'center',
      spacing: VBOX_SPACING,
      children: [

        // sad face
        faceNode,

        // red X + 'not balanced'
        new HBox( {
          children: [ redX, notBalancedText ],
          spacing: HBOX_SPACING
        } ),

        // space
        new VStrut( ACTION_AREA_Y_SPACING ),

        // Try Again / Show Answer buttons, one of which will be visible at a time.
        // Wrap these in an HBox (not a Node!) so that dynamic layout will work properly.
        new HBox( {
          children: [ tryAgainButton, showAnswerButton ]
        } ),

        // Show/Hide Why buttons, one of which will be visible at a time.
        // Wrap these in an HBox (not a Node!) so that dynamic layout will work properly.
        // See https://github.com/phetsims/balancing-chemical-equations/issues/164
        new HBox( {
          children: [ showWhyButton, hideWhyButton ]
        } ),

        balancedRepresentationNode
      ]
    } );

    // panel, which will resize dynamically
    const panel = new Panel( content, {
      fill: '#c1d8fe',
      xMargin: 40,
      yMargin: 10,
      cornerRadius: CORNER_RADIUS
    } );

    // shadow
    const shadowNode = new Rectangle( 0, 0, 1, 1, {
      fill: 'rgba( 80, 80, 80, 0.12 )',
      cornerRadius: CORNER_RADIUS
    } );
    const updateShadow = () => {
      shadowNode.setRect( panel.left + SHADOW_X_OFFSET, panel.top + SHADOW_Y_OFFSET, panel.width, panel.height );
    };
    content.boundsProperty.lazyLink( updateShadow ); // resize shadow when panel changes size
    updateShadow();

    super( {
      isDisposable: false,
      children: [ shadowNode, panel ],
      tandem: tandem,
      phetioVisiblePropertyInstrumented: false
    } );

    this.balancedRepresentationNode = balancedRepresentationNode;

    // When this panel becomes visible, reset initial visibility.
    this.visibleProperty.link( visible => {
      if ( visible ) {
        showWhyButton.visible = true;
        hideWhyButton.visible = false;
        balancedRepresentationNode.visible = false;
      }
    } );
  }

  public updateBalancedRepresentation( equation: Equation, balancedRepresentation: Exclude<BalancedRepresentation, 'none'> ): void {
    this.balancedRepresentationNode.update( equation, balancedRepresentation );
  }
}

class BalancedRepresentationNode extends Node {

  private readonly aligner: HorizontalAligner;

  public constructor( equation: Equation,
                      balancedRepresentation: Exclude<BalancedRepresentation, 'none'>,
                      aligner: HorizontalAligner ) {
    super( {
      isDisposable: false
    } );

    this.aligner = aligner;
    this.update( equation, balancedRepresentation );
  }

  public update( equation: Equation, balancedRepresentation: Exclude<BalancedRepresentation, 'none'> ): void {

    this.removeAllChildren();

    let balancedRepresentationNode;
    if ( balancedRepresentation === 'balanceScales' ) {
      balancedRepresentationNode = new BalanceScalesNode( new Property( equation ), this.aligner );
    }
    else {
      balancedRepresentationNode = new BarChartsNode( new Property( equation ), this.aligner );
    }

    // Shrink size so that it doesn't cover so much of the screen.
    // See https://github.com/phetsims/balancing-chemical-equations/issues/29.
    balancedRepresentationNode.setScaleMagnitude( 0.65 );

    this.addChild( balancedRepresentationNode );
  }
}

balancingChemicalEquations.register( 'NotBalancedPanel', NotBalancedPanel );