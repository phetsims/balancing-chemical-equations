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
  var NUMBER_FONT = new PhetFont( 28 );

  function CoefficientNode( range, coefficientProperty, editable, options ) {

    //arrows
    var arrowButtonOptions = { arrowHeight: 30, arrowWidth: 10, timerDelay: 200, lineWidth:0,yMargin:2,xMargin:0 };
    var upArrowButton = new ArrowButton( 'up', function() { coefficientProperty.value = coefficientProperty.value + 1; }, arrowButtonOptions );
    var downArrowButton = new ArrowButton( 'down', function() { coefficientProperty.value = coefficientProperty.value - 1; }, arrowButtonOptions );

    //text
    var answerValueBackground = new Rectangle( 0, 0, NUMBER_BOX_SIZE.width, NUMBER_BOX_SIZE.height, 4, 4,
      {
        fill: 'white',
        stroke: 'black',
        lineWidth: 1
      } );

    coefficientProperty.link( function( newValue ) {
      answerValueBackground.removeAllChildren();
      var textNode = new Text( newValue, {
        font: NUMBER_FONT
      } );
      textNode.scale( Math.min( 1, Math.min( ( answerValueBackground.width * 0.8 ) / textNode.width, ( answerValueBackground.height * 0.9 ) / textNode.height ) ) );
      textNode.centerX = answerValueBackground.width / 2;
      textNode.centerY = answerValueBackground.height / 2;
      answerValueBackground.addChild( textNode );
      upArrowButton.setEnabled( newValue < range.max );
      downArrowButton.setEnabled( newValue > range.min );
    } );

    // Set up extended touch areas for the up/down buttons.  The areas are
    // set up such that they don't overlap with one another.
    var extendedTouchAreaWidth = upArrowButton.width * 2.5;
    var extendedTouchAreaHeight = upArrowButton.height * 1.65; // Tweaked for minimal overlap in most layouts that use this.
    upArrowButton.touchArea = Shape.rectangle(
      -extendedTouchAreaWidth / 2 + upArrowButton.width / 2,
      -extendedTouchAreaHeight + upArrowButton.height,
      extendedTouchAreaWidth,
      extendedTouchAreaHeight
    );
    downArrowButton.touchArea = Shape.rectangle(
      -extendedTouchAreaWidth / 2 + upArrowButton.width / 2,
      0,
      extendedTouchAreaWidth,
      extendedTouchAreaHeight
    );

    VBox.call( this, {
      children: [upArrowButton,answerValueBackground,downArrowButton],
      spacing:0
    } ); // Call super constructor.
    /*    private final Property<Integer> coefficientProperty;
     private final SimpleObserver coefficientObserver;
     private final PText textNode;
     private final PSwing spinnerNode;

     public CoefficientNode( final IUserComponent userComponent, IntegerRange range, final Property<Integer> coefficientProperty, boolean editable ) {

     // read-only text
     textNode = new PText();
     textNode.setFont( FONT );
     textNode.setTextPaint( COEFFICIENT_COLOR );

     // editable spinner
     final IntegerSpinner spinner = new IntegerSpinner( userComponent, range );
     spinner.setForeground( COEFFICIENT_COLOR );
     spinner.setFont( FONT );
     spinner.setValue( coefficientProperty.get() );
     spinner.addChangeListener( new ChangeListener() {
     public void stateChanged( ChangeEvent e ) {
     SimSharingManager.sendUserMessage( chain( userComponent, UserComponents.spinner ), UserComponentTypes.spinner, UserActions.changed,
     ParameterSet.parameterSet( ParameterKeys.value, spinner.getIntValue() ) );

     coefficientProperty.set( spinner.getIntValue() );
     }
     } );
     spinnerNode = new PSwing( spinner );
     if ( PhetUtilities.isMacintosh() ) {
     spinnerNode.scale( 1.75 ); //WORKAROUND: JSpinner font changes are ignored on Mac
     }

     // rendering order
     addChild( spinnerNode );
     addChild( textNode );

     // visibility
     textNode.setVisible( !editable );
     spinnerNode.setVisible( editable );

     // coefficient observer
     this.coefficientProperty = coefficientProperty;
     coefficientObserver = new SimpleObserver() {
     public void update() {
     spinner.setIntValue( coefficientProperty.get() );
     textNode.setText( String.valueOf( coefficientProperty.get() ) );
     textNode.setOffset( spinnerNode.getFullBoundsReference().getMaxX() - textNode.getFullBoundsReference().getWidth() - 12, 0 ); // right justified
     }
     };
     coefficientProperty.addObserver( coefficientObserver );
     }

     public void setEditable( boolean editable ) {
     textNode.setVisible( !editable );
     spinnerNode.setVisible( editable );
     }

     public void removeCoefficientObserver() {
     coefficientProperty.removeObserver( coefficientObserver );
     }*/
  }

  return inherit( VBox, CoefficientNode );
} )
;