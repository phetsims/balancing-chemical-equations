// Copyright 2014-2025, University of Colorado Boulder

/**
 * GameFeedbackNode presents feedback about a user's guess. The format of the feedback is specific to whether
 * the equation is balanced and simplified, balanced but not simplified, or unbalanced.
 *
 * NOTE: While the UX here is similar to a Dialog, there are significant differences that make using Dialog impractical
 * and/or undesirable here. See https://github.com/phetsims/balancing-chemical-equations/issues/137 for details.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Node from '../../../../scenery/js/nodes/Node.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import HorizontalAligner from '../../common/view/HorizontalAligner.js';
import GameModel from '../model/GameModel.js';
import BalancedAndSimplifiedPanel from './BalancedAndSimplifiedPanel.js';
import BalancedNotSimplifiedPanel from './BalancedNotSimplifiedPanel.js';
import NotBalancedPanel from './NotBalancedPanel.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import GameFeedbackPanel from './GameFeedbackPanel.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';

const SHADOW_X_OFFSET = 5;
const SHADOW_Y_OFFSET = 5;

export default class GameFeedbackNode extends Node {

  private readonly model: GameModel;
  private readonly aligner: HorizontalAligner;

  // A panel for each type of feedback.
  private readonly balancedAndSimplifiedPanel: BalancedAndSimplifiedPanel;
  private readonly balancedNotSimplifiedPanel: BalancedNotSimplifiedPanel;
  private readonly notBalancedPanel: NotBalancedPanel;

  public constructor( model: GameModel, aligner: HorizontalAligner, tandem: Tandem ) {

    super( {
      isDisposable: false,
      visible: false,
      tandem: tandem,
      phetioDocumentation: 'Provides feedback when the Check button is pressed.',
      phetioVisiblePropertyInstrumented: false
    } );

    this.model = model;
    this.aligner = aligner;

    this.balancedAndSimplifiedPanel = new BalancedAndSimplifiedPanel( this.model.pointsProperty, () => this.model.next(),
      tandem.createTandem( 'balancedAndSimplifiedPanel' ) );

    this.balancedNotSimplifiedPanel = new BalancedNotSimplifiedPanel( this.model.gameStateProperty, () => this.model.tryAgain(),
      () => this.model.showAnswer(), this.aligner, tandem.createTandem( 'balancedNotSimplifiedPanel' ) );

    this.notBalancedPanel = new NotBalancedPanel(
      this.model.challengeProperty.value,
      'barCharts', // any value will do for instantiation
      this.model.gameStateProperty,
      () => this.model.tryAgain(),
      () => this.model.showAnswer(),
      this.aligner,
      tandem.createTandem( 'notBalancedPanel' ) );

    // Because notBalancedPanel has dynamic layout, use HBox instead of Node so that resizing of dropShadowNode works correctly.
    const panelsParent = new HBox( {
      children: [
        this.balancedAndSimplifiedPanel,
        this.balancedNotSimplifiedPanel,
        this.notBalancedPanel
      ]
    } );

    // A shadow behind the panel, as in the Java version.
    const dropShadowNode = new Rectangle( 0, 0, 1, 1, {
      fill: 'rgba( 80, 80, 80, 0.12 )',
      cornerRadius: GameFeedbackPanel.CORNER_RADIUS
    } );

    this.addChild( dropShadowNode );
    this.addChild( panelsParent );

    // Resize dropShadowNode when the panel size changes.
    panelsParent.localBoundsProperty.link( () =>
      dropShadowNode.setRect( panelsParent.left + SHADOW_X_OFFSET, panelsParent.top + SHADOW_Y_OFFSET, panelsParent.width, panelsParent.height ) );
  }

  /**
   * Updates the feedback to match the state of the current challenge that is being played.
   */
  public update(): void {

    const challenge = this.model.challengeProperty.value;

    // Make the panel visible that corresponds to the state of the current challenge. Be sure to make a panel visible
    // before hiding the others, so that we do not trigger an assertion failure by having all children of panelsParent
    // invisible at the same time.
    if ( challenge.isBalancedAndSimplified ) {
      this.balancedAndSimplifiedPanel.visible = true;
      this.balancedNotSimplifiedPanel.visible = false;
      this.notBalancedPanel.visible = false;
    }
    else if ( challenge.isBalancedProperty.value ) {
      this.balancedNotSimplifiedPanel.visible = true;
      this.balancedAndSimplifiedPanel.visible = false;
      this.notBalancedPanel.visible = false;
    }
    else {
      const level = this.model.levelProperty.value!;
      assert && assert( level );
      this.notBalancedPanel.updateBalancedRepresentation( this.model.challengeProperty.value, level.getBalancedRepresentation() );
      this.notBalancedPanel.visible = true;
      this.balancedAndSimplifiedPanel.visible = false;
      this.balancedNotSimplifiedPanel.visible = false;
    }
  }
}

balancingChemicalEquations.register( 'GameFeedbackNode', GameFeedbackNode );