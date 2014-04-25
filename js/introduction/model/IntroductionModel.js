// Copyright 2002-2014, University of Colorado Boulder

/**
 * Model container for the 'Introduction' screen.
 *
 * @author Daria Mitina (MLearner)
 */
define( function( require ) {
  'use strict';

  // imports
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );

  function IntroductionModel( width, height ) {

    // dimensions of the model's space
    this.width = width;
    this.height = height;

    PropertySet.call( this, {} );

  }

  inherit( PropertySet, IntroductionModel, {
    reset: function() {
    }
  } );

  return IntroductionModel;
} );