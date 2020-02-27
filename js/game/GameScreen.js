// Copyright 2014-2020, University of Colorado Boulder

/**
 * The 'Game' Screen
 *
 * @author Vasily Shakhov (mlearner.com)
 */
define( require => {
  'use strict';

  // modules
  const balancingChemicalEquations = require( 'BALANCING_CHEMICAL_EQUATIONS/balancingChemicalEquations' );
  const BCEConstants = require( 'BALANCING_CHEMICAL_EQUATIONS/common/BCEConstants' );
  const FaceNode = require( 'SCENERY_PHET/FaceNode' );
  const GameModel = require( 'BALANCING_CHEMICAL_EQUATIONS/game/model/GameModel' );
  const GameScreenView = require( 'BALANCING_CHEMICAL_EQUATIONS/game/view/GameScreenView' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Path = require( 'SCENERY/nodes/Path' );
  const Property = require( 'AXON/Property' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const Screen = require( 'JOIST/Screen' );
  const Shape = require( 'KITE/Shape' );

  // strings
  const screenGameString = require( 'string!BALANCING_CHEMICAL_EQUATIONS/screen.game' );

  class GameScreen extends Screen {

    constructor() {

      const options = {
        name: screenGameString,
        backgroundColorProperty: new Property( BCEConstants.GAME_CANVAS_BACKGROUND ),
        homeScreenIcon: createScreenIcon()
      };

      super(
        () => new GameModel(),
        model => new GameScreenView( model ),
        options
      );
    }
  }

  // creates the icon for this screen: a smiley face to the right of up/down arrows
  function createScreenIcon() {

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
    return new Node( { children: [ background, contentNode ] } );
  }

  return balancingChemicalEquations.register( 'GameScreen', GameScreen );
} );