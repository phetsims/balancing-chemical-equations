// Copyright 2014-2023, University of Colorado Boulder

/**
 * The 'Game' Screen
 *
 * @author Vasily Shakhov (mlearner.com)
 */

import Screen, { ScreenOptions } from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import { Shape } from '../../../kite/js/imports.js';
import FaceNode from '../../../scenery-phet/js/FaceNode.js';
import { Node, Path, Rectangle } from '../../../scenery/js/imports.js';
import Tandem from '../../../tandem/js/Tandem.js';
import balancingChemicalEquations from '../balancingChemicalEquations.js';
import BalancingChemicalEquationsStrings from '../BalancingChemicalEquationsStrings.js';
import GameModel from './model/GameModel.js';
import GameScreenView from './view/GameScreenView.js';
import BCEColors from '../common/BCEColors.js';

export default class GameScreen extends Screen<GameModel, GameScreenView> {

  public constructor( tandem: Tandem ) {

    const options: ScreenOptions = {
      name: BalancingChemicalEquationsStrings.screen.gameStringProperty,
      backgroundColorProperty: BCEColors.gameScreenBackgroundColorProperty,
      homeScreenIcon: createScreenIcon(),
      tandem: tandem
    };

    super(
      () => new GameModel( tandem.createTandem( 'model' ) ),
      model => new GameScreenView( model, tandem.createTandem( 'view' ) ),
      options
    );
  }
}

/**
 * Creates the icon for this screen: a smiley face to the right of up/down arrows.
 */
function createScreenIcon(): ScreenIcon {

  // constants
  const faceDiameter = 200;
  const arrowXSpacing = 25;
  const arrowYSpacing = 10;

  // background rectangle
  const width = Screen.MINIMUM_HOME_SCREEN_ICON_SIZE.width;
  const height = Screen.MINIMUM_HOME_SCREEN_ICON_SIZE.height;
  const background = new Rectangle( 0, 0, width, height, { fill: 'white' } );

  // face
  const faceNode = new FaceNode( faceDiameter, { headStroke: 'black', headLineWidth: 4 } );

  // up/down arrows
  const arrowOptions = { fill: 'black' };
  const arrowSize = 0.4 * ( faceNode.height - arrowYSpacing );
  const upArrowNode = new Path( new Shape().moveTo( 0, 0 ).lineTo( arrowSize / 2, arrowSize ).lineTo( -arrowSize / 2, arrowSize ).close(), arrowOptions );
  const downArrowNode = new Path( new Shape().moveTo( 0, 0 ).lineTo( arrowSize / 2, -arrowSize ).lineTo( -arrowSize / 2, -arrowSize ).close(), arrowOptions );

  // layout, arrows to left of face
  upArrowNode.right = faceNode.left - arrowXSpacing;
  upArrowNode.bottom = faceNode.centerY - arrowYSpacing;
  downArrowNode.right = faceNode.left - arrowXSpacing;
  downArrowNode.top = faceNode.centerY + arrowYSpacing;

  // scale to fit, center in background
  const contentNode = new Node( { children: [ faceNode, upArrowNode, downArrowNode ] } );
  contentNode.setScaleMagnitude( Math.min( 0.82 * background.width / contentNode.width, 0.82 * background.height / contentNode.height ) );
  contentNode.center = background.center;

  const iconNode = new Node( { children: [ background, contentNode ] } );

  return new ScreenIcon( iconNode, {
    maxIconWidthProportion: 1,
    maxIconHeightProportion: 1
  } );
}

balancingChemicalEquations.register( 'GameScreen', GameScreen );