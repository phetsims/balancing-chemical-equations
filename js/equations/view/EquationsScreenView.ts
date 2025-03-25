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

//TODO https://github.com/phetsims/balancing-chemical-equations/issues/160 Need by aligner.
// const BOX_SIZE = new Dimension2( 285, 145 );
// const BOX_X_SPACING = 110; // horizontal spacing between boxes

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
    //TODO https://github.com/phetsims/balancing-chemical-equations/issues/160 aligner is needed even without accordion boxes.
    // const aligner = new HorizontalAligner( this.layoutBounds.width, BOX_SIZE.width, BOX_X_SPACING );

    // 'Tools' combo box, at upper-right
    const listboxParent = new Node();
    //TODO https://github.com/phetsims/balancing-chemical-equations/issues/160 Move ToolsComboBox to common/.
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

    // Radio button group for choosing an equation type
    const equationRadioButtonGroup = new EquationTypeRadioButtonGroup( model.equationTypeProperty,
      tandem.createTandem( 'equationRadioButtonGroup' ) );

    // Bar behind radio buttons at bottom of screen
    //TODO https://github.com/phetsims/balancing-chemical-equations/issues/160 Move HorizontalBarNode to common/.
    const horizontalBarNode = new HorizontalBarNode( this.visibleBoundsProperty, {
      visibleProperty: equationRadioButtonGroup.visibleProperty,
      bottom: this.layoutBounds.bottom - 10
    } );

    equationRadioButtonGroup.localBoundsProperty.link( () => {
      equationRadioButtonGroup.left = 20;
      equationRadioButtonGroup.centerY = horizontalBarNode.centerY;
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

    Multilink.multilink( [ equationRadioButtonGroup.localBoundsProperty, equationComboBoxes.localBoundsProperty ],
      () => {
        equationRadioButtonGroup.left = 20;
        equationRadioButtonGroup.centerY = horizontalBarNode.centerY;
        equationComboBoxes.left = equationRadioButtonGroup.right + 20;
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
        toolsControl,
        faceNode,
        horizontalBarNode,
        equationRadioButtonGroup,
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
      model.equationProperty.link( equation => {
        answerNode.string = equation.getAnswerString();
        answerNode.centerX = this.layoutBounds.centerX;
      } );
    }

    // Play Area focus order
    this.pdomPlayAreaNode.pdomOrder = [
      equationRadioButtonGroup,
      equationComboBoxes
    ];

    // Control Area focus order
    this.pdomControlAreaNode.pdomOrder = [
      toolsControl,
      resetAllButton
    ];
  }
}

balancingChemicalEquations.register( 'EquationsScreenView', EquationsScreenView );