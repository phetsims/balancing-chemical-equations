// Copyright 2014-2017, University of Colorado Boulder

/**
 * Main entry point for the 'Balancing Chemical Equations' sim.
 */
define( function( require ) {
  'use strict';

  // modules
  var GameScreen = require( 'BALANCING_CHEMICAL_EQUATIONS/game/GameScreen' );
  var IntroductionScreen = require( 'BALANCING_CHEMICAL_EQUATIONS/introduction/IntroductionScreen' );
  var Sim = require( 'JOIST/Sim' );
  var SimLauncher = require( 'JOIST/SimLauncher' );

  // strings
  var balancingChemicalEquationsTitleString = require( 'string!BALANCING_CHEMICAL_EQUATIONS/balancing-chemical-equations.title' );

  var simOptions = {
    credits: {
      leadDesign: 'Kelly Lancaster (Java), Yuen-ying Carpenter (HTML5)',
      softwareDevelopment: 'Chris Malley (PixelZoom, Inc.)',
      team: 'Julia Chamberlain, Patricia Loeblein, Emily B. Moore. Robert Parson, Ariel Paul, Kathy Perkins, Amy Rouinfar',
      qualityAssurance: 'Steele Dalton, Bryce Griebenow, Elise Morgan, Oliver Orejola, Benjamin Roberts, Bryan Yoelin',
      thanks: '\u2022 Conversion of this simulation to HTML5 was funded in part by the American Association of Chemistry Teachers (AACT).<br>' +
              '\u2022 Thanks to Mobile Learner Labs for working with the PhE. development team to convert this simulation to HTML5.'
    }
  };

  SimLauncher.launch( function() {
    var screens = [
      new IntroductionScreen(),
      new GameScreen()
    ];
    new Sim( balancingChemicalEquationsTitleString, screens, simOptions ).start();
  } );
} );