// Copyright 2014-2025, University of Colorado Boulder

/**
 * IntroScreenView is the top-level view for the 'Intro' screen.
 *
 * @author Vasily Shakhov (MLearner)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Dimension2 from '../../../../dot/js/Dimension2.js';
import ScreenView from '../../../../joist/js/ScreenView.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import BalancingChemicalEquationsStrings from '../../BalancingChemicalEquationsStrings.js';
import BCEColors from '../../common/BCEColors.js';
import BCEConstants from '../../common/BCEConstants.js';
import ParticlesNode from '../../common/view/ParticlesNode.js';
import EquationNode from '../../common/view/EquationNode.js';
import HorizontalAligner from '../../common/view/HorizontalAligner.js';
import IntroModel from '../model/IntroModel.js';
import EquationRadioButtonGroup from './EquationRadioButtonGroup.js';
import HorizontalBarNode from '../../common/view/HorizontalBarNode.js';
import IntroViewProperties from './IntroViewProperties.js';
import ViewComboBox from '../../common/view/ViewComboBox.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import VBalanceScalesNode from '../../common/view/VBalanceScalesNode.js';
import VBarChartsNode from '../../common/view/VBarChartsNode.js';
import IntroFeedbackNode from './IntroFeedbackNode.js';

const BOX_SIZE = new Dimension2( 285, 145 );
const BOX_X_SPACING = 110; // horizontal spacing between boxes

export default class IntroScreenView extends ScreenView {

  public constructor( model: IntroModel, tandem: Tandem ) {

    super( {
      isDisposable: false,
      layoutBounds: BCEConstants.LAYOUT_BOUNDS,
      tandem: tandem
    } );

    // view-specific Properties
    const viewProperties = new IntroViewProperties( tandem.createTandem( 'viewProperties' ) );

    // aligner for equation
    const aligner = new HorizontalAligner( this.layoutBounds.width, BOX_SIZE.width, BOX_X_SPACING );

    // Accordion boxes that show particles corresponding to the equation coefficients
    const particlesNode = new ParticlesNode( model.equationProperty, model.coefficientsRange, aligner, BOX_SIZE,
      BCEColors.BOX_COLOR, viewProperties.reactantsAccordionBoxExpandedProperty, viewProperties.productsAccordionBoxExpandedProperty, {
        visibleProperty: new DerivedProperty( [ viewProperties.balancedRepresentationProperty ],
          balancedRepresentation => balancedRepresentation === 'particles' ),
        top: 180,
        parentTandem: tandem
      } );

    const balanceScalesNode = new VBalanceScalesNode( model.equationProperty, {
      visibleProperty: new DerivedProperty( [ viewProperties.balancedRepresentationProperty ],
        balancedRepresentation => balancedRepresentation === 'balanceScales' )
    } );
    balanceScalesNode.setScaleMagnitude( 0.85 );
    balanceScalesNode.boundsProperty.link( () => {
      balanceScalesNode.centerX = particlesNode.centerX;
      balanceScalesNode.bottom = particlesNode.bottom;
    } );

    const barChartsNode = new VBarChartsNode( model.equationProperty, {
      visibleProperty: new DerivedProperty( [ viewProperties.balancedRepresentationProperty ],
        balancedRepresentation => balancedRepresentation === 'barCharts' )
    } );
    barChartsNode.boundsProperty.link( () => {
      barChartsNode.centerX = particlesNode.centerX;
      barChartsNode.bottom = particlesNode.bottom;
    } );

    // 'View' combo box, at top-right.
    const listboxParent = new Node();
    const viewComboBox = new ViewComboBox( viewProperties.balancedRepresentationProperty, listboxParent,
      tandem.createTandem( 'viewComboBox' ) );
    const viewControl = new HBox( {
      spacing: 10,
      children: [
        new Text( BalancingChemicalEquationsStrings.viewStringProperty, {
          font: new PhetFont( 22 ),
          fontWeight: 'bold',
          maxWidth: 100,
          visibleProperty: viewComboBox.visibleProperty
        } ),
        viewComboBox
      ]
    } );

    viewControl.boundsProperty.link( () => {
      viewControl.right = this.layoutBounds.right - 45;
      viewControl.top = this.layoutBounds.top + 15;
    } );

    // Feedback at top left: smiley face with balanced indicator.
    const feedbackNode = new IntroFeedbackNode( model.equationProperty );
    feedbackNode.left = particlesNode.left;
    feedbackNode.top = this.layoutBounds.top + 10;

    // interactive equations
    const equationNodesTandem = tandem.createTandem( 'equationNodes' );
    const equationNodes = new Node( {
      children: model.choices.map( choice => new EquationNode( choice.equation, aligner, {
        visibleProperty: new DerivedProperty( [ model.equationProperty ], equation => equation === choice.equation ),
        tandem: equationNodesTandem.createTandem( `${choice.tandemNamePrefix}Node` )
      } ) ),
      top: particlesNode.bottom + 20,
      tandem: equationNodesTandem
    } );

    // Radio button group for choosing an equation
    const equationRadioButtonGroup = new EquationRadioButtonGroup( model.equationProperty, model.choices,
      tandem.createTandem( 'equationRadioButtonGroup' ) );

    // Bar behind radio buttons at bottom of screen
    const horizontalBarNode = new HorizontalBarNode( this.visibleBoundsProperty, {
      visibleProperty: equationRadioButtonGroup.visibleProperty,
      bottom: this.layoutBounds.bottom - 10
    } );

    equationRadioButtonGroup.localBoundsProperty.link( () => {
      equationRadioButtonGroup.left = 50;
      equationRadioButtonGroup.centerY = horizontalBarNode.centerY;
    } );

    // Reset All button
    const resetAllButton = new ResetAllButton( {
      listener: () => {
        model.reset();
        viewProperties.reset();
      },
      right: this.layoutBounds.right - 20,
      centerY: horizontalBarNode.centerY,
      scale: 0.8,
      tandem: tandem.createTandem( 'resetAllButton' )
    } );

    const screenViewRootNode = new Node( {
      children: [
        particlesNode,
        balanceScalesNode,
        barChartsNode,
        viewControl,
        feedbackNode,
        equationNodes,
        horizontalBarNode,
        equationRadioButtonGroup,
        resetAllButton,
        listboxParent // add this last, so that combo box list is on top of everything else
      ]
    } );
    this.addChild( screenViewRootNode );

    // Show the answer at bottom center.
    if ( phet.chipper.queryParameters.showAnswers ) {
      const answerNode = new Text( '', {
        fill: 'red',
        font: new PhetFont( 20 ),
        bottom: horizontalBarNode.top - 5
      } );
      screenViewRootNode.addChild( answerNode );
      model.equationProperty.link( equation => {
        answerNode.string = equation.getAnswerString();
        answerNode.centerX = this.layoutBounds.centerX;
      } );
    }

    // Play Area focus order
    this.pdomPlayAreaNode.pdomOrder = [
      equationRadioButtonGroup,
      equationNodes
    ];

    // Control Area focus order
    this.pdomControlAreaNode.pdomOrder = [
      particlesNode,
      viewControl,
      resetAllButton
    ];
  }
}

balancingChemicalEquations.register( 'IntroScreenView', IntroScreenView );