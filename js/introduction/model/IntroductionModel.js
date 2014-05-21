// Copyright 2002-2014, University of Colorado Boulder

/**
 * Model container for the 'Introduction' screen.
 *
 * @author Vasily Shakhov (MLearner)
 */
define( function( require ) {
  'use strict';

  // imports
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );

  function IntroductionModel( width, height ) {

    var COEFFICENTS_ARRAY = [0, 1, 2, 3]; // Array of possible equation coefficients

    // dimensions of the model's space
    this.width = width;
    this.height = height;

    PropertySet.call( this, {
      currentEquation: null
    } );

  }

  inherit( PropertySet, IntroductionModel, {
    reset: function() {
    }
  } );

  return IntroductionModel;
} );