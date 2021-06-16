[object Promise]

/**
 * Controls for selecting a level and adjusting various game settings, such as whether the timer is enabled
 *
 * @author Vasily Shakhov (mlearner.com)
 */

import merge from '../../../../phet-core/js/merge.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import TimerToggleButton from '../../../../scenery-phet/js/buttons/TimerToggleButton.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import LevelSelectionButton from '../../../../vegas/js/LevelSelectionButton.js';
import ScoreDisplayStars from '../../../../vegas/js/ScoreDisplayStars.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import balancingChemicalEquationsStrings from '../../balancingChemicalEquationsStrings.js';
import BCEConstants from '../../common/BCEConstants.js';
import MoleculeFactory from '../../common/model/MoleculeFactory.js';

// images, ordered by level
const levelImagesConstructors = [
  MoleculeFactory.HCl().nodeConstructor,
  MoleculeFactory.H2O().nodeConstructor,
  MoleculeFactory.NH3().nodeConstructor
];

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
    const title = new Text( balancingChemicalEquationsStrings.chooseYourLevel, {
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
      listener: () => {
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
  const label = new Text( StringUtils.format( balancingChemicalEquationsStrings.pattern_0level, level + 1 ), {
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
    listener: () => startGame( level )
  } );
}

balancingChemicalEquations.register( 'LevelSelectionNode', LevelSelectionNode );
export default LevelSelectionNode;