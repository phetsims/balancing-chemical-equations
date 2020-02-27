// Copyright 2014-2020, University of Colorado Boulder

/**
 * Controls for selecting a level and adjusting various game settings, such as whether the timer is enabled
 *
 * @author Vasily Shakhov (mlearner.com)
 */
define( require => {
  'use strict';

  // modules
  const balancingChemicalEquations = require( 'BALANCING_CHEMICAL_EQUATIONS/balancingChemicalEquations' );
  const BCEConstants = require( 'BALANCING_CHEMICAL_EQUATIONS/common/BCEConstants' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const LevelSelectionButton = require( 'VEGAS/LevelSelectionButton' );
  const merge = require( 'PHET_CORE/merge' );
  const MoleculeFactory = require( 'BALANCING_CHEMICAL_EQUATIONS/common/model/MoleculeFactory' );
  const Node = require( 'SCENERY/nodes/Node' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  const ScoreDisplayStars = require( 'VEGAS/ScoreDisplayStars' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const Text = require( 'SCENERY/nodes/Text' );
  const TimerToggleButton = require( 'SCENERY_PHET/buttons/TimerToggleButton' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  // images, ordered by level
  const levelImagesConstructors = [
    MoleculeFactory.HCl().nodeConstructor,
    MoleculeFactory.H2O().nodeConstructor,
    MoleculeFactory.NH3().nodeConstructor
  ];

  // strings
  const chooseYourLevelString = require( 'string!BALANCING_CHEMICAL_EQUATIONS/chooseYourLevel' );
  const pattern0LevelString = require( 'string!BALANCING_CHEMICAL_EQUATIONS/pattern_0level' );

  // constants
  const BUTTON_MARGIN = 20;

  class LevelSelectionNode extends Node {

    /**
     * @param {GameModel} model
     * @param {GameViewProperties} viewProperties
     * @param {Bounds2} layoutBounds
     * @param {function(number:level)} startGame
     * @param {Object} [options]
     */
    constructor( model, viewProperties, layoutBounds, startGame, options ) {

      super();

      // buttons
      const buttons = [];
      for ( let level = model.LEVELS_RANGE.min; level <= model.LEVELS_RANGE.max; level++ ) {
        buttons.push( createLevelSelectionButton( level, model, viewProperties.timerEnabledProperty, startGame ) );
      }
      const buttonsParent = new HBox( {
        children: buttons,
        spacing: 50,
        resize: false,
        center: layoutBounds.center
      } );
      this.addChild( buttonsParent );

      // title
      const title = new Text( chooseYourLevelString, {
        font: new PhetFont( 36 ),
        centerX: layoutBounds.centerX,
        centerY: buttonsParent.top / 2,
        maxWidth: 0.85 * layoutBounds.width // constrain width for i18n
      } );
      this.addChild( title );

      // timer control, lower left
      const toggleOptions = { stroke: 'black', cornerRadius: 10 };
      const timerToggleButton = new TimerToggleButton( viewProperties.timerEnabledProperty, merge( toggleOptions, {
        x: BUTTON_MARGIN,
        bottom: layoutBounds.bottom - BUTTON_MARGIN
      } ) );
      this.addChild( timerToggleButton );

      // Reset All button, lower right
      const resetButton = new ResetAllButton( {
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

    // No dispose needed, instances of this type persist for lifetime of the sim.
  }

  /**
   * Creates a level selection button
   *
   * @param {number} level
   * @param {GameModel} model
   * @param {Property.<number>} bestTimeVisibleProperty
   * @param {function(number:level)} startGame
   * @returns {LevelSelectionButton}
   */
  function createLevelSelectionButton( level, model, bestTimeVisibleProperty, startGame ) {

    // 'Level N' centered above icon
    const image = new levelImagesConstructors[ level ]( merge( { scale: 2 }, BCEConstants.ATOM_OPTIONS ) );
    const label = new Text( StringUtils.format( pattern0LevelString, level + 1 ), {
      font: new PhetFont( { size: 14, weight: 'bold' } ),
      maxWidth: image.width
    } );
    const icon = new VBox( { children: [ label, image ], spacing: 10 } );

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
  }

  return balancingChemicalEquations.register( 'LevelSelectionNode', LevelSelectionNode );
} );

