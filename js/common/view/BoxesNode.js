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
   * @param {Property<Equation>} equationProperty the equation displayed in the boxes
   * @param {Range} coefficientsRange
   * @param {HorizontalAligner} aligner provides layout information to ensure horizontal alignment with other user-interface elements
   * @param {Dimension2} boxSize
   * @param {String} boxColor fill color of the boxes
   * @param {Property<Boolean>} reactantsBoxExpandedProperty
   * @param {Property<Boolean>} productsBoxExpandedProperty
   * @param {Object} options
   * @constructor
   */
  function BoxesNode( equationProperty, coefficientsRange, aligner, boxSize, boxColor, reactantsBoxExpandedProperty, productsBoxExpandedProperty, options ) {

    var self = this;
    Node.call( this );

    this.aligner = aligner;
    this.equationProperty = equationProperty;
    this.balancedHighlightEnabled = true;

    // boxes
    this.reactantsBoxNode = new BoxNode( coefficientsRange, reactantsBoxExpandedProperty, {
      fill: boxColor,
      title: reactantsString,
      boxWidth: boxSize.width,
      boxHeight: boxSize.height,
      x: aligner.getReactantsBoxLeft(),
      y: 0
    } );
    this.addChild( this.reactantsBoxNode );

    this.productsBoxNode = new BoxNode( coefficientsRange, productsBoxExpandedProperty, {
      fill: boxColor,
      title: productsString,
      boxWidth: boxSize.width,
      boxHeight: boxSize.height,
      x: aligner.getProductsBoxLeft(),
      y: 0
    } );
    this.addChild( this.productsBoxNode );

    // right-pointing arrow
    this.arrowNode = new RightArrowNode( equationProperty.get().balanced );
    this.arrowNode.center = new Vector2( aligner.getScreenCenterX(), boxSize.height / 2 );
    this.addChild( this.arrowNode );

    // if the equation changes...
    equationProperty.link( function( newEquation, oldEquation ) {
      if ( oldEquation ) { oldEquation.removeCoefficientsObserver( self.updateMolecules.bind( self ) ); }
      self.updateNode();
      newEquation.addCoefficientsObserver( self.updateMolecules.bind( self ) );
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
        this.arrowNode.setHighlighted( this.equationProperty.get().balanced && this.balancedHighlightEnabled );
      }
    },

    /**
     * Creates new equation molecules.
     * @private
     */
    updateNode: function() {
      var equation = this.equationProperty.get();
      this.reactantsBoxNode.createMolecules( equation.reactants, this.aligner.getReactantXOffsets( equation ) );
      this.productsBoxNode.createMolecules( equation.products, this.aligner.getProductXOffsets( equation ) );
    },

    /**
     * Updates the number of visible molecules and arrow highlighting.
     * @private
     */
    updateMolecules: function() {
      var equation = this.equationProperty.get();
      this.reactantsBoxNode.updateMolecules( equation.reactants );
      this.productsBoxNode.updateMolecules( equation.products );
      this.arrowNode.setHighlighted( equation.balanced && this.balancedHighlightEnabled );
    }
  } );
} );