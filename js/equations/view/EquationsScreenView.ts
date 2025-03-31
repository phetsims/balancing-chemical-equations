// Copyright 2025, University of Colorado Boulder

/**
 * EquationsScreenView is the top-level view for the 'Equations' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ScreenView from '../../../../joist/js/ScreenView.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import FaceNode from '../../../../scenery-phet/js/FaceNode.js';
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
import ToolsComboBox from '../../intro/view/ToolsComboBox.js';
import HorizontalBarNode from '../../intro/view/HorizontalBarNode.js';
import EquationsComboBox from './EquationsComboBox.js';
import Multilink from '../../../../axon/js/Multilink.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import AlignGroup from '../../../../scenery/js/layout/constraints/AlignGroup.js';
import EquationNode from '../../common/view/EquationNode.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import HorizontalAligner from '../../common/view/HorizontalAligner.js';
import BarChartNode from '../../common/view/BarChartNode.js';
import BalanceScalesNode from '../../common/view/BalanceScalesNode.js';
import BoxesNode from '../../common/view/BoxesNode.js';
import BCEColors from '../../common/BCEColors.js';

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

    // Accordion boxes that show molecules corresponding to the equation coefficients
    const accordionBoxes = new BoxesNode( model.equationProperty, model.coefficientsRange, aligner, BOX_SIZE,
      BCEColors.BOX_COLOR, viewProperties.reactantsAccordionBoxExpandedProperty, viewProperties.productsAccordionBoxExpandedProperty, {
        visibleProperty: new DerivedProperty( [ viewProperties.balancedRepresentationProperty ],
          balancedRepresentation => balancedRepresentation === 'molecules' ),
        top: 90,
        parentTandem: tandem
      } );

    // 'Tools' combo box, at upper-right
    const listboxParent = new Node();
    const toolsComboBox = new ToolsComboBox( viewProperties.balancedRepresentationProperty, listboxParent,
      tandem.createTandem( 'toolsComboBox' ) );
    const toolsControl = new HBox( {
      spacing: 10,
      children: [
        new Text( BalancingChemicalEquationsStrings.toolsStringProperty, {
          font: new PhetFont( 22 ),
          fontWeight: 'bold',
          maxWidth: 100,
          visibleProperty: toolsComboBox.visibleProperty
        } ),
        toolsComboBox
      ]
    } );

    toolsControl.boundsProperty.link( () => {
      toolsControl.right = this.layoutBounds.right - 45;
      toolsControl.top = this.layoutBounds.top + 15;
    } );

    // smiley face, top center, shown when equation is balanced
    const faceNode = new FaceNode( 70, {
      left: this.layoutBounds.left + 20,
      top: this.layoutBounds.top + 10
    } );
    const updateFace = () => {
      faceNode.visible = model.equationProperty.value.isBalancedProperty.value;
    };
    //TODO https://github.com/phetsims/balancing-chemical-equations/issues/160 Should this be a Multilink, since updateFace() uses isBalancedProperty?
    model.equationProperty.link( ( newEquation, oldEquation ) => {
      if ( oldEquation ) {
        oldEquation.isBalancedProperty.unlink( updateFace );
      }
      newEquation.isBalancedProperty.link( updateFace );
    } );

    // Radio button group for choosing an equation type
    const equationTypeRadioButtonGroup = new EquationTypeRadioButtonGroup( model.equationTypeProperty,
      tandem.createTandem( 'equationTypeRadioButtonGroup' ) );

    // Bar behind radio buttons at bottom of screen
    //TODO https://github.com/phetsims/balancing-chemical-equations/issues/160 Move HorizontalBarNode to common/.
    const horizontalBarNode = new HorizontalBarNode( this.visibleBoundsProperty, {
      visibleProperty: equationTypeRadioButtonGroup.visibleProperty,
      bottom: this.layoutBounds.bottom - 10
    } );

    equationTypeRadioButtonGroup.localBoundsProperty.link( () => {
      equationTypeRadioButtonGroup.left = 20;
      equationTypeRadioButtonGroup.centerY = horizontalBarNode.centerY;
    } );

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

    let equationNode = new EquationNode( model.equationProperty.value, aligner, {
      tandem: Tandem.OPT_OUT // ... because equationNode is created dynamically.
    } );
    const equationNodes = new Node( {
      children: [ equationNode ]
    } );
    // x position is handled by this.aligner.
    equationNodes.bottom = horizontalBarNode.top - 20;

    model.equationProperty.lazyLink( equation => {

      // Dispose of the previous equationNode.
      equationNode.dispose();

      // Create a new equationNode for the current equation.
      equationNode = new EquationNode( equation, aligner, {
        tandem: Tandem.OPT_OUT // ... because equationNode is created dynamically.
      } );
      equationNodes.children = [ equationNode ];
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

    // Show the selected 'balanced' representation, create nodes on demand.
    //TODO https://github.com/phetsims/balancing-chemical-equations/issues/160 Create barChartsNode and balanceScalesNode statically and toggle their visibility.
    const balancedParent = new Node(); // to maintain rendering order for combo box
    let barChartNode: BarChartNode;
    let balanceScalesNode: BalanceScalesNode;
    viewProperties.balancedRepresentationProperty.link( balancedRepresentation => {

      // bar chart
      if ( !barChartNode && balancedRepresentation === 'barChart' ) {
        barChartNode = new BarChartNode( model.equationProperty, aligner, {
          bottom: equationNodes.top - 20 //TODO https://github.com/phetsims/balancing-chemical-equations/issues/170
        } );
        balancedParent.addChild( barChartNode );
      }
      if ( barChartNode ) {
        barChartNode.visible = ( balancedRepresentation === 'barChart' );
      }

      // balance scales
      if ( !balanceScalesNode && balancedRepresentation === 'balanceScales' ) {
        balanceScalesNode = new BalanceScalesNode( model.equationProperty, aligner, {
          orientation: 'vertical', //TODO https://github.com/phetsims/balancing-chemical-equations/issues/170
          scale: 0.85, //TODO https://github.com/phetsims/balancing-chemical-equations/issues/170
          bottom: equationNodes.top - 30
        } );
        balancedParent.addChild( balanceScalesNode );
      }
      if ( balanceScalesNode ) {
        balanceScalesNode.visible = ( balancedRepresentation === 'balanceScales' );
      }
    } );

    const screenViewRootNode = new Node( {
      children: [
        accordionBoxes,
        toolsControl,
        faceNode,
        equationNodes,
        horizontalBarNode,
        equationTypeRadioButtonGroup,
        equationComboBoxes,
        resetAllButton,
        balancedParent,
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
      equationNodes
    ];

    // Control Area focus order
    this.pdomControlAreaNode.pdomOrder = [
      accordionBoxes,
      toolsControl,
      resetAllButton
    ];
  }
}

balancingChemicalEquations.register( 'EquationsScreenView', EquationsScreenView );