// Copyright 2002-2014, University of Colorado Boulder

/**
 * Main entry point for the 'Balancing Chemical Equations' sim.
 */
define( function( require ) {
  'use strict';

  // modules
  var Image = require( 'SCENERY/nodes/Image' );
  var Screen = require( 'JOIST/Screen' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var Sim = require( 'JOIST/Sim' );
  var SimLauncher = require( 'JOIST/SimLauncher' );
  var GameModel = require( 'BALANCING_CHEMICAL_EQUATIONS/game/model/GameModel' );
  var GameView = require( 'BALANCING_CHEMICAL_EQUATIONS/game/view/GameView' );
  var IntroductionModel = require( 'BALANCING_CHEMICAL_EQUATIONS/introduction/model/IntroductionModel' );
  var IntroductionView = require( 'BALANCING_CHEMICAL_EQUATIONS/introduction/view/IntroductionView' );
  var BCEConstants = require( 'BALANCING_CHEMICAL_EQUATIONS/common/model/BCEConstants' );

  // strings
  var simTitleString = require( 'string!BALANCING_CHEMICAL_EQUATIONS/balancing-chemical-equations.name' );
  var introductionTitleString = require( 'string!BALANCING_CHEMICAL_EQUATIONS/introduction' );
  var balancingGameTitleString = require( 'string!BALANCING_CHEMICAL_EQUATIONS/balancingGame' );

  //TODO replace to normal images
  //images
  var introductionImage = require( 'image!BALANCING_CHEMICAL_EQUATIONS/Check-Mark-u2713.png' );
  var balancingGameImage = require( 'image!BALANCING_CHEMICAL_EQUATIONS/Check-Mark-u2713.png' );

  var screens = [
    new Screen( introductionTitleString, new Image( introductionImage ),
      function() { return new IntroductionModel( ScreenView.DEFAULT_LAYOUT_BOUNDS.width, ScreenView.DEFAULT_LAYOUT_BOUNDS.height ); },
      function( model ) { return new IntroductionView( model ); },
      {backgroundColor: BCEConstants.INTRODUCTION_CANVAS_BACKGROUND} )/*,
     new Screen( balancingGameTitleString, new Image( balancingGameImage ),
     function() { return new GameModel( ScreenView.DEFAULT_LAYOUT_BOUNDS.width, ScreenView.DEFAULT_LAYOUT_BOUNDS.height ); },
     function( model ) { return new GameView( model ); } )*/
  ];


  //TODO populate credits
  var simOptions = {
    credits: '',
    thanks: ''
  };

  SimLauncher.launch( function() {
    new Sim( simTitleString, screens, simOptions ).start();
  } );
} );