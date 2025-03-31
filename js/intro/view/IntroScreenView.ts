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
import BarChartNode from '../../common/view/BarChartNode.js';
import BoxesNode from '../../common/view/BoxesNode.js';
import EquationNode from '../../common/view/EquationNode.js';
import HorizontalAligner from '../../common/view/HorizontalAligner.js';
import IntroModel from '../model/IntroModel.js';
import EquationRadioButtonGroup from './EquationRadioButtonGroup.js';
import HorizontalBarNode from './HorizontalBarNode.js';
import IntroViewProperties from './IntroViewProperties.js';
import ToolsComboBox from './ToolsComboBox.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';

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

    const balanceScalesNode = new BalanceScalesNode( model.equationProperty, aligner, {
      visibleProperty: new DerivedProperty( [ viewProperties.balancedRepresentationProperty ],
        balancedRepresentation => balancedRepresentation === 'balanceScales' ),

      // Use special spacing for 2 fulcrums.
      // See https://github.com/phetsims/balancing-chemical-equations/issues/91
      twoFulcrumsXSpacing: 325
    } );
    balanceScalesNode.boundsProperty.link( () => {
      balanceScalesNode.bottom = accordionBoxes.top - 10;
    } );

    const barChartNode = new BarChartNode( model.equationProperty, aligner, {
      visibleProperty: new DerivedProperty( [ viewProperties.balancedRepresentationProperty ],
        balancedRepresentation => balancedRepresentation === 'barChart' )
    } );
    barChartNode.boundsProperty.link( () => {
      barChartNode.bottom = accordionBoxes.top - 10;
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
    const faceNode = new FaceNode( 70, { centerX: this.layoutBounds.centerX, top: 15 } );
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

    // interactive equations
    const equationNodesTandem = tandem.createTandem( 'equationNodes' );
    const equationNodes = new Node( {
      children: model.choices.map( choice => new EquationNode( choice.equation, aligner, {
        visibleProperty: new DerivedProperty( [ model.equationProperty ], equation => equation === choice.equation ),
        tandem: equationNodesTandem.createTandem( `${choice.tandemNamePrefix}Node` )
      } ) ),
      top: accordionBoxes.bottom + 20,
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
        accordionBoxes,
        balanceScalesNode,
        barChartNode,
        toolsControl,
        faceNode,
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
      accordionBoxes,
      toolsControl,
      resetAllButton
    ];
  }
}

balancingChemicalEquations.register( 'IntroScreenView', IntroScreenView );