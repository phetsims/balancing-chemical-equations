// Copyright 2002-2014, University of Colorado Boulder

/**
 * The 'Game' Screen
 *
 * @author Vasily Shakhov (mlearner.com)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var GameModel = require( 'BALANCING_CHEMICAL_EQUATIONS/game/model/GameModel' );
  var GameView = require( 'BALANCING_CHEMICAL_EQUATIONS/game/view/GameView' );
  var BCEConstants = require( 'BALANCING_CHEMICAL_EQUATIONS/common/BCEConstants' );
  var Screen = require( 'JOIST/Screen' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );
  var FaceNode = require( 'SCENERY_PHET/FaceNode' );

  // strings
  var balancingGameTitleString = require( 'string!BALANCING_CHEMICAL_EQUATIONS/balancingGame' );

  // creates the icon for this screen
  var createScreenIcon = function() {

    // constants
    var faceDiameter = 200;
    var arrowXSpacing = 25;
    var arrowYSpacing = 10;

    // background rectangle
    var width = Screen.HOME_SCREEN_ICON_SIZE.width;
    var height = Screen.HOME_SCREEN_ICON_SIZE.height;
    var background = new Rectangle( 0, 0, width, height, { fill: 'white' } );

    // face
    var faceNode = new FaceNode( faceDiameter, { headStroke: 'black', headLineWidth: 4 } );

    // up/down arrows
    var arrowOptions = { fill: 'black' };
    var arrowSize = 0.4 * ( faceNode.height - arrowYSpacing );
    var upArrowNode = new Path( new Shape().moveTo( 0, 0 ).lineTo( arrowSize / 2, arrowSize ).lineTo( -arrowSize / 2, arrowSize ).close(), arrowOptions );
    var downArrowNode = new Path( new Shape().moveTo( 0, 0 ).lineTo( arrowSize / 2, -arrowSize ).lineTo( -arrowSize / 2, -arrowSize ).close(), arrowOptions );

    // layout, arrows to left of face
    upArrowNode.right = faceNode.left - arrowXSpacing;
    upArrowNode.bottom = faceNode.centerY - arrowYSpacing;
    downArrowNode.right = faceNode.left - arrowXSpacing;
    downArrowNode.top = faceNode.centerY + arrowYSpacing;

    // scale to fit, center in background
    var contentNode = new Node( { children: [ faceNode, upArrowNode, downArrowNode ] } );
    contentNode.setScaleMagnitude( Math.min( 0.82 * background.width / contentNode.width, 0.82 * background.height / contentNode.height ) );
    contentNode.center = background.center;
    return new Node( { children: [ background, contentNode ] } );
  };

  /**
   * @constructor
   */
  function IntroductionScreen() {
    Screen.call( this,
      balancingGameTitleString,
      createScreenIcon(),
      function() { return new GameModel( ScreenView.DEFAULT_LAYOUT_BOUNDS.width, ScreenView.DEFAULT_LAYOUT_BOUNDS.height ); },
      function( model ) { return new GameView( model ); },
      {
        backgroundColor: BCEConstants.GAME_CANVAS_BACKGROUND
      }
    );
  }

  return inherit( Screen, IntroductionScreen );
} );