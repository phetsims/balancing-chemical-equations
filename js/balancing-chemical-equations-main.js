// Copyright 2014-2020, University of Colorado Boulder

/**
 * Main entry point for the 'Balancing Chemical Equations' sim.
 */
define( require => {
  'use strict';

  // modules
  const GameScreen = require( 'BALANCING_CHEMICAL_EQUATIONS/game/GameScreen' );
  const IntroductionScreen = require( 'BALANCING_CHEMICAL_EQUATIONS/introduction/IntroductionScreen' );
  const Sim = require( 'JOIST/Sim' );
  const SimLauncher = require( 'JOIST/SimLauncher' );

  // strings
  const balancingChemicalEquationsTitleString = require( 'string!BALANCING_CHEMICAL_EQUATIONS/balancing-chemical-equations.title' );

  const simOptions = {
    credits: {
      leadDesign: 'Kelly Lancaster (Java), Yuen-ying Carpenter (HTML5)',
      softwareDevelopment: 'Chris Malley (PixelZoom, Inc.)',
      team: 'Julia Chamberlain, Patricia Loeblein, Emily B. Moore, Robert Parson, Ariel Paul, Kathy Perkins, Amy Rouinfar',
      qualityAssurance: 'Steele Dalton, Bryce Griebenow, Elise Morgan, Liam Mulhall, Oliver Orejola, Laura Rae, Benjamin Roberts, Jacob Romero, Kathryn Woessner, Kelly Wurtz, Bryan Yoelin',
      thanks: '\u2022 Conversion of this simulation to HTML5 was funded in part by the American Association of Chemistry Teachers (AACT).<br>' +
              '\u2022 Thanks to Mobile Learner Labs for working with the PhET development team to convert this simulation to HTML5.'
    }
  };

  SimLauncher.launch( () => {
    const screens = [
      new IntroductionScreen(),
      new GameScreen()
    ];
    new Sim( balancingChemicalEquationsTitleString, screens, simOptions ).start();
  } );
} );