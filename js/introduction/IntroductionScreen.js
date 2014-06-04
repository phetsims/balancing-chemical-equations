// Copyright 2002-2014, University of Colorado Boulder

/**
 * The 'Introduction' Screen
 *
 * Author: Vasily Shakhov (mlearner.com)
 */

define( function( require ) {
  'use strict';

  // modules
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var IntroductionModel = require( 'BALANCING_CHEMICAL_EQUATIONS/introduction/model/IntroductionModel' );
  var IntroductionView = require( 'BALANCING_CHEMICAL_EQUATIONS/introduction/view/IntroductionView' );
  var BCEConstants = require( 'BALANCING_CHEMICAL_EQUATIONS/common/BCEConstants' );
  var Screen = require( 'JOIST/Screen' );
  var ScreenView = require( 'JOIST/ScreenView' );

  // strings
  var introductionTitleString = require( 'string!BALANCING_CHEMICAL_EQUATIONS/introduction' );

  // images
  var introductionImage = require( 'image!BALANCING_CHEMICAL_EQUATIONS/introduction-icon.png' );

  var IntroductionScreen = function() {
    Screen.call( this,
      introductionTitleString,
      new Image( introductionImage ),
      function() { return new IntroductionModel( ScreenView.DEFAULT_LAYOUT_BOUNDS.width, ScreenView.DEFAULT_LAYOUT_BOUNDS.height ); },
      function( model ) { return new IntroductionView( model ); },
      {
        backgroundColor: BCEConstants.INTRODUCTION_CANVAS_BACKGROUND
      }
    );
  };

  return inherit( Screen, IntroductionScreen );

} );