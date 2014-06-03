// Copyright 2002-2014, University of Colorado Boulder

/**
 * The 'Game' Screen
 *
 * Author: Vasily Shakhov (mlearner.com)
 */

define( function( require ) {
  'use strict';

  // modules
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var GameModel = require( 'BALANCING_CHEMICAL_EQUATIONS/game/model/GameModel' );
  var GameView = require( 'BALANCING_CHEMICAL_EQUATIONS/game/view/GameView' );
  var BCEConstants = require( 'BALANCING_CHEMICAL_EQUATIONS/common/BCEConstants' );
  var Screen = require( 'JOIST/Screen' );
  var ScreenView = require( 'JOIST/ScreenView' );

  // strings
  var balancingGameTitleString = require( 'string!BALANCING_CHEMICAL_EQUATIONS/introduction' );

  // images
  var balancingGameImage = require( 'image!BALANCING_CHEMICAL_EQUATIONS/Check-Mark-u2713.png' );

  var IntroductionScreen = function() {
    Screen.call( this,
      balancingGameTitleString,
      new Image( balancingGameImage ),
      function() { return new GameModel(ScreenView.DEFAULT_LAYOUT_BOUNDS.width, ScreenView.DEFAULT_LAYOUT_BOUNDS.height); },
      function( model ) { return new GameView( model ); },
      {
        backgroundColor: BCEConstants.GAME_CANVAS_BACKGROUND
      }
    );
  };

  return inherit( Screen, IntroductionScreen );

} );