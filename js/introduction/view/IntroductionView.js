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
  var FaceNode = require( 'SCENERY_PHET/FaceNode' );
  var ResetAllButton = require( 'SCENERY_PHET/ResetAllButton' );

  //constants
  var BOX_SIZE = new Dimension2( 285, 145 );
  var BOX_SEPARATION = 110;

  /**
   * @param {IntroductionModel} model
   * @constructor
   */

  function IntroductionView( model ) {

    ScreenView.call( this, {renderer: BCEConstants.RENDERER} );

    //aligner for equation
    var horizontalAligner = new HorizontalAligner( BOX_SIZE, BOX_SEPARATION, model.width / 2, 0, model.width );

    // bar charts
    var barChartsNode = new BarChartsNode( model.currentEquationProperty, horizontalAligner, 170 /* maxY */ );
    this.addChild( barChartsNode );

    // balance scales
    var balanceScalesNode = new BalanceScalesNode( model.currentEquationProperty, horizontalAligner, 170 /* maxY */ );
    this.addChild( balanceScalesNode );

    // smiley face, top center, shown when equation is balanced
    var faceNode = new FaceNode( 70, { centerX: this.layoutBounds.centerX, top: 15 } );
    this.addChild( faceNode );
    var updateFace = function() {
      faceNode.visible = model.currentEquationProperty.get().balanced;
    };
    model.currentEquationProperty.link( function( newEquation, oldEquation ) {
      if ( oldEquation ) {
        oldEquation.removeCoefficientsObserver( updateFace );
      }
      newEquation.addCoefficientsObserver( updateFace );
    } );

    // control for choosing an equation and reset button
    var equationChoiceNode = new EquationChoiceNode( model, {y: model.height - 65} );
    this.addChild( equationChoiceNode );

    // equation, in formula format
    var equationNode = new EquationNode( model.currentEquationProperty, model.COEFFICENTS_RANGE, horizontalAligner, {y: model.height - 130} );
    this.addChild( equationNode );

    // boxes that show molecules corresponding to the equation coefficients
    var boxesNode = new BoxesNode( model, horizontalAligner,
      BCEConstants.BOX_COLOR, {y: 180} );
    this.addChild( boxesNode );

    // 'Tools' combo box
    this.addChild( new ToolsComboBox( model.balanceChoiceProperty, this,
      { right: this.layoutBounds.right - 10, top: this.layoutBounds.top + 20} ) );

    // Reset All button
    this.addChild( new ResetAllButton( {
      listener: model.reset.bind( model ),
      right: model.width - 20,
      centerY: equationChoiceNode.centerY,
      scale: 0.8
    } ) );

    model.balanceChoiceProperty.link( function( choice ) {
      barChartsNode.setVisible( choice === BalancedRepresentation.BAR_CHARTS );
      balanceScalesNode.setVisible( choice === BalancedRepresentation.BALANCE_SCALES );
    } );
  }

  return inherit( ScreenView, IntroductionView );
} );
