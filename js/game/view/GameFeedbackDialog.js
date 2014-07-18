// Copyright 2002-2014, University of Colorado Boulder

/**
 * Game feedback dialog. Presents different information based on whether the equation
 * is balanced and simplified, balanced but not simplified, or unbalanced.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var BarChartsNode = require( 'BALANCING_CHEMICAL_EQUATIONS/common/view/BarChartsNode' );
  var BalancedRepresentation = require( 'BALANCING_CHEMICAL_EQUATIONS/common/model/BalancedRepresentation' );
  var BalanceScalesNode = require( 'BALANCING_CHEMICAL_EQUATIONS/common/view/BalanceScalesNode' );
  var BCEConstants = require( 'BALANCING_CHEMICAL_EQUATIONS/common/BCEConstants' );
  var FaceNode = require( 'SCENERY_PHET/FaceNode' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Panel = require( 'SUN/Panel' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Property = require( 'AXON/Property' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var TextPushButton = require( 'SUN/buttons/TextPushButton' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var VStrut = require( 'SUN/VStrut' );

  // strings
  var balancedString = require( 'string!BALANCING_CHEMICAL_EQUATIONS/balanced' );
  var hideWhyString = require( 'string!BALANCING_CHEMICAL_EQUATIONS/hideWhy' );
  var notBalancedString = require( 'string!BALANCING_CHEMICAL_EQUATIONS/notBalanced' );
  var notSimplifiedString = require( 'string!BALANCING_CHEMICAL_EQUATIONS/notSimplified' );
  var pattern0PointsString = require( 'string!BALANCING_CHEMICAL_EQUATIONS/pattern_0points' );
  var showWhyString = require( 'string!BALANCING_CHEMICAL_EQUATIONS/showWhy' );
  var nextString = require( 'string!BALANCING_CHEMICAL_EQUATIONS/next' );
  var tryAgainString = require( 'string!BALANCING_CHEMICAL_EQUATIONS/tryAgain' );
  var showAnswerString = require( 'string!BALANCING_CHEMICAL_EQUATIONS/showAnswer' );

  // constants
  var TEXT_FONT = new PhetFont( 18 );
  var STATE_BUTTON_FONT = new PhetFont( 20 );
  var STATE_BUTTON_FILL = 'yellow';
  var WHY_BUTTON_FONT = new PhetFont( 16 );
  var WHY_BUTTON_FILL = '#d9d9d9';
  var ACTION_AREA_Y_SPACING = 8; // vertical space that separates the 'action area' (buttons) from stuff above it

  /**
   * Creates a text button that performs a model state change when pressed.
   * @param {String} label
   * @param {function} modelFunction model function that performs the state change
   * @returns {TextPushButton}
   */
  var createStateChangeButton = function( label, modelFunction ) {
    return new TextPushButton( label, {
      font: STATE_BUTTON_FONT,
      baseColor: STATE_BUTTON_FILL,
      listener: function() {
        modelFunction();
      }
    } );
  };

  /**
   * Creates a button that is appropriate for the current state of the model.
   * @param {GameModel} model
   * @returns {*}
   */
  var createButtonForState = function( model ) {
    var button = null;
    if ( model.state === model.states.TRY_AGAIN ) {
       button = createStateChangeButton( tryAgainString, model.tryAgain.bind( model ) );
    }
    else if ( model.state === model.states.SHOW_ANSWER ) {
       button = createStateChangeButton( showAnswerString, model.showAnswer.bind( model ) );
    }
    return button;
  };

  /**
   * Creates the representation of 'balanced' that becomes visible when the 'Show Why' button is pressed.
   * @param {Equation} equation
   * @param {BalancedRepresentation} balancedRepresentation
   * @param {HorizontalAligner} aligner
   * @returns {Node}
   */
  var createBalancedRepresentation = function( equation, balancedRepresentation, aligner ) {
    var balancedRepresentationNode;
    if ( balancedRepresentation === BalancedRepresentation.BALANCE_SCALES ) {
      balancedRepresentationNode = new BalanceScalesNode( new Property( equation ), aligner );
    }
    else if ( balancedRepresentation === BalancedRepresentation.BAR_CHARTS ) {
      balancedRepresentationNode = new BarChartsNode( new Property( equation ), aligner );
    }
    else {
      throw new Error( 'unsupported balancedRepresentation: ' + balancedRepresentation );
    }
    balancedRepresentationNode.setScaleMagnitude( 0.65 ); // issue #29, shrink size so that it doesn't cover so much of the screen
    return balancedRepresentationNode;
  };

  /**
   * @param {GameModel} model
   * @param {HorizontalAligner} aligner
   * @param {*} options
   * @constructor
   */
  function GameFeedbackDialog( model, aligner, options ) {

    options = _.extend( {
      fill: '#c1d8fe',
      xMargin: 40,
      yMargin: 10,
      cornerRadius: 0,
      hBoxSpacing: 0,
      vBoxSpacing: 7,
      shadowXOffset: 5,
      shadowYOffset: 5
    }, options );

    var self = this;
    var equation = model.currentEquation;
    var balancedRepresentation = model.balancedRepresentation;
    var points = model.currentPoints;
    var textOptions = { font: TEXT_FONT };

    // happy/sad face
    var faceNode = new FaceNode( 75 );
    if ( !equation.balanced ) { faceNode.frown(); }

    var content;
    if ( equation.balancedAndSimplified ) {
      // balanced and simplified
      content = new VBox( {
        children: [
          // happy face
          faceNode,
          // check mark + 'balanced'
          new HBox( {
            children: [ BCEConstants.CORRECT_ICON, new Text( balancedString, textOptions ) ],
            spacing: options.hBoxSpacing
          } ),
          // points awarded
          new Text( StringUtils.format( pattern0PointsString, points ), { font: new PhetFont( { size: 24, weight: 'bold' } ) } ),
          // space
          new VStrut( ACTION_AREA_Y_SPACING ),
          // Next button
          createStateChangeButton( nextString, model.next.bind( model ) )
        ],
        spacing: options.vBoxSpacing
      } );
    }
    else if ( equation.balanced ) {
      // balanced, not simplified: happy face with 'balance' and 'not simplified' below it
      content = new VBox( {
        children: [
          // happy face
          faceNode,
          // check mark + 'balanced'
          new HBox( {
            children: [ BCEConstants.CORRECT_ICON, new Text( balancedString, textOptions ) ],
            spacing: options.hBoxSpacing
          } ),
          // red X + 'not simplified'
          new HBox( {
            children: [ BCEConstants.INCORRECT_ICON, new Text( notSimplifiedString, textOptions ) ],
            spacing: options.hBoxSpacing
          } ),
          // space
          new VStrut( ACTION_AREA_Y_SPACING ),
          // Try Again or Show Answer button
          createButtonForState( model )
        ],
        spacing: options.vBoxSpacing
      } );
    }
    else {
      // not balanced

      var saveCenterX; // saves the dialog's centerX when pressing Show/Hide Why.
      var balancedRepresentationNode = null; // create on demand

      // 'Show Why' button, exposes one of the 'balanced' representations to explain why it's not balanced
      var showWhyButton = new TextPushButton( showWhyString, {
        listener: function() {
          showWhyButton.visible = false;
          hideWhyButton.visible = true;
          saveCenterX = self.centerX;
          if ( !balancedRepresentationNode ) {
            balancedRepresentationNode = createBalancedRepresentation( equation, balancedRepresentation, aligner );
          }
          content.addChild( balancedRepresentationNode );
          self.centerX = saveCenterX;
        },
        font: WHY_BUTTON_FONT,
        baseColor: WHY_BUTTON_FILL,
        visible: true
      } );

      // 'Hide Why' button, hides the 'balanced' representation
      var hideWhyButton = new TextPushButton( hideWhyString, {
        listener: function() {
          showWhyButton.visible = true;
          hideWhyButton.visible = false;
          saveCenterX = self.centerX;
          content.removeChild( balancedRepresentationNode );
          self.centerX = saveCenterX;
        },
        font: WHY_BUTTON_FONT,
        baseColor: WHY_BUTTON_FILL,
        visible: !showWhyButton.visible,
        center: showWhyButton.center
      } );

      content = new VBox( {
        children: [
          // sad face
          faceNode,
          // red X + 'not balanced'
          new HBox( {
            children: [
              BCEConstants.INCORRECT_ICON,
              new Text( notBalancedString, textOptions )
            ],
            spacing: options.hBoxSpacing
          } ),
          // space
          new VStrut( ACTION_AREA_Y_SPACING ),
          // Try Again or Show Answer button
          createButtonForState( model ),
          // Show/Hide Why buttons
          new Node( { children: [ showWhyButton, hideWhyButton ] } )
        ],
        spacing: options.vBoxSpacing
      } );
    }

    // panel, which will resize dynamically
    var panel = new Panel( content, options );

    // shadow
    var shadowNode = new Rectangle( 0, 0, 1, 1, { fill: 'rgba(80,80,80,0.12)' } );
    var updateShadow = function() {
      shadowNode.setRect( panel.left + options.shadowXOffset, panel.top + options.shadowYOffset, panel.width, panel.height, options.cornerRadius, options.cornerRadius );
    };
    content.addEventListener( 'bounds', updateShadow ); // resize shadow when panel changes size
    updateShadow();

    options.children = [ shadowNode, panel ];
    Node.call( this, options );
  }

  return inherit( Panel, GameFeedbackDialog );
} );
