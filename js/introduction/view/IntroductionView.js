// Copyright 2002-2014, University of Colorado Boulder

/**
 * Scene graph for the 'Introduction' screen.
 *
 * @author Vasily Shakhov (MLearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var BoxesNode = require( 'BALANCING_CHEMICAL_EQUATIONS/common/view/BoxesNode' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var HorizontalAligner = require( 'BALANCING_CHEMICAL_EQUATIONS/common/view/HorizontalAligner' );
  var ToolsComboBox = require( 'BALANCING_CHEMICAL_EQUATIONS/introduction/view/ToolsComboBox' );
  var EquationChoiceNode = require( 'BALANCING_CHEMICAL_EQUATIONS/introduction/view/EquationChoiceNode' );
  var EquationNode = require( 'BALANCING_CHEMICAL_EQUATIONS/common/view/EquationNode' );
  var BCEConstants = require( 'BALANCING_CHEMICAL_EQUATIONS/common/BCEConstants' );
  var BarChartsNode = require( 'BALANCING_CHEMICAL_EQUATIONS/common/view/BarChartsNode' );
  var BalanceScalesNode = require( 'BALANCING_CHEMICAL_EQUATIONS/common/view/BalanceScalesNode' );
  var BalancedRepresentation = require( 'BALANCING_CHEMICAL_EQUATIONS/common/model/BalancedRepresentation' );
  var BCEFaceNode = require( 'BALANCING_CHEMICAL_EQUATIONS/common/view/BCEFaceNode' );
  var ResetAllButton = require( 'SCENERY_PHET/ResetAllButton' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var BCEQueryParameters = require( 'BALANCING_CHEMICAL_EQUATIONS/common/BCEQueryParameters' );
  var PropertySet = require( 'AXON/PropertySet' );

  // constants
  var BOX_SIZE = new Dimension2( 285, 145 );
  var BOX_X_SPACING = 110; // horizontal spacing between boxes

  /**
   * @param {IntroductionModel} model
   * @constructor
   */
  function IntroductionView( model ) {

    var self = this;
    ScreenView.call( this, {renderer: BCEConstants.RENDERER} );

    var viewProperties = new PropertySet( {
      reactantsBoxExpanded: true,
      productsBoxExpanded: true,
      balancedRepresentation: BalancedRepresentation.NONE
    } );

    // aligner for equation
    var aligner = new HorizontalAligner( this.layoutBounds.width, BOX_SIZE.width, BOX_X_SPACING );

    // boxes that show molecules corresponding to the equation coefficients
    var boxesNode = new BoxesNode( model.equationProperty, model.COEFFICENTS_RANGE, aligner,
      BOX_SIZE, BCEConstants.BOX_COLOR, viewProperties.reactantsBoxExpandedProperty, viewProperties.productsBoxExpandedProperty,
      { top: 180 } );
    this.addChild( boxesNode );

    // 'Tools' combo box, at upper-right
    var comboBoxParent = new Node();
    this.addChild( new ToolsComboBox( viewProperties.balancedRepresentationProperty, comboBoxParent,
      { right: boxesNode.right, top: this.layoutBounds.top + 15 } ) );

    // bar charts, above boxes
    var barChartsNode = new BarChartsNode( model.equationProperty, aligner, {
      bottom: boxesNode.top - 10, visible: viewProperties.balancedRepresentationProperty.get() === BalancedRepresentation.BAR_CHARTS  } );
    this.addChild( barChartsNode );

    // balance scales, above boxes
    var balanceScalesNode = new BalanceScalesNode( model.equationProperty, aligner,
      { bottom: boxesNode.top - 10, visible: viewProperties.balancedRepresentationProperty.get() === BalancedRepresentation.BALANCE_SCALES  } );
    this.addChild( balanceScalesNode );

    // smiley face, top center, shown when equation is balanced
    var faceNode = new BCEFaceNode( model.equationProperty, { centerX: this.layoutBounds.centerX, top: 15 } );
    this.addChild( faceNode );

    // interactive equation
    this.addChild( new EquationNode( model.equationProperty, model.COEFFICENTS_RANGE, aligner, { top: boxesNode.bottom + 20 } ) );

    // control for choosing an equation
    var equationChoiceNode = new EquationChoiceNode( this.layoutBounds.width, model.equationProperty, model.choices, { bottom: this.layoutBounds.bottom - 10 } );
    this.addChild( equationChoiceNode );

    // Reset All button
    this.addChild( new ResetAllButton( {
      listener: function() {
        model.reset();
        viewProperties.reset();
      },
      right: this.layoutBounds.right - 20,
      centerY: equationChoiceNode.centerY,
      scale: 0.8
    } ) );

    // add this last, so that combo box list is on top of everything else
    this.addChild( comboBoxParent );

    viewProperties.balancedRepresentationProperty.link( function( balancedRepresentation ) {
      barChartsNode.setVisible( balancedRepresentation === BalancedRepresentation.BAR_CHARTS );
      balanceScalesNode.setVisible( balancedRepresentation === BalancedRepresentation.BALANCE_SCALES );
    } );

    // show the answer when running in dev mode, bottom center
    if ( BCEQueryParameters.DEV ) {
      var answerNode = new Text( '', { font: new PhetFont( 12 ), bottom: equationChoiceNode.top - 5 } );
      this.addChild( answerNode );
      model.equationProperty.link( function( equation ) {
        answerNode.text = equation.getCoefficientsString();
        answerNode.centerX = self.layoutBounds.centerX;
      } );
    }
  }

  return inherit( ScreenView, IntroductionView );
} );
