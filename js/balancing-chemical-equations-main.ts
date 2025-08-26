// Copyright 2014-2025, University of Colorado Boulder

/**
 * Main entry point for the 'Balancing Chemical Equations' sim.
 *
 * @author Vasily Shakhov (MLearner)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import PreferencesModel from '../../joist/js/preferences/PreferencesModel.js';
import Sim from '../../joist/js/Sim.js';
import simLauncher from '../../joist/js/simLauncher.js';
import Tandem from '../../tandem/js/Tandem.js';
import BalancingChemicalEquationsStrings from './BalancingChemicalEquationsStrings.js';
import BCEPreferences from './common/model/BCEPreferences.js';
import BCEPreferencesNode from './common/view/BCEPreferencesNode.js';
import EquationsScreen from './equations/EquationsScreen.js';
import GameScreen from './game/GameScreen.js';
import IntroScreen from './intro/IntroScreen.js';

simLauncher.launch( () => {

  const titleStringProperty = BalancingChemicalEquationsStrings[ 'balancing-chemical-equations' ].titleStringProperty;

  const screens = [
    new IntroScreen( Tandem.ROOT.createTandem( 'introScreen' ) ),
    new EquationsScreen( Tandem.ROOT.createTandem( 'equationsScreen' ) ),
    new GameScreen( Tandem.ROOT.createTandem( 'gameScreen' ) )
  ];

  const sim = new Sim( titleStringProperty, screens, {

    // Credits
    credits: {
      leadDesign: 'Kelly Lancaster (Java), Yuen-ying Carpenter (HTML5)',
      softwareDevelopment: 'Chris Malley (PixelZoom, Inc.)',
      team: 'Julia Chamberlain, Patricia Loeblein, Emily B. Moore, Robert Parson, Ariel Paul, Kathy Perkins, Amy Rouinfar, Nancy Salpepi',
      qualityAssurance: 'Steele Dalton, Bryce Griebenow, Matthew Moore, Elise Morgan, Ashton Morris, Liam Mulhall, Oliver Orejola, ' +
                        'Valentina P\u00e9rez, Laura Rae, Benjamin Roberts, Jacob Romero, Kathryn Woessner, Kelly Wurtz, Bryan Yoelin',
      thanks: '\u2022 Conversion of this simulation to HTML5 was funded in part by the American Association of Chemistry Teachers (AACT).<br>' +
              '\u2022 Thanks to Mobile Learner Labs for working with the PhET development team to convert this simulation to HTML5.'
    },

    // Preferences
    preferencesModel: new PreferencesModel( {
      simulationOptions: {
        customPreferences: [ {
          createContent: tandem => new BCEPreferencesNode( BCEPreferences.instance, tandem )
        } ]
      }
    } ),

    phetioDesigned: true
  } );

  sim.start();
} );