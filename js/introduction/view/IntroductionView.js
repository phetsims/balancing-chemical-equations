// Copyright 2002-2014, University of Colorado Boulder

/**
 * Scene graph for the 'Introduction' screen.
 *
 * @author Vasily Shakhov (MLearner)
 */

define( function( require ) {
  'use strict';

  // imports
  var inherit = require( 'PHET_CORE/inherit' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var BalancedRepresentationChoiceNode = require( 'BALANCING_CHEMICAL_EQUATIONS/introduction/view/BalancedRepresentationChoiceNode' );
  var EquationChoiceAndResetNode = require( 'BALANCING_CHEMICAL_EQUATIONS/introduction/view/EquationChoiceAndResetNode' );

  function IntroductionView( model ) {
    ScreenView.call( this, { renderer: 'svg' } );

    /*var BOX_SIZE = new Dimension2( 285, 145);
     var BOX_SEPARATION = 110;*/

    // control for choosing the visual representation of "balanced"
    var balanceChoiceNode = new BalancedRepresentationChoiceNode( model.balanceChoiceProperty, this, {right: model.width - 10, top: 10} );
    this.addChild( balanceChoiceNode );

    // control for choosing an equation and reset button
    var equationChoiceAndResetNode = new EquationChoiceAndResetNode( model, {y: model.height - 65} );
    this.addChild( equationChoiceAndResetNode );

  }

  return inherit( ScreenView, IntroductionView );
} );
