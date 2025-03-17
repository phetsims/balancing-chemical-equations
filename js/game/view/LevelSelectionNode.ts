// Copyright 2014-2025, University of Colorado Boulder

/**
 * LevelSelectionNode is user-interface for selecting a level and adjusting various game controls.
 *
 * @author Vasily Shakhov (mlearner.com)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import TimerToggleButton from '../../../../scenery-phet/js/buttons/TimerToggleButton.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import AlignGroup from '../../../../scenery/js/layout/constraints/AlignGroup.js';
import AlignBox from '../../../../scenery/js/layout/nodes/AlignBox.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import LevelSelectionButtonGroup, { LevelSelectionButtonGroupItem } from '../../../../vegas/js/LevelSelectionButtonGroup.js';
import ScoreDisplayStars from '../../../../vegas/js/ScoreDisplayStars.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import BalancingChemicalEquationsStrings from '../../BalancingChemicalEquationsStrings.js';
import BCEQueryParameters from '../../common/BCEQueryParameters.js';
import GameModel from '../model/GameModel.js';
import GameViewProperties from './GameViewProperties.js';
import GameLevel from '../model/GameLevel.js';

const BUTTON_MARGIN = 20;
const BUTTON_FONT = new PhetFont( { size: 14, weight: 'bold' } );

export default class LevelSelectionNode extends Node {

  public constructor( model: GameModel, viewProperties: GameViewProperties, layoutBounds: Bounds2, tandem: Tandem ) {

    // To give all molecules the same effective size
    const moleculeAlignGroup = new AlignGroup();

    const buttonItems: LevelSelectionButtonGroupItem[] = [];
    model.levels.forEach( level => {
      buttonItems.push( {
        icon: createLevelSelectionButtonIcon( level, moleculeAlignGroup ),
        scoreProperty: level.bestScoreProperty,
        options: {
          createScoreDisplay: scoreProperty => new ScoreDisplayStars( scoreProperty, {
            numberOfStars: level.getNumberOfChallenges(),
            perfectScore: level.getPerfectScore()
          } ),
          listener: () => {
            model.levelProperty.value = level;
          },
          soundPlayerIndex: level.levelNumber
        }
      } );
    } );

    const buttonGroup = new LevelSelectionButtonGroup( buttonItems, {
      levelSelectionButtonOptions: {
        baseColor: '#d9ebff'
      },
      flowBoxOptions: {
        spacing: 50,
        center: layoutBounds.center
      },
      groupButtonHeight: 155,
      groupButtonWidth: 155,
      gameLevels: BCEQueryParameters.gameLevels,
      tandem: tandem.createTandem( 'buttonGroup' ),
      phetioVisiblePropertyInstrumented: false
    } );

    buttonGroup.localBoundsProperty.link( () => {
      buttonGroup.center = layoutBounds.center;
    } );

    // 'Choose Your Level' title
    const chooseYourLevelText = new Text( BalancingChemicalEquationsStrings.chooseYourLevelStringProperty, {
      font: new PhetFont( 36 ),
      maxWidth: 0.8 * layoutBounds.width, // constrain width for i18n
      tandem: tandem.createTandem( 'chooseYourLevelText' ),
      phetioVisiblePropertyInstrumented: true
    } );

    // Keep the title centered above the buttons.
    // Only centerX needs to be set dynamically, as the length of the title changes.
    chooseYourLevelText.centerY = buttonGroup.top / 2;
    chooseYourLevelText.localBoundsProperty.link( () => {
      chooseYourLevelText.centerX = layoutBounds.centerX;
    } );

    // Timer control, lower left
    const timerToggleButton = new TimerToggleButton( model.timerEnabledProperty, {
      stroke: 'black',
      cornerRadius: 10,
      x: BUTTON_MARGIN,
      bottom: layoutBounds.bottom - BUTTON_MARGIN,
      tandem: tandem.createTandem( 'timerToggleButton' )
    } );

    // Reset All button, lower right
    const resetAllButton = new ResetAllButton( {
      listener: () => {
        this.interruptSubtreeInput();
        model.reset();
        viewProperties.reset();
      },
      right: layoutBounds.right - BUTTON_MARGIN,
      bottom: layoutBounds.bottom - BUTTON_MARGIN,
      tandem: tandem.createTandem( 'resetAllButton' )
    } );

    super( {
      isDisposable: false,
      children: [ buttonGroup, chooseYourLevelText, timerToggleButton, resetAllButton ],
      tandem: tandem,
      phetioVisiblePropertyInstrumented: false
    } );
  }
}

/**
 * Creates the icon for a level-selection button.
 * @param level
 * @param moleculeAlignGroup - to give all molecules the same effective size
 */
function createLevelSelectionButtonIcon( level: GameLevel, moleculeAlignGroup: AlignGroup ): Node {

  const labelStringProperty = new DerivedStringProperty(
    [ BalancingChemicalEquationsStrings.pattern_0levelStringProperty ],
    pattern => StringUtils.format( pattern, level.levelNumber )
  );

  const labelText = new Text( labelStringProperty, {
    font: BUTTON_FONT,
    maxWidth: 100
  } );

  const alignBox = new AlignBox( level.icon, {
    group: moleculeAlignGroup
  } );

  // 'Level N' centered above molecule
  return new VBox( {
    spacing: 10,
    children: [ labelText, alignBox ]
  } );
}

balancingChemicalEquations.register( 'LevelSelectionNode', LevelSelectionNode );