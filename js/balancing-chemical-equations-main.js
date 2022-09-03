// Copyright 2014-2022, University of Colorado Boulder

/**
 * Main entry point for the 'Balancing Chemical Equations' sim.
 */

import Sim from '../../joist/js/Sim.js';
import simLauncher from '../../joist/js/simLauncher.js';
import balancingChemicalEquationsStrings from './balancingChemicalEquationsStrings.js';
import GameScreen from './game/GameScreen.js';
import IntroductionScreen from './introduction/IntroductionScreen.js';

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

simLauncher.launch( () => {
  const screens = [
    new IntroductionScreen(),
    new GameScreen()
  ];
  new Sim( balancingChemicalEquationsStrings[ 'balancing-chemical-equations' ].titleStringProperty, screens, simOptions ).start();
} );