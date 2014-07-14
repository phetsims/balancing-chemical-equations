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

  // strings
  var balancedString = require( 'string!BALANCING_CHEMICAL_EQUATIONS/balanced' );
  var hideWhyString = require( 'string!BALANCING_CHEMICAL_EQUATIONS/hideWhy' );
  var notBalancedString = require( 'string!BALANCING_CHEMICAL_EQUATIONS/notBalanced' );
  var notSimplifiedString = require( 'string!BALANCING_CHEMICAL_EQUATIONS/notSimplified' );
  var pattern0PointsString = require( 'string!BALANCING_CHEMICAL_EQUATIONS/pattern_0points' );
  var showWhyString = require( 'string!BALANCING_CHEMICAL_EQUATIONS/showWhy' );

  /**
   * @param {Equation} equation
   * @param {HorizontalAligner} aligner
   * @param {BalancedRepresentation} balancedRepresentation
   * @param {Number} points
   * @param {*} options
   * @constructor
   */
  function GameFeedbackDialog( equation, aligner, balancedRepresentation, points, options ) {

    var self = this;
    
    options = _.extend( {
      fill: '#c1d8fe',
      xMargin: 25,
      yMargin: 10,
      cornerRadius: 0,
      hBoxSpacing: 0,
      vBoxSpacing: 5,
      buttonFill: '#d9d9d9',
      buttonFont: new PhetFont( 20 ),
      textFont: new PhetFont( 18 ),
      shadowXOffset: 5,
      shadowYOffset: 5
    }, options );

    var textOptions = { font: options.textFont };

    // happy/sad face
    var faceNode = new FaceNode( 75 );
    if ( !equation.balanced ) { faceNode.frown(); }

    var content;
    if ( equation.balancedAndSimplified ) {
      // balanced and simplified: happy face with 'balanced' and number of points below it.
      content = new VBox( {
        children: [
          faceNode,
          new HBox( {
            children: [ BCEConstants.CORRECT_ICON, new Text( balancedString, textOptions ) ],
            spacing: options.hBoxSpacing
          } ),
          new Text( StringUtils.format( pattern0PointsString, points ), textOptions )
        ],
        spacing: options.vBoxSpacing
      } );
    }
    else if ( equation.balanced ) {
      // balanced, not simplified: happy face with 'balance' and 'not simplified' below it
      content = new VBox( {
        children: [
          faceNode,
          new HBox( {
            children: [ BCEConstants.CORRECT_ICON, new Text( balancedString, textOptions ) ],
            spacing: options.hBoxSpacing
          } ),
          new HBox( {
            children: [ BCEConstants.INCORRECT_ICON, new Text( notSimplifiedString, textOptions ) ],
            spacing: options.hBoxSpacing
          } )
        ],
        spacing: options.vBoxSpacing
      } );
    }
    else {
      // not balanced: sad face with 'not balanced' and 'Show/Hide Why' button below it

      // representation of "balanced", becomes visible when you press 'Show Why'
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

      // buttons
      var saveCenterX;
      var showWhyButton = new TextPushButton( showWhyString, {
        // 'Show Why' button exposes one of the 'balanced' representations to explain why it's not balanced
        listener: function() {
          showWhyButton.visible = false;
          hideWhyButton.visible = true;
          saveCenterX = self.centerX;
          content.addChild( balancedRepresentationNode );
          self.centerX = saveCenterX;
        },
        font: options.buttonFont,
        baseColor: options.buttonFill,
        visible: true
      } );
      var hideWhyButton = new TextPushButton( hideWhyString, {
        // 'Hide Why' button hides the 'balanced' representation
        listener: function() {
          showWhyButton.visible = true;
          hideWhyButton.visible = false;
          saveCenterX = self.centerX;
          content.removeChild( balancedRepresentationNode );
          self.centerX = saveCenterX;
        },
        font: options.buttonFont,
        baseColor: options.buttonFill,
        visible: !showWhyButton.visible,
        center: showWhyButton.center
      } );
      var buttonsParent = new Node( { children: [ showWhyButton, hideWhyButton ] } );

      content = new VBox( {
        children: [
          faceNode,
          new HBox( {
            children: [
              BCEConstants.INCORRECT_ICON,
              new Text( notBalancedString, textOptions )
            ],
            spacing: options.hBoxSpacing
          } ),
          buttonsParent
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
