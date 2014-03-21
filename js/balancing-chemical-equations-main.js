// Copyright 2002-2014, University of Colorado Boulder

/**
 * Main entry point for the 'Balancing Chemical Equations' sim.
 */
define( function( require ) {
  'use strict';

  // imports
  var Sim = require( 'JOIST/Sim' );
  var SimLauncher = require( 'JOIST/SimLauncher' );

  // strings
  var simTitleString = require( 'string!BALANCING_CHEMICAL_EQUATIONS/balancing-chemical-equations.name' );

  var screens = [
    //TODO populate this array
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