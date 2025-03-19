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
      phetioDocumentation: 'Provides feedback when the Check button is pressed.'
    } );

    this.model = model;
    this.aligner = aligner;

    this.balancedAndSimplifiedPanel = new BalancedAndSimplifiedPanel( this.model.pointsProperty, () => this.model.next(),
      tandem.createTandem( 'balancedAndSimplifiedPanel' ) );
    this.addChild( this.balancedAndSimplifiedPanel );

    this.balancedNotSimplifiedPanel = new BalancedNotSimplifiedPanel( this.model.stateProperty, () => this.model.tryAgain(),
      () => this.model.showAnswer(), this.aligner, tandem.createTandem( 'balancedNotSimplifiedPanel' ) );
    this.addChild( this.balancedNotSimplifiedPanel );

    this.notBalancedPanel = new NotBalancedPanel(
      this.model.challengeProperty.value,
      'barCharts', // any value will do for instantiation
      this.model.stateProperty,
      () => this.model.tryAgain(),
      () => this.model.showAnswer(),
      this.aligner,
      tandem.createTandem( 'notBalancedPanel' ) );
    this.addChild( this.notBalancedPanel );
  }

  public update(): void {

    // Start with all panels invisible.
    this.balancedAndSimplifiedPanel.visible = false;
    this.balancedNotSimplifiedPanel.visible = false;
    this.notBalancedPanel.visible = false;

    // Make the panel visible that corresponds to the state of the current challenge.
    const challenge = this.model.challengeProperty.value;
    if ( challenge.isBalancedAndSimplified ) {
      this.balancedAndSimplifiedPanel.visible = true;
    }
    else if ( challenge.isBalancedProperty.value ) {
      this.balancedNotSimplifiedPanel.visible = true;
    }
    else {
      const level = this.model.levelProperty.value!;
      assert && assert( level );
      this.notBalancedPanel.updateBalancedRepresentation( this.model.challengeProperty.value, level.getBalancedRepresentation() );
      this.notBalancedPanel.visible = true;
    }
  }
}

balancingChemicalEquations.register( 'GameFeedbackNode', GameFeedbackNode );