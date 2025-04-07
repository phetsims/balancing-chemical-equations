// Copyright 2025, University of Colorado Boulder

/**
 * EquationsScreenView is the top-level view for the 'Equations' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ScreenView from '../../../../joist/js/ScreenView.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import BalancingChemicalEquationsStrings from '../../BalancingChemicalEquationsStrings.js';
import BCEConstants from '../../common/BCEConstants.js';
import EquationsModel from '../model/EquationsModel.js';
import EquationsViewProperties from './EquationsViewProperties.js';
import EquationTypeRadioButtonGroup from './EquationTypeRadioButtonGroup.js';
import HorizontalBarNode from '../../common/view/HorizontalBarNode.js';
import EquationsComboBox from './EquationsComboBox.js';
import Multilink from '../../../../axon/js/Multilink.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import AlignGroup from '../../../../scenery/js/layout/constraints/AlignGroup.js';
import EquationNode from '../../common/view/EquationNode.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import HorizontalAligner from '../../common/view/HorizontalAligner.js';
import ParticlesNode from '../../common/view/ParticlesNode.js';
import BCEColors from '../../common/BCEColors.js';
import EquationsFeedbackNode from './EquationsFeedbackNode.js';
import BalanceScalesNode from '../../common/view/BalanceScalesNode.js';
import BarChartsNode from '../../common/view/BarChartsNode.js';
import ViewComboBox from '../../common/view/ViewComboBox.js';

const BOX_SIZE = new Dimension2( 285, 260 );
const BOX_X_SPACING = 110; // horizontal spacing between boxes

export default class EquationsScreenView extends ScreenView {

  public constructor( model: EquationsModel, tandem: Tandem ) {

    super( {
      isDisposable: false,
      layoutBounds: BCEConstants.LAYOUT_BOUNDS,
      tandem: tandem
    } );

    // view-specific Properties
    const viewProperties = new EquationsViewProperties( tandem.createTandem( 'viewProperties' ) );

    // aligner for equation
    const aligner = new HorizontalAligner( this.layoutBounds.width, BOX_SIZE.width, BOX_X_SPACING );

    // Radio button group for choosing an equation type
    const equationTypeRadioButtonGroup = new EquationTypeRadioButtonGroup( model.equationTypeProperty,
      tandem.createTandem( 'equationTypeRadioButtonGroup' ) );

    // Bar behind radio buttons at bottom of screen
    const horizontalBarNode = new HorizontalBarNode( this.visibleBoundsProperty, {
      visibleProperty: equationTypeRadioButtonGroup.visibleProperty,
      bottom: this.layoutBounds.bottom - 10
    } );

    equationTypeRadioButtonGroup.localBoundsProperty.link( () => {
      equationTypeRadioButtonGroup.left = 20;
      equationTypeRadioButtonGroup.centerY = horizontalBarNode.centerY;
    } );

    let equationNode = new EquationNode( model.equationProperty.value, aligner, {
      tandem: Tandem.OPT_OUT // ... because equationNode is created dynamically for this screen.
    } );
    const equationNodeParent = new Node( {
      children: [ equationNode ],
      bottom: horizontalBarNode.top - 20
    } );

    model.equationProperty.lazyLink( equation => {

      // Dispose of the previous equationNode.
      equationNode.dispose();

      // Create a new equationNode for the current equation.
      equationNode = new EquationNode( equation, aligner, {
        tandem: Tandem.OPT_OUT // ... because equationNode is created dynamically.
      } );
      equationNodeParent.children = [ equationNode ];
    } );

    const particlesNode = new ParticlesNode( model.equationProperty, model.coefficientsRange, aligner, BOX_SIZE,
      BCEColors.BOX_COLOR, viewProperties.reactantsAccordionBoxExpandedProperty, viewProperties.productsAccordionBoxExpandedProperty, {
        visibleProperty: new DerivedProperty( [ viewProperties.balancedRepresentationProperty ],
          balancedRepresentation => balancedRepresentation === 'particles' ),
        bottom: equationNodeParent.top - 20,
        parentTandem: tandem
      } );

    const balanceScalesNode = new BalanceScalesNode( model.equationProperty, {
      visibleProperty: new DerivedProperty( [ viewProperties.balancedRepresentationProperty ],
        balancedRepresentation => balancedRepresentation === 'balanceScales' )
    } );
    balanceScalesNode.boundsProperty.link( () => {
      balanceScalesNode.centerX = particlesNode.centerX;
      balanceScalesNode.bottom = particlesNode.bottom;
    } );

    const barChartsNode = new BarChartsNode( model.equationProperty, {
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

    // Feedback at top left: smiley face with balanced and simplified indicators.
    const feedbackNode = new EquationsFeedbackNode( model.equationProperty );
    feedbackNode.left = particlesNode.left;
    feedbackNode.top = this.layoutBounds.top + 10;

    // So that all equations have the same effective size.
    const itemAlignGroup = new AlignGroup();

    // ComboBoxes for selecting specific equations
    const equationComboBoxesTandem = tandem.createTandem( 'equationsComboBoxes' );
    const equationComboBoxes = new Node( {
      children: [
        new EquationsComboBox( model.synthesisEquationProperty, listboxParent, itemAlignGroup, {
          visibleProperty: new DerivedProperty( [ model.equationTypeProperty ], equationType => equationType === 'synthesis' ),
          tandem: equationComboBoxesTandem.createTandem( 'synthesisEquationComboBox' )
        } ),
        new EquationsComboBox( model.decompositionEquationProperty, listboxParent, itemAlignGroup, {
          visibleProperty: new DerivedProperty( [ model.equationTypeProperty ], equationType => equationType === 'decomposition' ),
          tandem: equationComboBoxesTandem.createTandem( 'decompositionEquationComboBox' )
        } ),
        new EquationsComboBox( model.combustionEquationProperty, listboxParent, itemAlignGroup, {
          visibleProperty: new DerivedProperty( [ model.equationTypeProperty ], equationType => equationType === 'combustion' ),
          tandem: equationComboBoxesTandem.createTandem( 'combustionEquationComboBox' )
        } )
      ],
      tandem: equationComboBoxesTandem
    } );

    Multilink.multilink( [ equationTypeRadioButtonGroup.boundsProperty, equationComboBoxes.boundsProperty ],
      ( equationTypeRadioButtonGroupBounds, equationComboBoxesBounds ) => {
        const leftMargin = 20;
        equationTypeRadioButtonGroup.left = leftMargin;
        equationTypeRadioButtonGroup.centerY = horizontalBarNode.centerY;
        equationComboBoxes.left = equationTypeRadioButtonGroupBounds.isFinite() ? equationTypeRadioButtonGroup.right + 20 : leftMargin;
        equationComboBoxes.centerY = horizontalBarNode.centerY;
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
        equationNodeParent,
        horizontalBarNode,
        equationTypeRadioButtonGroup,
        equationComboBoxes,
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
      answerNode.moveToBack();
      model.equationProperty.link( equation => {
        answerNode.string = equation.getAnswerString();
        answerNode.centerX = this.layoutBounds.centerX;
      } );
    }

    // Play Area focus order
    this.pdomPlayAreaNode.pdomOrder = [
      equationTypeRadioButtonGroup,
      equationComboBoxes,
      equationNodeParent
    ];

    // Control Area focus order
    this.pdomControlAreaNode.pdomOrder = [
      particlesNode,
      viewControl,
      resetAllButton
    ];
  }
}

balancingChemicalEquations.register( 'EquationsScreenView', EquationsScreenView );