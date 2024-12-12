// Copyright 2014-2024, University of Colorado Boulder

/**
 * Controls for selecting a level and adjusting various game settings, such as whether the timer is enabled
 *
 * @author Vasily Shakhov (mlearner.com)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import { AtomNodeOptions } from '../../../../nitroglycerin/js/nodes/AtomNode.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import TimerToggleButton from '../../../../scenery-phet/js/buttons/TimerToggleButton.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { AlignBox, AlignGroup, Node, Text, VBox } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import LevelSelectionButtonGroup, { LevelSelectionButtonGroupItem } from '../../../../vegas/js/LevelSelectionButtonGroup.js';
import ScoreDisplayStars from '../../../../vegas/js/ScoreDisplayStars.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import BalancingChemicalEquationsStrings from '../../BalancingChemicalEquationsStrings.js';
import BCEConstants from '../../common/BCEConstants.js';
import BCEQueryParameters from '../../common/BCEQueryParameters.js';
import Molecule from '../../common/model/Molecule.js';
import GameModel from '../model/GameModel.js';
import GameViewProperties from './GameViewProperties.js';

// Molecules that appear on level-selection buttons, ordered by level number
const levelMolecules = [ Molecule.HCl, Molecule.H2O, Molecule.NH3 ];

const BUTTON_MARGIN = 20;

export default class LevelSelectionNode extends Node {

  public constructor( model: GameModel, viewProperties: GameViewProperties, layoutBounds: Bounds2,
                      startGame: ( level: number ) => void, tandem: Tandem ) {

    // To give all molecules the same effective size
    const moleculeAlignGroup = new AlignGroup();

    const buttonItems: LevelSelectionButtonGroupItem[] = [];
    for ( let level = model.levelRange.min; level <= model.levelRange.max; level++ ) {
      buttonItems.push( {
        icon: createLevelSelectionButtonIcon( level, moleculeAlignGroup ),
        scoreProperty: model.bestScoreProperties[ level - 1 ],
        options: {
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
        baseColor: '#d9ebff'
      },
      flowBoxOptions: {
        spacing: 50,
        center: layoutBounds.center
      },
      groupButtonHeight: 155,
      groupButtonWidth: 155,
      gameLevels: BCEQueryParameters.gameLevels,
      tandem: tandem.createTandem( 'buttonGroup' )
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
    chooseYourLevelText.localBoundsProperty.link( () => {
      chooseYourLevelText.centerX = layoutBounds.centerX;

      // TODO: Replace isFinite() check with better support for Nodes with invisible content, https://github.com/phetsims/phet-io/issues/2003
      if ( buttonGroup.bounds.isFinite() ) {
        chooseYourLevelText.centerY = buttonGroup.top / 2;
      }
    } );

    // Timer control, lower left
    const timerToggleButton = new TimerToggleButton( viewProperties.timerEnabledProperty, {
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
      tandem: tandem
    } );
  }
}

/**
 * Creates the icon for a level-selection button.
 * @param level
 * @param moleculeAlignGroup - to give all molecules the same effective size
 */
function createLevelSelectionButtonIcon( level: number, moleculeAlignGroup: AlignGroup ): Node {

  const labelStringProperty = new DerivedStringProperty(
    [ BalancingChemicalEquationsStrings.pattern_0levelStringProperty ],
    pattern => StringUtils.format( pattern, level )
  );

  const labelText = new Text( labelStringProperty, {
    font: new PhetFont( { size: 14, weight: 'bold' } ),
    maxWidth: 100
  } );

  const moleculeNode = levelMolecules[ level - 1 ].createNode( combineOptions<AtomNodeOptions>( {
    scale: 2
  }, BCEConstants.ATOM_NODE_OPTIONS ) );
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