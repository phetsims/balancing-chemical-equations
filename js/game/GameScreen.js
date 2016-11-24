// Copyright 2014-2015, University of Colorado Boulder

/**
 * The 'Game' Screen
 *
 * @author Vasily Shakhov (mlearner.com)
 */
define( function( require ) {
  'use strict';

  // modules
  var balancingChemicalEquations = require( 'BALANCING_CHEMICAL_EQUATIONS/balancingChemicalEquations' );
  var BCEConstants = require( 'BALANCING_CHEMICAL_EQUATIONS/common/BCEConstants' );
  var FaceNode = require( 'SCENERY_PHET/FaceNode' );
  var GameModel = require( 'BALANCING_CHEMICAL_EQUATIONS/game/model/GameModel' );
  var GameView = require( 'BALANCING_CHEMICAL_EQUATIONS/game/view/GameView' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Screen = require( 'JOIST/Screen' );
  var Shape = require( 'KITE/Shape' );
  var Property = require( 'AXON/Property' );
  var Color = require( 'SCENERY/util/Color' );

  // strings
  var screenGameString = require( 'string!BALANCING_CHEMICAL_EQUATIONS/screen.game' );

  /**
   * @constructor
   */
  function GameScreen() {

    var options = {
      name: screenGameString,
      backgroundColorProperty: new Property( Color.toColor( BCEConstants.GAME_CANVAS_BACKGROUND ) ),
      homeScreenIcon: createScreenIcon()
    };

    Screen.call( this,
      function() { return new GameModel(); },
      function( model ) { return new GameView( model ); },
      options );
  }

  balancingChemicalEquations.register( 'GameScreen', GameScreen );

  // creates the icon for this screen: a smiley face to the right of up/down arrows
  var createScreenIcon = function() {

    // constants
    var faceDiameter = 200;
    var arrowXSpacing = 25;
    var arrowYSpacing = 10;

    // background rectangle
    var width = Screen.MINIMUM_HOME_SCREEN_ICON_SIZE.width;
    var height = Screen.MINIMUM_HOME_SCREEN_ICON_SIZE.height;
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

  return inherit( Screen, GameScreen );
} );