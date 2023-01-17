// Copyright 2014-2023, University of Colorado Boulder

/**
 * Scene graph for the 'Introduction' screen.
 *
 * @author Vasily Shakhov (MLearner)
 */

import Dimension2 from '../../../../dot/js/Dimension2.js';
import ScreenView from '../../../../joist/js/ScreenView.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import FaceNode from '../../../../scenery-phet/js/FaceNode.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Node, Text, HBox } from '../../../../scenery/js/imports.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import BCEConstants from '../../common/BCEConstants.js';
import BalancedRepresentation from '../../common/model/BalancedRepresentation.js';
import BalanceScalesNode from '../../common/view/BalanceScalesNode.js';
import BarChartsNode from '../../common/view/BarChartsNode.js';
import BoxesNode from '../../common/view/BoxesNode.js';
import EquationNode from '../../common/view/EquationNode.js';
import HorizontalAligner from '../../common/view/HorizontalAligner.js';
import EquationChoiceNode from './EquationChoiceNode.js';
import IntroductionViewProperties from './IntroductionViewProperties.js';
import ToolsComboBox from './ToolsComboBox.js';
import BalancingChemicalEquationsStrings from '../../BalancingChemicalEquationsStrings.js';

// constants
const BOX_SIZE = new Dimension2( 285, 145 );
const BOX_X_SPACING = 110; // horizontal spacing between boxes

export default class IntroductionScreenView extends ScreenView {

  /**
   * @param {IntroductionModel} model
   */
  constructor( model ) {

    super( {
      layoutBounds: BCEConstants.LAYOUT_BOUNDS
    } );

    // view-specific Properties
    const viewProperties = new IntroductionViewProperties();

    // aligner for equation
    const aligner = new HorizontalAligner( this.layoutBounds.width, BOX_SIZE.width, BOX_X_SPACING );

    // boxes that show molecules corresponding to the equation coefficients
    const boxesNode = new BoxesNode( model.equationProperty, model.COEFFICENTS_RANGE, aligner,
      BOX_SIZE, BCEConstants.BOX_COLOR, viewProperties.reactantsBoxExpandedProperty, viewProperties.productsBoxExpandedProperty,
      { top: 180 } );
    this.addChild( boxesNode );

    // 'Tools' combo box, at upper-right
    const comboBoxParent = new Node();
    const toolsComboBox = new ToolsComboBox( viewProperties.balancedRepresentationProperty, comboBoxParent );
    const toolsControl = new HBox( {
      spacing: 10,
      children: [
        new Text( BalancingChemicalEquationsStrings.toolsStringProperty, {
          font: new PhetFont( 22 ),
          fontWeight: 'bold',
          maxWidth: 100
        } ),
        toolsComboBox
      ]
    } );
    this.addChild( toolsControl );

    toolsControl.boundsProperty.link( bounds => {
      toolsControl.right = this.layoutBounds.right - 45;
      toolsControl.top = this.layoutBounds.top + 15;
    } );

    // smiley face, top center, shown when equation is balanced
    const faceNode = new FaceNode( 70, { centerX: this.layoutBounds.centerX, top: 15 } );
    this.addChild( faceNode );
    const updateFace = () => {
      faceNode.visible = model.equationProperty.get().balancedProperty.get();
    };
    model.equationProperty.link( ( newEquation, oldEquation ) => {
      if ( oldEquation ) { oldEquation.balancedProperty.unlink( updateFace ); }
      newEquation.balancedProperty.link( updateFace );
    } );

    // interactive equation
    this.addChild( new EquationNode( model.equationProperty, model.COEFFICENTS_RANGE, aligner, { top: boxesNode.bottom + 20 } ) );

    // control for choosing an equation
    const equationChoiceNode = new EquationChoiceNode( this.layoutBounds.width, model.equationProperty, model.choices, { bottom: this.layoutBounds.bottom - 10 } );
    this.addChild( equationChoiceNode );

    // Reset All button
    this.addChild( new ResetAllButton( {
      listener: () => {
        model.reset();
        viewProperties.reset();
      },
      right: this.layoutBounds.right - 20,
      centerY: equationChoiceNode.centerY,
      scale: 0.8
    } ) );

    // Show the selected 'balanced' representation, create nodes on demand.
    const balancedParent = new Node(); // to maintain rendering order for combo box
    this.addChild( balancedParent );
    let barChartsNode;
    let balanceScalesNode;
    viewProperties.balancedRepresentationProperty.link( balancedRepresentation => {

      // bar chart
      if ( !barChartsNode && balancedRepresentation === BalancedRepresentation.BAR_CHARTS ) {
        barChartsNode = new BarChartsNode( model.equationProperty, aligner, {
          bottom: boxesNode.top - 10
        } );
        balancedParent.addChild( barChartsNode );
      }
      if ( barChartsNode ) {
        barChartsNode.visible = ( balancedRepresentation === BalancedRepresentation.BAR_CHARTS );
      }

      // balance scales
      if ( !balanceScalesNode && balancedRepresentation === BalancedRepresentation.BALANCE_SCALES ) {
        balanceScalesNode = new BalanceScalesNode( model.equationProperty, aligner,
          { bottom: boxesNode.top - 10, dualFulcrumSpacing: 325 } );  // use special spacing for 2 fulcrums, see issue #91
        balancedParent.addChild( balanceScalesNode );
      }
      if ( balanceScalesNode ) {
        balanceScalesNode.visible = ( balancedRepresentation === BalancedRepresentation.BALANCE_SCALES );
      }
    } );

    // add this last, so that combo box list is on top of everything else
    this.addChild( comboBoxParent );

    // show the answer when running in dev mode, bottom center
    if ( phet.chipper.queryParameters.showAnswers ) {
      const answerNode = new Text( '', { font: new PhetFont( 12 ), bottom: equationChoiceNode.top - 5 } );
      this.addChild( answerNode );
      model.equationProperty.link( equation => {
        answerNode.text = equation.getCoefficientsString();
        answerNode.centerX = this.layoutBounds.centerX;
      } );
    }
  }
}

balancingChemicalEquations.register( 'IntroductionScreenView', IntroductionScreenView );