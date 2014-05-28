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
  var ScreenView = require( 'JOIST/ScreenView' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var HorizontalAligner = require( 'BALANCING_CHEMICAL_EQUATIONS/common/view/HorizontalAligner' );
  var BalancedRepresentationChoiceNode = require( 'BALANCING_CHEMICAL_EQUATIONS/introduction/view/BalancedRepresentationChoiceNode' );
  var EquationChoiceAndResetNode = require( 'BALANCING_CHEMICAL_EQUATIONS/introduction/view/EquationChoiceAndResetNode' );
  var EquationNode = require( 'BALANCING_CHEMICAL_EQUATIONS/common/view/equationNode' );

  //constants
  var BOX_SIZE = new Dimension2( 285, 145 );
  var BOX_SEPARATION = 110;

  function IntroductionView( model ) {
    ScreenView.call( this, { renderer: 'svg' } );

    //aligner for equation
    var horizontalAligner = new HorizontalAligner( BOX_SIZE, BOX_SEPARATION, model.width / 2 );

    // control for choosing the visual representation of "balanced"
    var balanceChoiceNode = new BalancedRepresentationChoiceNode( model.balanceChoiceProperty, this, {right: model.width - 10, y: 10} );
    this.addChild( balanceChoiceNode );

    // control for choosing an equation and reset button
    var equationChoiceAndResetNode = new EquationChoiceAndResetNode( model, {y: model.height - 65} );
    this.addChild( equationChoiceAndResetNode );

    // equation, in formula format
    var equationNode = new EquationNode( model.currentEquationProperty, model.COEFFICENTS_RANGE, horizontalAligner, {y: model.height - 100} );
    this.addChild( equationNode );

  }

  return inherit( ScreenView, IntroductionView );
} );
