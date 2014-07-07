// Copyright 2002-2014, University of Colorado Boulder

/**
 * A pair of boxes that show the number of molecules indicated by the equation's user coefficients.
 * Left box is for the reactants, right box is for the products.
 *
 * @author Vasily Shakhov (mlearner.com)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var BoxNode = require( 'BALANCING_CHEMICAL_EQUATIONS/common/view/BoxNode' );
  var RightArrowNode = require( 'BALANCING_CHEMICAL_EQUATIONS/common/view/RightArrowNode' );
  var Vector2 = require( 'DOT/Vector2' );

  // strings
  var reactantsString = require( 'string!BALANCING_CHEMICAL_EQUATIONS/reactants' );
  var productsString = require( 'string!BALANCING_CHEMICAL_EQUATIONS/products' );

  /**
   * @param {model} model - current screen model.
   * @param {HorizontalAligner} aligner provides layout information to ensure horizontal alignment with other user-interface elements
   * @param {String} boxColor fill color of the boxes
   * @param {Object} options
   * @constructor
   */
  function BoxesNode( model, aligner, boxColor, options ) {

    var self = this;
    Node.call( this );

    this.COEFFICENTS_RANGE = model.COEFFICENTS_RANGE;
    this.aligner = aligner;
    this.equation = model.currentEquation;
    this.balancedHighlightEnabled = true;

    //boxes
    this.reactantsBoxNode = new BoxNode( aligner, this.COEFFICENTS_RANGE, model.leftBoxOpenProperty, {
      fill: boxColor,
      title: reactantsString,
      x: aligner.centerXOffset - aligner.boxSize.width - aligner.boxSeparation / 2,
      width: aligner.boxSize.width,
      y: 0,
      height: aligner.boxSize.height
    } );
    this.addChild( this.reactantsBoxNode );

    this.productsBoxNode = new BoxNode( aligner, this.COEFFICENTS_RANGE, model.rightBoxOpenProperty, {
      fill: boxColor,
      title: productsString,
      x: aligner.centerXOffset + aligner.boxSeparation / 2,
      width: aligner.boxSize.width,
      y: 0,
      height: aligner.boxSize.height
    } );
    this.addChild( this.productsBoxNode );

    // right-pointing arrow
    this.arrowNode = new RightArrowNode( model.currentEquationProperty.balanced );
    this.arrowNode.center = new Vector2( aligner.centerXOffset, aligner.boxSize.height / 2 );
    this.addChild( this.arrowNode );

    // if the equation changes...
    model.currentEquationProperty.link( function( newEquation, oldEquation ) {
      if ( oldEquation ) {
        oldEquation.removeCoefficientsObserver( self.updateMolecules.bind( self ) );
      }
      if ( newEquation ) {
        self.equation = newEquation;
        self.updateNode();
        //observer for coefficients
        self.equation.addCoefficientsObserver( self.updateMolecules.bind( self ) );
      }
    } );

    this.mutate( options );
  }

  return inherit( Node, BoxesNode, {

    /**
     * Enables or disables the highlighting feature.
     * When enabled, the arrow between the boxes will light up when the equation is balanced.
     * This is enabled by default, but we want to disable in the Game until the user presses the "Check" button.
     * @param enabled
     */
    setBalancedHighlightEnabled: function( enabled ) {
      if ( enabled !== this.balancedHighlightEnabled ) {
        this.balancedHighlightEnabled = enabled;
        this.arrowNode.setHighlighted( this.equation.balanced && this.balancedHighlightEnabled );
      }
    },

    /**
     * create new equation molecules.
     */
    updateNode: function() {
      this.reactantsBoxNode.createMolecules( this.equation.reactants, this.aligner.getReactantXOffsets( this.equation ) );
      this.productsBoxNode.createMolecules( this.equation.products, this.aligner.getProductXOffsets( this.equation ) );
    },

    /**
     * Updates the number of visible molecules and arrow highlighting.
     */
    updateMolecules: function() {
      this.reactantsBoxNode.updateMolecules( this.equation.reactants );
      this.productsBoxNode.updateMolecules( this.equation.products );
      this.arrowNode.setHighlighted( this.equation.balanced && this.balancedHighlightEnabled );
    }
  } );
} );