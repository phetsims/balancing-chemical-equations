// Copyright 2002-2014, University of Colorado Boulder

/**
 * Scene graph for the 'Introduction' screen.
 *
 * @author Daria Mitina (MLearner)
 */

define( function( require ) {
  'use strict';

  // imports
  var inherit = require( 'PHET_CORE/inherit' );
  var ScreenView = require( 'JOIST/ScreenView' );

  function IntroductionView( model ) {
    ScreenView.call( this, { renderer: 'svg' } );
  }

  return inherit( ScreenView, IntroductionView );
} );
