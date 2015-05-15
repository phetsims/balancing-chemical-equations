// Copyright 2002-2014, University of Colorado Boulder

/*
 * RequireJS configuration file for the 'Balancing Chemical Equations' sim.
 * Paths are relative to the location of this file.
 */
require.config( {

  deps: [ 'balancing-chemical-equations-main' ],

  paths: {

    // plugins
    audio: '../../chipper/js/requirejs-plugins/audio',
    image: '../../chipper/js/requirejs-plugins/image',
    string: '../../chipper/js/requirejs-plugins/string',

    text: '../../sherpa/lib/text-2.0.12',

    // PhET libs, uppercase names to identify them in require.js imports
    AXON: '../../axon/js',
    BRAND: '../../brand/js',
    DOT: '../../dot/js',
    JOIST: '../../joist/js',
    KITE: '../../kite/js',
    NITROGLYCERIN: '../../nitroglycerin/js',
    PHETCOMMON: '../../phetcommon/js',
    REPOSITORY: '..',
    PHET_CORE: '../../phet-core/js',
    SCENERY: '../../scenery/js',
    SCENERY_PHET: '../../scenery-phet/js',
    SHERPA: '../../sherpa',
    SUN: '../../sun/js',
    VEGAS: '../../vegas/js',
    VIBE: '../../vibe/js',
    // sim code
    BALANCING_CHEMICAL_EQUATIONS: '.'
  },

  // optional cache buster to make browser refresh load all included scripts, can be disabled with ?cacheBuster=false
  urlArgs: phet.chipper.getCacheBusterArgs()
} );
