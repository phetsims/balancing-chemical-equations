// Copyright 2014-2024, University of Colorado Boulder

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
import { HBox, Node, Text } from '../../../../scenery/js/imports.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import BCEConstants from '../../common/BCEConstants.js';
import BalanceScalesNode from '../../common/view/BalanceScalesNode.js';
import BarChartsNode from '../../common/view/BarChartsNode.js';
import BoxesNode from '../../common/view/BoxesNode.js';
import EquationNode from '../../common/view/EquationNode.js';
import HorizontalAligner from '../../common/view/HorizontalAligner.js';
import EquationChoiceNode from './EquationChoiceNode.js';
import IntroViewProperties from './IntroViewProperties.js';
import ToolsComboBox from './ToolsComboBox.js';
import BalancingChemicalEquationsStrings from '../../BalancingChemicalEquationsStrings.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import IntroModel from '../model/IntroModel.js';
import BCEColors from '../../common/BCEColors.js';

// constants
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

    // boxes that show molecules corresponding to the equation coefficients
    const boxesNode = new BoxesNode( model.equationProperty, model.coefficientsRange, aligner,
      BOX_SIZE, BCEColors.BOX_COLOR, viewProperties.reactantsBoxExpandedProperty, viewProperties.productsBoxExpandedProperty,
      { top: 180 } );

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

    toolsControl.boundsProperty.link( bounds => {
      toolsControl.right = this.layoutBounds.right - 45;
      toolsControl.top = this.layoutBounds.top + 15;
    } );

    // smiley face, top center, shown when equation is balanced
    const faceNode = new FaceNode( 70, { centerX: this.layoutBounds.centerX, top: 15 } );
    const updateFace = () => {
      faceNode.visible = model.equationProperty.value.balancedProperty.value;
    };
    model.equationProperty.link( ( newEquation, oldEquation ) => {
      if ( oldEquation ) { oldEquation.balancedProperty.unlink( updateFace ); }
      newEquation.balancedProperty.link( updateFace );
    } );

    // interactive equation
    const equationNode = new EquationNode( model.equationProperty, model.coefficientsRange, aligner, {
      top: boxesNode.bottom + 20
    } );

    // control for choosing an equation
    const equationChoiceNode = new EquationChoiceNode( this.layoutBounds.width, model.equationProperty, model.choices, {
      bottom: this.layoutBounds.bottom - 10
    } );

    // Reset All button
    const resetAllButton = new ResetAllButton( {
      listener: () => {
        this.interruptSubtreeInput();
        model.reset();
        viewProperties.reset();
      },
      right: this.layoutBounds.right - 20,
      centerY: equationChoiceNode.centerY,
      scale: 0.8
    } );

    // Show the selected 'balanced' representation, create nodes on demand.
    const balancedParent = new Node(); // to maintain rendering order for combo box
    let barChartsNode: BarChartsNode;
    let balanceScalesNode: BalanceScalesNode;
    viewProperties.balancedRepresentationProperty.link( balancedRepresentation => {

      // bar chart
      if ( !barChartsNode && balancedRepresentation === 'barCharts' ) {
        barChartsNode = new BarChartsNode( model.equationProperty, aligner, {
          bottom: boxesNode.top - 10
        } );
        balancedParent.addChild( barChartsNode );
      }
      if ( barChartsNode ) {
        barChartsNode.visible = ( balancedRepresentation === 'barCharts' );
      }

      // balance scales
      if ( !balanceScalesNode && balancedRepresentation === 'balanceScales' ) {
        balanceScalesNode = new BalanceScalesNode( model.equationProperty, aligner, {
          bottom: boxesNode.top - 10,

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
        boxesNode,
        toolsControl,
        faceNode,
        equationNode,
        equationChoiceNode,
        resetAllButton,
        balancedParent,
        comboBoxParent // add this last, so that combo box list is on top of everything else
      ]
    } );
    this.addChild( screenViewRootNode );

    // show the answer when running in dev mode, bottom center
    if ( phet.chipper.queryParameters.showAnswers ) {
      const answerNode = new Text( '', { font: new PhetFont( 12 ), bottom: equationChoiceNode.top - 5 } );
      screenViewRootNode.addChild( answerNode );
      model.equationProperty.link( equation => {
        answerNode.string = equation.getCoefficientsString();
        answerNode.centerX = this.layoutBounds.centerX;
      } );
    }
  }
}

balancingChemicalEquations.register( 'IntroScreenView', IntroScreenView );