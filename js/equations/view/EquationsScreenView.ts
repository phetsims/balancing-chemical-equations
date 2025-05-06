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
import Equation from '../../common/model/Equation.js';

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

    // Radio button group for choosing a reaction type
    const reactionTypeRadioButtonGroup = new EquationTypeRadioButtonGroup( model.reactionTypeProperty,
      tandem.createTandem( 'reactionTypeRadioButtonGroup' ) );

    const listboxParent = new Node();

    // So that all equations have the same effective size.
    const itemAlignGroup = new AlignGroup();

    // ComboBoxes for selecting specific equations
    const equationComboBoxesTandem = tandem.createTandem( 'equationsComboBoxes' );
    const equationComboBoxes = new Node( {
      children: [
        new EquationsComboBox( model.synthesisEquationProperty, listboxParent, itemAlignGroup, {
          visibleProperty: new DerivedProperty( [ model.reactionTypeProperty ], equationType => equationType === 'synthesis' ),
          tandem: equationComboBoxesTandem.createTandem( 'synthesisEquationComboBox' )
        } ),
        new EquationsComboBox( model.decompositionEquationProperty, listboxParent, itemAlignGroup, {
          visibleProperty: new DerivedProperty( [ model.reactionTypeProperty ], equationType => equationType === 'decomposition' ),
          tandem: equationComboBoxesTandem.createTandem( 'decompositionEquationComboBox' )
        } ),
        new EquationsComboBox( model.combustionEquationProperty, listboxParent, itemAlignGroup, {
          visibleProperty: new DerivedProperty( [ model.reactionTypeProperty ], equationType => equationType === 'combustion' ),
          tandem: equationComboBoxesTandem.createTandem( 'combustionEquationComboBox' )
        } )
      ],
      tandem: equationComboBoxesTandem,
      visiblePropertyOptions: {
        phetioFeatured: true // See https://github.com/phetsims/balancing-chemical-equations/issues/201
      }
    } );

    // Bar behind radio buttons at bottom of screen
    const horizontalBarNode = new HorizontalBarNode( this.visibleBoundsProperty, {

      // Visible if radio buttons or combo box are visible.
      visibleProperty: DerivedProperty.or( [ reactionTypeRadioButtonGroup.visibleProperty, equationComboBoxes.visibleProperty ] ),
      bottom: this.layoutBounds.bottom - 10
    } );

    Multilink.multilink( [ reactionTypeRadioButtonGroup.visibleProperty, reactionTypeRadioButtonGroup.boundsProperty ],
      ( visible, bounds ) => {
        const leftMargin = 20;

        reactionTypeRadioButtonGroup.left = leftMargin;
        reactionTypeRadioButtonGroup.centerY = horizontalBarNode.centerY;

        if ( visible && bounds.isFinite() ) {
          equationComboBoxes.left = reactionTypeRadioButtonGroup.right + leftMargin;
        }
        else {
          equationComboBoxes.centerX = this.layoutBounds.centerX;
        }
        equationComboBoxes.centerY = horizontalBarNode.centerY;
      } );

    // interactive equations
    const createEquationNodes = ( equations: Equation[], parentTandem: Tandem ) => equations.map( equation => new EquationNode( equation, aligner, {
      visibleProperty: new DerivedProperty( [ model.equationProperty ], value => value === equation ),
      tandem: parentTandem.createTandem( `${equation.tandem.name}Node` )
    } ) );
    const equationNodesTandem = tandem.createTandem( 'equationNodes' );
    const synthesisEquationNodes = createEquationNodes( model.synthesisEquations, equationNodesTandem.createTandem( 'synthesisEquationNodes' ) );
    const decompositionEquationNodes = createEquationNodes( model.decompositionEquations, equationNodesTandem.createTandem( 'decompositionEquationNodes' ) );
    const combustionEquationNodes = createEquationNodes( model.combustionEquations, equationNodesTandem.createTandem( 'combustionEquationNodes' ) );

    const equationNodes = new Node( {
      children: [ ...synthesisEquationNodes, ...decompositionEquationNodes, ...combustionEquationNodes ],
      bottom: horizontalBarNode.top - 20,
      tandem: equationNodesTandem
    } );

    const particlesNode = new ParticlesNode( model.equationProperty, model.coefficientsRange, aligner, BOX_SIZE,
      BCEColors.BOX_COLOR, viewProperties.reactantsAccordionBoxExpandedProperty, viewProperties.productsAccordionBoxExpandedProperty, {
        visibleProperty: new DerivedProperty( [ viewProperties.viewModeProperty ], viewMode => viewMode === 'particles' ),
        bottom: equationNodes.top - 20,
        parentTandem: tandem
      } );

    const balanceScalesNode = new BalanceScalesNode( model.equationProperty, {
      visibleProperty: new DerivedProperty( [ viewProperties.viewModeProperty ], viewMode => viewMode === 'balanceScales' )
    } );
    balanceScalesNode.boundsProperty.link( () => {
      balanceScalesNode.x = particlesNode.centerX;
      balanceScalesNode.bottom = particlesNode.bottom;
    } );

    const barChartsNode = new BarChartsNode( model.equationProperty, {
      visibleProperty: new DerivedProperty( [ viewProperties.viewModeProperty ], viewMode => viewMode === 'barCharts' )
    } );
    barChartsNode.boundsProperty.link( () => {
      barChartsNode.x = particlesNode.centerX; // Origin is at the bottom-center of the bottom equality operator.
      barChartsNode.bottom = particlesNode.bottom;
    } );

    // 'View' combo box, at top-right.
    const viewComboBox = new ViewComboBox( viewProperties.viewModeProperty, listboxParent,
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
        reactionTypeRadioButtonGroup,
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
      reactionTypeRadioButtonGroup,
      equationComboBoxes,
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

balancingChemicalEquations.register( 'EquationsScreenView', EquationsScreenView );