// Copyright 2002-2014, University of Colorado Boulder

/**
 * Base class for all "popups" used in the Game to tell the user whether their guess is balanced or unbalanced.
 * These indicators look like a dialog (aka "popup").
 *
 * Author: Vasily Shakhov (mlearner.com)
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Shape = require( 'KITE/Shape' );
  var FaceNode = require( 'SCENERY_PHET/FaceNode' );
  var MovableDragHandler = require( 'SCENERY_PHET/input/MovableDragHandler' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var Property = require( 'AXON/Property' );
  var Vector2 = require( 'DOT/Vector2' );
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );


  //constants
  var FONT = new PhetFont( 18 );
  var FACE_DIAMETER = 75;

  /**
   * @param {Boolean} smile
   * @param {Function} createContentFunction function that creates the content of the dialog that will appear below the face node
   */
  var GamePopupNode = function( smile, createContentFunction ) {
    var self = this;

    Node.call( this, {cursor: 'pointer'} );

    //draggable
    var position = new Property( new Vector2( 0, 0 ) );
    var startPosition = null;
    this.addInputListener( new MovableDragHandler( { locationProperty: position }, ModelViewTransform2.createIdentity() ) );

    position.lazyLink( function() {
      if ( startPosition === null ) {
        startPosition = self.translation;
      }
      self.translation = startPosition.plus( position.get() );
    } );


    //background
    this.backgroundRect = new Rectangle( 0, 0, 0, 0, {
      fill: '#c1d8fe',
      stroke: 'black'
    } );
    this.addChild( this.backgroundRect );

    // face
    var faceNode = new FaceNode( FACE_DIAMETER );
    if ( !smile ) {
      faceNode.frown();
    }

    this.vBoxChildren = [faceNode, createContentFunction.call( this, FONT )];
    //content
    this.addChild( new VBox( {
      children: this.vBoxChildren,
      spacing: 5,
      centerX: self.centerX
    } ) );

    var backgroundBounds = Shape.bounds( this.localBounds.dilatedXY( 10, 10 ) ).bounds;
    this.backgroundRect.setRect( backgroundBounds.x, backgroundBounds.y, backgroundBounds.width, backgroundBounds.height );

    // move icon (cross) at upper-left
    var CROSS_WIDTH = 30;
    var arrowOptions = {
      tailWidth: 5,
      headWidth: 10,
      headHeight: 8,
      doubleHead: true,
      fill: '#f1f1f2',
      lineWidth: 0
    };
    var cross = new Node();
    cross.addChild( new ArrowNode( -CROSS_WIDTH / 2, 0, CROSS_WIDTH / 2, 0, arrowOptions ) );
    cross.addChild( new ArrowNode( 0, -CROSS_WIDTH / 2, 0, CROSS_WIDTH / 2, arrowOptions ) );
    this.addChild( cross );
    cross.left = this.backgroundRect.localBounds.left + 5;
    cross.top = this.backgroundRect.localBounds.top + 5;
  };

  return inherit( Node, GamePopupNode );
} );