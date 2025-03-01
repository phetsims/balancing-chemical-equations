// Copyright 2014-2025, University of Colorado Boulder

/**
 * Scene graph for the 'Intro' screen.
 *
 * @author Vasily Shakhov (MLearner)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Dimension2 from '../../../../dot/js/Dimension2.js';
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
import BCEColors from '../../common/BCEColors.js';
import BCEConstants from '../../common/BCEConstants.js';
import BalanceScalesNode from '../../common/view/BalanceScalesNode.js';
import BarChartsNode from '../../common/view/BarChartsNode.js';
import BoxesNode from '../../common/view/BoxesNode.js';
import EquationNode from '../../common/view/EquationNode.js';
import HorizontalAligner from '../../common/view/HorizontalAligner.js';
import IntroModel from '../model/IntroModel.js';
import EquationRadioButtonGroup from './EquationRadioButtonGroup.js';
import HorizontalBarNode from './HorizontalBarNode.js';
import IntroViewProperties from './IntroViewProperties.js';
import ToolsComboBox from './ToolsComboBox.js';

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

    // Accordion boxes that show molecules corresponding to the equation coefficients
    const accordionBoxes = new BoxesNode( model.equationProperty, model.coefficientsRange, aligner, BOX_SIZE,
      BCEColors.BOX_COLOR, viewProperties.reactantsAccordionBoxExpandedProperty, viewProperties.productsAccordionBoxExpandedProperty, {
        top: 180,
        parentTandem: tandem
      } );

    // 'Tools' combo box, at upper-right
    const comboBoxParent = new Node();
    const toolsComboBox = new ToolsComboBox( viewProperties.balancedRepresentationProperty, comboBoxParent,
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
    const faceNode = new FaceNode( 70, { centerX: this.layoutBounds.centerX, top: 15 } );
    const updateFace = () => {
      faceNode.visible = model.equationProperty.value.isBalancedProperty.value;
    };
    model.equationProperty.link( ( newEquation, oldEquation ) => {
      if ( oldEquation ) {
        oldEquation.isBalancedProperty.unlink( updateFace );
      }
      newEquation.isBalancedProperty.link( updateFace );
    } );

    // interactive equation
    const equationNode = new EquationNode( model.equationProperty, model.coefficientsRange, aligner, {
      top: accordionBoxes.bottom + 20
    } );

    // Radio button group for choosing an equation
    const equationRadioButtonGroup = new EquationRadioButtonGroup( model.equationProperty, model.choices, {
      maxWidth: 0.8 * this.layoutBounds.width,
      tandem: tandem.createTandem( 'equationRadioButtonGroup' )
    } );

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

    // Show the selected 'balanced' representation, create nodes on demand.
    const balancedParent = new Node(); // to maintain rendering order for combo box
    let barChartsNode: BarChartsNode;
    let balanceScalesNode: BalanceScalesNode;
    viewProperties.balancedRepresentationProperty.link( balancedRepresentation => {

      // bar chart
      if ( !barChartsNode && balancedRepresentation === 'barCharts' ) {
        barChartsNode = new BarChartsNode( model.equationProperty, aligner, {
          bottom: accordionBoxes.top - 10
        } );
        balancedParent.addChild( barChartsNode );
      }
      if ( barChartsNode ) {
        barChartsNode.visible = ( balancedRepresentation === 'barCharts' );
      }

      // balance scales
      if ( !balanceScalesNode && balancedRepresentation === 'balanceScales' ) {
        balanceScalesNode = new BalanceScalesNode( model.equationProperty, aligner, {
          bottom: accordionBoxes.top - 10,

          // Use special spacing for 2 fulcrums.
          // See https://github.com/phetsims/balancing-chemical-equations/issues/91
          dualFulcrumSpacing: 325
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
        equationNode,
        horizontalBarNode,
        equationRadioButtonGroup,
        resetAllButton,
        balancedParent,
        comboBoxParent // add this last, so that combo box list is on top of everything else
      ]
    } );
    this.addChild( screenViewRootNode );

    // show the answer when running in dev mode, bottom center
    if ( phet.chipper.queryParameters.showAnswers ) {
      const answerNode = new Text( '', { font: new PhetFont( 12 ), bottom: horizontalBarNode.top - 5 } );
      screenViewRootNode.addChild( answerNode );
      model.equationProperty.link( equation => {
        answerNode.string = equation.getCoefficientsString();
        answerNode.centerX = this.layoutBounds.centerX;
      } );
    }

    // Play Area focus order
    this.pdomPlayAreaNode.pdomOrder = [
      //TODO https://github.com/phetsims/balancing-chemical-equations/issues/161
      equationRadioButtonGroup,
      equationNode,
      accordionBoxes,
      toolsControl,
      resetAllButton
    ];

    // Control Area focus order
    this.pdomControlAreaNode.pdomOrder = [
      // TODO https://github.com/phetsims/balancing-chemical-equations/issues/161
    ];
  }
}

balancingChemicalEquations.register( 'IntroScreenView', IntroScreenView );