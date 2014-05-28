// Copyright 2002-2014, University of Colorado Boulder

/**
 *
 *
 * Coefficient node, can be read-only or editable.
 * Listens for changes to the coefficient property and updates accordingly.
 * When editable, sets the coefficient property.
 *
 Author: Vasily
 Shakhov( mlearner.com )
 */


define( function( require ) {
  'use strict';

  // modules
  var ArrowButton = require( 'SCENERY_PHET/ArrowButton' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Shape = require( 'KITE/Shape' );
  var Text = require( 'SCENERY/nodes/Text' );

  // Constants
  var NUMBER_BOX_SIZE = { width: 40, height: 40}; // Size empirically determined.
  var NUMBER_FONT = new PhetFont( 36 );

  function CoefficientNode( range, coefficientProperty, editable ) {
    var self = this;
    this.coefficientProperty = coefficientProperty;

    //arrows
    var arrowButtonOptions = { arrowHeight: 30, arrowWidth: 10, timerDelay: 200, lineWidth: 0, yMargin: 2, xMargin: 0 };
    this.upArrowButton = new ArrowButton( 'up', function() { coefficientProperty.value = coefficientProperty.value + 1; }, arrowButtonOptions );
    this.downArrowButton = new ArrowButton( 'down', function() { coefficientProperty.value = coefficientProperty.value - 1; }, arrowButtonOptions );

    //textNode
    var answerValueBackground = new Rectangle( 0, 0, NUMBER_BOX_SIZE.width, NUMBER_BOX_SIZE.height, 4, 4,
      {
        fill: 'white',
        stroke: 'black',
        lineWidth: 1
      } );

    VBox.call( this, {
      children: [this.upArrowButton, answerValueBackground, this.downArrowButton],
      spacing: 0
    } );

    //text in textNode
    var textNode = new Text( coefficientProperty, {
      font: NUMBER_FONT,
      centerY: NUMBER_BOX_SIZE.height / 2
    } );
    answerValueBackground.addChild( textNode );

    this.coefficientObserver = function( newValue ) {
      textNode.setText( newValue );
      textNode.centerX = answerValueBackground.width / 2;
      self.upArrowButton.setEnabled( newValue < range.max );
      self.downArrowButton.setEnabled( newValue > range.min );
    };

    coefficientProperty.link( this.coefficientObserver );

    // Set up extended touch areas for the up/down buttons.  The areas are
    // set up such that they don't overlap with one another.
    var extendedTouchAreaWidth = this.upArrowButton.width * 2.5;
    var extendedTouchAreaHeight = this.upArrowButton.height * 1.65; // Tweaked for minimal overlap in most layouts that use this.
    this.upArrowButton.touchArea = Shape.rectangle(
      -extendedTouchAreaWidth / 2 + this.upArrowButton.width / 2,
      -extendedTouchAreaHeight + this.upArrowButton.height,
      extendedTouchAreaWidth,
      extendedTouchAreaHeight
    );
    this.downArrowButton.touchArea = Shape.rectangle(
      -extendedTouchAreaWidth / 2 + this.upArrowButton.width / 2,
      0,
      extendedTouchAreaWidth,
      extendedTouchAreaHeight
    );
  }

  return inherit( VBox, CoefficientNode, {
    setEditable: function( editable ) {
      this.upArrowButton.setVisible( editable );
      this.downArrowButton.setVisible( editable );
    },
    removeCoefficientObserver: function() {
      this.coefficientProperty.unlink( this.coefficientObserver );
    }
  } );
} )
;