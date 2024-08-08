// Copyright 2014-2024, University of Colorado Boulder

/**
 * Main entry point for the 'Balancing Chemical Equations' sim.
 *
 * @author Vasily Shakhov (MLearner)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Sim from '../../joist/js/Sim.js';
import simLauncher from '../../joist/js/simLauncher.js';
import Tandem from '../../tandem/js/Tandem.js';
import BalancingChemicalEquationsStrings from './BalancingChemicalEquationsStrings.js';
import GameScreen from './game/GameScreen.js';
import IntroScreen from './intro/IntroScreen.js';

simLauncher.launch( () => {

  const sim = new Sim( BalancingChemicalEquationsStrings[ 'balancing-chemical-equations' ].titleStringProperty, [
    new IntroScreen( Tandem.ROOT.createTandem( 'introScreen' ) ),
    new GameScreen( Tandem.ROOT.createTandem( 'gameScreen' ) )
  ], {
    credits: {
      leadDesign: 'Kelly Lancaster (Java), Yuen-ying Carpenter (HTML5)',
      softwareDevelopment: 'Chris Malley (PixelZoom, Inc.)',
      team: 'Julia Chamberlain, Patricia Loeblein, Emily B. Moore, Robert Parson, Ariel Paul, Kathy Perkins, Amy Rouinfar',
      qualityAssurance: 'Steele Dalton, Bryce Griebenow, Elise Morgan, Liam Mulhall, Oliver Orejola, Laura Rae, Benjamin Roberts, Jacob Romero, Kathryn Woessner, Kelly Wurtz, Bryan Yoelin',
      thanks: '\u2022 Conversion of this simulation to HTML5 was funded in part by the American Association of Chemistry Teachers (AACT).<br>' +
              '\u2022 Thanks to Mobile Learner Labs for working with the PhET development team to convert this simulation to HTML5.'
    }
  } );

  sim.start();
} );