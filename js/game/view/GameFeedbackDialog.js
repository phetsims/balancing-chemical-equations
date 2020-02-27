// Copyright 2014-2020, University of Colorado Boulder

/**
 * Game feedback dialog. Presents different information based on whether the equation
 * is balanced and simplified, balanced but not simplified, or unbalanced.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const BalancedRepresentation = require( 'BALANCING_CHEMICAL_EQUATIONS/common/model/BalancedRepresentation' );
  const BalanceScalesNode = require( 'BALANCING_CHEMICAL_EQUATIONS/common/view/BalanceScalesNode' );
  const balancingChemicalEquations = require( 'BALANCING_CHEMICAL_EQUATIONS/balancingChemicalEquations' );
  const BarChartsNode = require( 'BALANCING_CHEMICAL_EQUATIONS/common/view/BarChartsNode' );
  const FaceNode = require( 'SCENERY_PHET/FaceNode' );
  const FontAwesomeNode = require( 'SUN/FontAwesomeNode' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const merge = require( 'PHET_CORE/merge' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Panel = require( 'SUN/Panel' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Property = require( 'AXON/Property' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const Text = require( 'SCENERY/nodes/Text' );
  const TextPushButton = require( 'SUN/buttons/TextPushButton' );
  const VBox = require( 'SCENERY/nodes/VBox' );
  const VStrut = require( 'SCENERY/nodes/VStrut' );

  // strings
  const balancedString = require( 'string!BALANCING_CHEMICAL_EQUATIONS/balanced' );
  const hideWhyString = require( 'string!BALANCING_CHEMICAL_EQUATIONS/hideWhy' );
  const nextString = require( 'string!BALANCING_CHEMICAL_EQUATIONS/next' );
  const notBalancedString = require( 'string!BALANCING_CHEMICAL_EQUATIONS/notBalanced' );
  const notSimplifiedString = require( 'string!BALANCING_CHEMICAL_EQUATIONS/notSimplified' );
  const pattern0PointsString = require( 'string!BALANCING_CHEMICAL_EQUATIONS/pattern_0points' );
  const showAnswerString = require( 'string!BALANCING_CHEMICAL_EQUATIONS/showAnswer' );
  const showWhyString = require( 'string!BALANCING_CHEMICAL_EQUATIONS/showWhy' );
  const tryAgainString = require( 'string!BALANCING_CHEMICAL_EQUATIONS/tryAgain' );

  // constants
  const TEXT_FONT = new PhetFont( 18 );
  const STATE_BUTTON_FONT = new PhetFont( 20 );
  const STATE_BUTTON_FILL = 'yellow';
  const WHY_BUTTON_FONT = new PhetFont( 16 );
  const WHY_BUTTON_FILL = '#d9d9d9';
  const ACTION_AREA_Y_SPACING = 8; // vertical space that separates the 'action area' (buttons) from stuff above it

  class GameFeedbackDialog extends Node {

    /**
     * @param {GameModel} model
     * @param {HorizontalAligner} aligner
     * @param {Object} [options]
     */
    constructor( model, aligner, options ) {

      options = merge( {
        fill: '#c1d8fe',
        xMargin: 40,
        yMargin: 10,
        cornerRadius: 0,
        hBoxSpacing: 5,
        vBoxSpacing: 7,
        shadowXOffset: 5,
        shadowYOffset: 5
      }, options );

      const equation = model.currentEquationProperty.get();
      const balancedRepresentation = model.balancedRepresentation;
      const points = model.currentPoints;
      const maxWidth = 0.75 * aligner.getScreenWidth(); // max width of UI elements
      const textOptions = { font: TEXT_FONT, maxWidth: maxWidth };

      // happy/sad face
      const faceNode = new FaceNode( 75 );
      if ( !equation.balancedProperty.get() ) { faceNode.frown(); }

      let content;
      if ( equation.balancedAndSimplified ) {

        // balanced and simplified
        content = new VBox( {
          children: [

            // happy face
            faceNode,

            // check mark + 'balanced'
            new HBox( {
              children: [ createCorrectIcon(), new Text( balancedString, textOptions ) ],
              spacing: options.hBoxSpacing
            } ),

            // points awarded
            new Text( StringUtils.format( pattern0PointsString, points ), {
              font: new PhetFont( {
                size: 24,
                weight: 'bold'
              } ), maxWidth: maxWidth
            } ),

            // space
            new VStrut( ACTION_AREA_Y_SPACING ),

            // Next button
            createStateChangeButton( nextString, model.next.bind( model ), maxWidth )
          ],
          spacing: options.vBoxSpacing
        } );
      }
      else if ( equation.balancedProperty.get() ) {

        // balanced, not simplified: happy face with 'balance' and 'not simplified' below it
        content = new VBox( {
          children: [

            // happy face
            faceNode,
            new VBox( {
              align: 'left',
              spacing: 3,
              children: [

                // check mark + 'balanced'
                new HBox( {
                  children: [ createCorrectIcon(), new Text( balancedString, textOptions ) ],
                  spacing: options.hBoxSpacing
                } ),

                // red X + 'not simplified'
                new HBox( {
                  children: [ createIncorrectIcon(), new Text( notSimplifiedString, textOptions ) ],
                  spacing: options.hBoxSpacing
                } )
              ]
            } ),

            // space
            new VStrut( ACTION_AREA_Y_SPACING ),

            // Try Again or Show Answer button
            createButtonForState( model, maxWidth )
          ],
          spacing: options.vBoxSpacing
        } );
      }
      else {

        // not balanced
        let saveCenterX; // saves the dialog's centerX when pressing Show/Hide Why.
        let balancedRepresentationNode = null; // create on demand

        // 'Show Why' button, exposes one of the 'balanced' representations to explain why it's not balanced
        var showWhyButton = new TextPushButton( showWhyString, {
          listener: () => {
            showWhyButton.visible = false;
            hideWhyButton.visible = true;
            saveCenterX = this.centerX;
            if ( !balancedRepresentationNode ) {
              balancedRepresentationNode = createBalancedRepresentation( equation, balancedRepresentation, aligner );
            }
            content.addChild( balancedRepresentationNode );
            this.centerX = saveCenterX;
          },
          font: WHY_BUTTON_FONT,
          baseColor: WHY_BUTTON_FILL,
          visible: true,
          maxWidth: maxWidth
        } );

        // 'Hide Why' button, hides the 'balanced' representation
        var hideWhyButton = new TextPushButton( hideWhyString, {
          listener: () => {
            showWhyButton.visible = true;
            hideWhyButton.visible = false;
            saveCenterX = this.centerX;
            content.removeChild( balancedRepresentationNode );
            this.centerX = saveCenterX;
          },
          font: WHY_BUTTON_FONT,
          baseColor: WHY_BUTTON_FILL,
          visible: !showWhyButton.visible,
          center: showWhyButton.center,
          maxWidth: maxWidth
        } );

        content = new VBox( {
          children: [

            // sad face
            faceNode,

            // red X + 'not balanced'
            new HBox( {
              children: [ createIncorrectIcon(), new Text( notBalancedString, textOptions ) ],
              spacing: options.hBoxSpacing
            } ),

            // space
            new VStrut( ACTION_AREA_Y_SPACING ),

            // Try Again or Show Answer button
            createButtonForState( model, maxWidth ),

            // Show/Hide Why buttons
            new Node( { children: [ showWhyButton, hideWhyButton ] } )
          ],
          spacing: options.vBoxSpacing
        } );
      }

      // panel, which will resize dynamically
      const panel = new Panel( content, options );

      // shadow
      const shadowNode = new Rectangle( 0, 0, 1, 1, {
        fill: 'rgba( 80, 80, 80, 0.12 )',
        cornerRadius: options.cornerRadius
      } );
      const updateShadow = () => {
        shadowNode.setRect( panel.left + options.shadowXOffset, panel.top + options.shadowYOffset, panel.width, panel.height );
      };
      content.on( 'bounds', updateShadow ); // resize shadow when panel changes size
      updateShadow();

      options.children = [ shadowNode, panel ];
      super( options );
    }
  }

  /**
   * Creates the icon for a correct answer, a green check mark.
   * @returns {Node}
   */
  function createCorrectIcon() {
    return new FontAwesomeNode( 'check', { fill: 'rgb( 0, 180, 0 )' } );
  }

  /**
   * Creates the icon for an incorrect answer, a red 'X'.
   * @returns {Node}
   */
  function createIncorrectIcon() {
    return new FontAwesomeNode( 'times', { fill: 'rgb(252,104,0)' } );
  }

  /**
   * Creates a text button that performs a model state change when pressed.
   * @param {string} label
   * @param {function} modelFunction model function that performs the state change
   * @param {number} maxWidth
   * @returns {TextPushButton}
   */
  function createStateChangeButton( label, modelFunction, maxWidth ) {
    return new TextPushButton( label, {
      font: STATE_BUTTON_FONT,
      baseColor: STATE_BUTTON_FILL,
      maxWidth: maxWidth,
      listener: function() {
        modelFunction();
      }
    } );
  }

  /**
   * Creates a button that is appropriate for the current state of the model.
   * @param {GameModel} model
   * @param {number} maxWidth
   * @returns {TextPushButton}
   */
  function createButtonForState( model, maxWidth ) {
    let button = null;
    if ( model.stateProperty.get() === model.states.TRY_AGAIN ) {
      button = createStateChangeButton( tryAgainString, model.tryAgain.bind( model ), maxWidth );
    }
    else if ( model.stateProperty.get() === model.states.SHOW_ANSWER ) {
      button = createStateChangeButton( showAnswerString, model.showAnswer.bind( model ), maxWidth );
    }
    return button;
  }

  /**
   * Creates the representation of 'balanced' that becomes visible when the 'Show Why' button is pressed.
   * @param {Equation} equation
   * @param {BalancedRepresentation} balancedRepresentation
   * @param {HorizontalAligner} aligner
   * @returns {Node}
   */
  function createBalancedRepresentation( equation, balancedRepresentation, aligner ) {
    let balancedRepresentationNode;
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
  }

  return balancingChemicalEquations.register( 'GameFeedbackDialog', GameFeedbackDialog );
} );
