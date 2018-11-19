// Copyright 2014-2018, University of Colorado Boulder

/**
 * Controls for selecting a level and adjusting various game settings (sound, timer, ...)
 *
 * @author Vasily Shakhov (mlearner.com)
 */
define( function( require ) {
  'use strict';

  // modules
  var balancingChemicalEquations = require( 'BALANCING_CHEMICAL_EQUATIONS/balancingChemicalEquations' );
  var BCEConstants = require( 'BALANCING_CHEMICAL_EQUATIONS/common/BCEConstants' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LevelSelectionButton = require( 'VEGAS/LevelSelectionButton' );
  var MoleculeFactory = require( 'BALANCING_CHEMICAL_EQUATIONS/common/model/MoleculeFactory' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var ScoreDisplayStars = require( 'VEGAS/ScoreDisplayStars' );
  var SoundToggleButton = require( 'SCENERY_PHET/buttons/SoundToggleButton' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var TimerToggleButton = require( 'SCENERY_PHET/buttons/TimerToggleButton' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // images, ordered by level
  var levelImagesConstructors = [
    MoleculeFactory.HCl().nodeConstructor,
    MoleculeFactory.H2O().nodeConstructor,
    MoleculeFactory.NH3().nodeConstructor
  ];

  // strings
  var chooseYourLevelString = require( 'string!BALANCING_CHEMICAL_EQUATIONS/chooseYourLevel' );
  var pattern0LevelString = require( 'string!BALANCING_CHEMICAL_EQUATIONS/pattern_0level' );

  // constants
  var BUTTON_MARGIN = 20;

  /**
   * @param {GameModel} model
   * @param {GameViewProperties} viewProperties
   * @param {Bounds2} layoutBounds
   * @param {function(number:level)} startGame
   * @param {Object} [options]
   * @constructor
   */
  function LevelSelectionNode( model, viewProperties, layoutBounds, startGame, options ) {

    Node.call( this );

    // buttons
    var buttons = [];
    for ( var level = model.LEVELS_RANGE.min; level <= model.LEVELS_RANGE.max; level++ ) {
      buttons.push( createLevelSelectionButton( level, model, viewProperties.timerEnabledProperty, startGame ) );
    }
    var buttonsParent = new HBox( {
      children: buttons,
      spacing: 50,
      resize: false,
      center: layoutBounds.center
    } );
    this.addChild( buttonsParent );

    // title
    var title = new Text( chooseYourLevelString, {
      font: new PhetFont( 36 ),
      centerX: layoutBounds.centerX,
      centerY: buttonsParent.top / 2,
      maxWidth: 0.85 * layoutBounds.width // constrain width for i18n
    } );
    this.addChild( title );

    // Timer and Sound controls, lower left
    var toggleOptions = { stroke: 'black', cornerRadius: 10 };
    var soundToggleButton = new SoundToggleButton( viewProperties.soundEnabledProperty, _.extend( toggleOptions, {
      x: BUTTON_MARGIN,
      bottom: layoutBounds.bottom - BUTTON_MARGIN
    } ) );
    this.addChild( soundToggleButton );
    var timerToggleButton = new TimerToggleButton( viewProperties.timerEnabledProperty, _.extend( toggleOptions, {
      x: BUTTON_MARGIN,
      bottom: soundToggleButton.top - BUTTON_MARGIN / 2
    } ) );
    this.addChild( timerToggleButton );

    // Reset All button, lower right
    var resetButton = new ResetAllButton( {
      listener: function() {
        model.reset();
        viewProperties.reset();
      },
      right: layoutBounds.right - BUTTON_MARGIN,
      bottom: layoutBounds.bottom - BUTTON_MARGIN
    } );
    this.addChild( resetButton );

    this.mutate( options );
  }

  balancingChemicalEquations.register( 'LevelSelectionNode', LevelSelectionNode );

  /**
   * Creates a level selection button
   *
   * @param {number} level
   * @param {GameModel} model
   * @param {Property.<number>} bestTimeVisibleProperty
   * @param {function(number:level)} startGame
   * @returns {LevelSelectionButton}
   */
  var createLevelSelectionButton = function( level, model, bestTimeVisibleProperty, startGame ) {

    // 'Level N' centered above icon
    var image = new levelImagesConstructors[ level ]( _.extend( { scale: 2 }, BCEConstants.ATOM_OPTIONS ) );
    var label = new Text( StringUtils.format( pattern0LevelString, level + 1 ), {
      font: new PhetFont( { size: 14, weight: 'bold' } ),
      maxWidth: image.width
    } );
    var icon = new VBox( { children: [ label, image ], spacing: 10 } );

    return new LevelSelectionButton( icon, model.bestScoreProperties[ level ], {
      baseColor: '#d9ebff',
      buttonWidth: 155,
      buttonHeight: 155,
      bestTimeProperty: model.bestTimeProperties[ level ],
      bestTimeVisibleProperty: bestTimeVisibleProperty,
      scoreDisplayConstructor: ScoreDisplayStars,
      scoreDisplayOptions: {
        numberOfStars: model.getNumberOfEquations( level ),
        perfectScore: model.getPerfectScore( level )
      },
      listener: function() {
        startGame( level );
      }
    } );
  };

  return inherit( Node, LevelSelectionNode, {

    // No dispose needed, instances of this type persist for lifetime of the sim.
  } );
} );

