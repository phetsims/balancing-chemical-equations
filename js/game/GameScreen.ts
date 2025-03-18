// Copyright 2014-2025, University of Colorado Boulder

/**
 * GameScreen is the 'Game' screen.
 *
 * @author Vasily Shakhov (mlearner.com)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Screen, { ScreenOptions } from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import Shape from '../../../kite/js/Shape.js';
import FaceNode from '../../../scenery-phet/js/FaceNode.js';
import Node from '../../../scenery/js/nodes/Node.js';
import Path from '../../../scenery/js/nodes/Path.js';
import Rectangle from '../../../scenery/js/nodes/Rectangle.js';
import Tandem from '../../../tandem/js/Tandem.js';
import balancingChemicalEquations from '../balancingChemicalEquations.js';
import BalancingChemicalEquationsStrings from '../BalancingChemicalEquationsStrings.js';
import BCEColors from '../common/BCEColors.js';
import GameModel from './model/GameModel.js';
import GameScreenView from './view/GameScreenView.js';
import VBox from '../../../scenery/js/layout/nodes/VBox.js';
import HBox from '../../../scenery/js/layout/nodes/HBox.js';

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

  const arrowLength = 75;
  const faceDiameter = 200;

  // background rectangle
  const width = Screen.MINIMUM_HOME_SCREEN_ICON_SIZE.width;
  const height = Screen.MINIMUM_HOME_SCREEN_ICON_SIZE.height;
  const background = new Rectangle( 0, 0, width, height, { fill: 'white' } );

  // up/down arrows
  const arrowOptions = { fill: 'black' };
  const arrowsNode = new VBox( {
    spacing: 20,
    children: [
      new Path( new Shape().moveTo( 0, 0 ).lineTo( arrowLength / 2, arrowLength ).lineTo( -arrowLength / 2, arrowLength ).close(), arrowOptions ),
      new Path( new Shape().moveTo( 0, 0 ).lineTo( arrowLength / 2, -arrowLength ).lineTo( -arrowLength / 2, -arrowLength ).close(), arrowOptions )
    ]
  } );

  // smiley face
  const faceNode = new FaceNode( faceDiameter, {
    headStroke: 'black',
    headLineWidth: 4
  } );

  const contentNode = new HBox( {
    spacing: 25,
    children: [ arrowsNode, faceNode ]
  } );

  // scale to fit, center in background
  contentNode.setScaleMagnitude( Math.min( 0.82 * background.width / contentNode.width, 0.82 * background.height / contentNode.height ) );
  contentNode.center = background.center;

  const iconNode = new Node( {
    children: [ background, contentNode ]
  } );

  return new ScreenIcon( iconNode, {
    maxIconWidthProportion: 1,
    maxIconHeightProportion: 1
  } );
}

balancingChemicalEquations.register( 'GameScreen', GameScreen );