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
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';

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

    this.balancedAndSimplifiedPanel = new BalancedAndSimplifiedPanel(
      this.model.pointsProperty,
      () => this.model.next(),
      tandem.createTandem( 'balancedAndSimplifiedPanel' ) );

    this.balancedNotSimplifiedPanel = new BalancedNotSimplifiedPanel(
      this.model.gameStateProperty,
      () => this.model.tryAgain(),
      () => this.model.showAnswer(),
      tandem.createTandem( 'balancedNotSimplifiedPanel' ) );

    this.notBalancedPanel = new NotBalancedPanel(
      this.model.challengeProperty.value,
      this.model.gameStateProperty,
      () => this.model.tryAgain(),
      () => this.model.showAnswer(),
      tandem.createTandem( 'notBalancedPanel' ) );

    const panelsParent = new HBox( {
      children: [
        this.balancedAndSimplifiedPanel,
        this.balancedNotSimplifiedPanel,
        this.notBalancedPanel
      ]
    } );

    this.addChild( panelsParent );
  }

  /**
   * Updates the feedback to match the state of the current challenge that is being played.
   */
  public update(): void {

    const challenge = this.model.challengeProperty.value;

    // Make the panel visible that corresponds to the state of the current challenge. Be sure to make a panel visible
    // before hiding the others, so that we do not trigger an assertion failure by having all children of panelsParent
    // invisible at the same time.
    if ( challenge.isSimplifiedProperty.value ) {
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
      this.notBalancedPanel.updateViewMode( this.model.challengeProperty.value, level.getViewMode() );
      this.notBalancedPanel.visible = true;
      this.balancedAndSimplifiedPanel.visible = false;
      this.balancedNotSimplifiedPanel.visible = false;
    }
  }
}

balancingChemicalEquations.register( 'GameFeedbackNode', GameFeedbackNode );