// Copyright 2002-2014, University of Colorado Boulder

/**
 * Displays a chemical equation.
 * Reactants are on the left-hand size, products are on the right-hand side.
 *
 * @author Vasily Shakhov (mlearner.com)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var RightArrowNode = require( 'BALANCING_CHEMICAL_EQUATIONS/common/view/RightArrowNode' );
  var TermNode = require( 'BALANCING_CHEMICAL_EQUATIONS/common/view/TermNode' );
  var PlusNode = require( 'SCENERY_PHET/PlusNode' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * @param {Equation} equationProperty
   * @param {DOT.Range} coefficientRange range of the coefficients
   * @param {HorizontalAligner} aligner provides layout information to ensure horizontal alignment with other user-interface elements
   * @param {Object} options
   * @constructor
   */
  function EquationNode( equationProperty, coefficientRange, aligner, options ) {
    var self = this;
    Node.call( this );

    this.coefficientRange = coefficientRange;
    this.balancedHighlightEnabled = true;
    this.aligner = aligner;
    this.equation = equationProperty;
    this.termNodes = [];

    // arrow node, in a fixed location
    this.rightArrowNode = new RightArrowNode( equationProperty.balanced );
    this.addChild( this.rightArrowNode );
    this.rightArrowNode.centerX = this.aligner.centerXOffset;

    // the parent for all equation terms and the "+" signs
    this.termsParent = new Node();
    this.addChild( this.termsParent );

    // if coefficients changes
    var coefficientsObserver = function() {
      self.rightArrowNode.setHighlighted( self.equation.balanced && self.balancedHighlightEnabled );
    };

    // if the equation changes...
    equationProperty.link( function( newEquation, oldEquation ) {
      if ( oldEquation ) {
        oldEquation.balancedProperty.unlink( coefficientsObserver );
      }
      if ( newEquation ) {
        self.equation = newEquation;
        self.equation.balancedProperty.link( coefficientsObserver );
        self.updateNode();
      }
    } );

    this.mutate( options );
  }

  return inherit( Node, EquationNode, {

    /**
     * Rebuilds the left and right sides of the equation.
     */
    updateNode: function() {
      this.termsParent.removeAllChildren();
      this.termNodes = [];

      this.updateSideOfEquation( this.equation.reactants, this.aligner.getReactantXOffsets( this.equation ), this.aligner.minX, this.aligner.centerXOffset - this.aligner.boxSeparation / 2 );
      this.updateSideOfEquation( this.equation.products, this.aligner.getProductXOffsets( this.equation ), this.aligner.centerXOffset + this.aligner.boxSeparation / 2, this.aligner.maxX );

    },

    /**
     * Updates one side of the equation.
     * This layout algorithm depends on the fact that all terms contain at least 1 capital letter.
     * This allows us to align the baselines of HTML-formatted text.
     * @param {EquationTerm} terms array
     * @param {Number} xOffsets array for terms
     * @param {Number} minX minimal possible x for equation
     * @param {Number} maxX maximum possible x for equation
     */
    updateSideOfEquation: function( terms, xOffsets, minX, maxX ) {
      var plusNode;
      var termNode;
      var minSeparation = 15;
      var tempNodes = []; //contains all nodes for position adjustment if needed

      for ( var i = 0; i < terms.length; i++ ) {
        // term
        termNode = new TermNode( this.coefficientRange, terms[i] );
        this.termNodes.push( termNode );
        this.termsParent.addChild( termNode );
        termNode.center = new Vector2( xOffsets[i], 0 );

        //if node over previous plusNode move node to the right
        if ( i > 0 ) {
          if ( termNode.bounds.minX - minSeparation < tempNodes[tempNodes.length - 1].bounds.maxX ) {
            termNode.x += tempNodes[tempNodes.length - 1].bounds.maxX - (termNode.bounds.minX - minSeparation);
          }
        }
        tempNodes.push( termNode );

        if ( terms.length > 1 && i < terms.length - 1 ) {
          plusNode = new PlusNode();
          this.termsParent.addChild( plusNode );
          plusNode.centerX = xOffsets[i] + ( ( xOffsets[i + 1] - xOffsets[i] ) / 2 ); // centered between 2 offsets;
          plusNode.centerY = termNode.centerY;
          tempNodes.push( plusNode );

          //if previous node over plusNode move node to the left
          if ( termNode.bounds.maxX + minSeparation > plusNode.bounds.minX ) {
            termNode.x = termNode.x - (termNode.bounds.maxX + minSeparation - plusNode.bounds.minX);
          }
        }
      }

      var dx;
      //check if equation fits minX
      if ( tempNodes[0].bounds.minX < minX ) { //adjust all terms to the right
        var rightBound = minX; //current right bound of passed terms, if term.minX<rightBound move term to the right
        tempNodes.forEach( function( term ) {
          dx = Math.max( 0, rightBound - term.bounds.minX );
          term.x += dx;
          rightBound = term.bounds.maxX + minSeparation;
        } );
      }

      //check if equation fits maxX. I have not found any equation that needs this, for consistency and future needs
      if ( tempNodes[tempNodes.length - 1].bounds.maxX > maxX ) { //adjust all terms to the left
        var leftBound = maxX; //current left bound of passed terms, if term.maxX>leftBound move term to the left
        for ( i = tempNodes[tempNodes.length - 1]; i > -1; i-- ) {
          var term = tempNodes[i];
          dx = Math.max( 0, term.bounds.maxX - leftBound );
          term.x -= dx;
          leftBound = term.bounds.minX - minSeparation;
        }
      }

      this.rightArrowNode.centerY = termNode.centerY;
    },

    /**
     * Enables or disables the highlighting feature.
     * When enabled, the arrow between the left and right sides of the equation will light up when the equation is balanced.
     * This is enabled by default, but we want to disable in the Game until the user presses the "Check" button.
     *
     * @param enabled
     */
    setBalancedHighlightEnabled: function( enabled ) {
      if ( enabled !== this.balancedHighlightEnabled ) {
        this.balancedHighlightEnabled = enabled;
        this.rightArrowNode.setHighlighted( this.equation.balanced && this.balancedHighlightEnabled );
      }
    },

    /**
     * Controls whether the coefficients are editable.
     * @param editable
     */
    setEditable: function( editable ) {
      if ( editable !== this.editable ) {
        this.editable = editable;
        this.termNodes.forEach( function( termNode ) {
          termNode.setEditable( editable );
        } );
      }
    }
  } );
} );
