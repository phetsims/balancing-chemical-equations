// Copyright 2014-2023, University of Colorado Boulder

/**
 * Controls for selecting a level and adjusting various game settings, such as whether the timer is enabled
 *
 * @author Vasily Shakhov (mlearner.com)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import TimerToggleButton from '../../../../scenery-phet/js/buttons/TimerToggleButton.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { AlignBox, AlignGroup, Node, Text, VBox } from '../../../../scenery/js/imports.js';
import LevelSelectionButtonGroup from '../../../../vegas/js/LevelSelectionButtonGroup.js';
import ScoreDisplayStars from '../../../../vegas/js/ScoreDisplayStars.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import BalancingChemicalEquationsStrings from '../../BalancingChemicalEquationsStrings.js';
import BCEConstants from '../../common/BCEConstants.js';
import Molecule from '../../common/model/Molecule.js';

// Molecules that appear on level-selection buttons, ordered by level number
const levelMolecules = [ Molecule.HCl, Molecule.H2O, Molecule.NH3 ];

// constants
const BUTTON_MARGIN = 20;

export default class LevelSelectionNode extends Node {

  /**
   * @param {GameModel} model
   * @param {GameViewProperties} viewProperties
   * @param {Bounds2} layoutBounds
   * @param {function(number:level)} startGame
   * @param {Object} [options]
   */
  constructor( model, viewProperties, layoutBounds, startGame, options ) {

    super();

    // To give all molecules the same effective size
    const moleculeAlignGroup = new AlignGroup();

    const buttonItems = [];
    for ( let level = model.LEVELS_RANGE.min; level <= model.LEVELS_RANGE.max; level++ ) {
      buttonItems.push( {
        icon: createLevelSelectionButtonIcon( level, moleculeAlignGroup ),
        scoreProperty: model.bestScoreProperties[ level ],
        options: {
          bestTimeProperty: model.bestTimeProperties[ level ],
          createScoreDisplay: scoreProperty => new ScoreDisplayStars( scoreProperty, {
            numberOfStars: model.getNumberOfEquations( level ),
            perfectScore: model.getPerfectScore( level )
          } ),
          listener: () => startGame( level ),
          soundPlayerIndex: level
        }
      } );
    }
    const buttonGroup = new LevelSelectionButtonGroup( buttonItems, {
      levelSelectionButtonOptions: {
        baseColor: '#d9ebff',
        buttonWidth: 155,
        buttonHeight: 155,
        bestTimeVisibleProperty: viewProperties.timerEnabledProperty
      },
      flowBoxOptions: {
        spacing: 50,
        center: layoutBounds.center
      }
    } );
    this.addChild( buttonGroup );

    // title
    const title = new Text( BalancingChemicalEquationsStrings.chooseYourLevelStringProperty, {
      font: new PhetFont( 36 ),
      centerX: layoutBounds.centerX,
      centerY: buttonGroup.top / 2,
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
 * Creates the icon for a level-selection button.
 * @param {number} level
 * @param {AlignGroup} moleculeAlignGroup - to give all molecules the same effective size
 * @returns {Node}
 */
function createLevelSelectionButtonIcon( level, moleculeAlignGroup ) {

  const labelStringProperty = new DerivedProperty(
    [ BalancingChemicalEquationsStrings.pattern_0levelStringProperty ],
    pattern => StringUtils.format( pattern, level + 1 )
  );

  const labelText = new Text( labelStringProperty, {
    font: new PhetFont( { size: 14, weight: 'bold' } ),
    maxWidth: 100
  } );

  const moleculeNode = levelMolecules[ level ].createNode( merge( { scale: 2 }, BCEConstants.ATOM_OPTIONS ) );
  const alignBox = new AlignBox( moleculeNode, {
    group: moleculeAlignGroup
  } );

  // 'Level N' centered above molecule
  return new VBox( {
    spacing: 10,
    children: [ labelText, alignBox ]
  } );
}

balancingChemicalEquations.register( 'LevelSelectionNode', LevelSelectionNode );