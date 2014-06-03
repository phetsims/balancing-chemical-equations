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
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var ExpandCollapseButton = require( 'SUN/ExpandCollapseButton' );
  var Property = require( 'AXON/Property' );
  var Shape = require( 'KITE/Shape' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Vector2 = require( 'DOT/Vector2' );
  var BCEConstants = require( 'BALANCING_CHEMICAL_EQUATIONS/common/BCEConstants' );

  //constants
  var TITLE_FONT = new PhetFont( 18 );

  /**
   * Constructor
   * @param {[EquationTerm]} terms of the equation
   * @param coefficientRange range of the coefficients
   * @param aligner provides layout information to ensure horizontal alignment with other user-interface elements
   * @param {Object} options
   */

  function BoxNode( aligner, coefficientRange, options ) {
    var self = this;
    this.coefficientRange = coefficientRange;
    this.aligner = aligner;

    Node.call( this, options );

    //box options
    options = _.extend( {
      buttonLength: 15,
      xMargin: 5,
      yMargin: 5,
      fill: 'white',
      stroke: 'black',
      lineWidth: 1,
      title: '',
      width: 100,
      height: 100
    }, options );

    //title node
    this.titleNode = new Rectangle( 0, 0, options.width, options.buttonLength + 2 * options.yMargin, {fill: options.fill, lineWidth: options.lineWidth, stroke: options.stroke} );
    this.addChild( this.titleNode );
    this.titleNode.addChild( new Text( options.title, {
      font: TITLE_FONT,
      centerY: this.titleNode.centerY,
      centerX: this.titleNode.centerX
    } ) );

    //contentNode
    this.contentNode = new Rectangle( 0, 0, options.width, options.height, {fill: options.fill, lineWidth: options.lineWidth, stroke: options.stroke} );
    this.addChild( this.contentNode );

    // Create a property that tracks the open/closed state.
    this.openProperty = new Property( true );

    // expand/collapse button
    var button = new ExpandCollapseButton( options.buttonLength, this.openProperty );
    button.touchArea = Shape.bounds( button.localBounds.dilatedXY( 10, 10 ) );
    this.addChild( button );
    button.right = this.width - options.xMargin;
    button.y = options.yMargin;

    // show/hide title and contentNode
    this.openProperty.link( function( isOpen ) {
      self.titleNode.setVisible( !isOpen );
      self.contentNode.setVisible( isOpen );
    } );
  }

  return inherit( Node, BoxNode, {
    /*
     Creates molecules in the boxes for one set of terms (reactants or products).
     */
    createMolecules: function( terms, xOffsets ) {
      this.contentNode.removeAllChildren();
      var yMargin = 0;
      var rowHeight = ( this.aligner.boxSize.height - ( 2 * yMargin ) ) / this.coefficientRange.max;

      for ( var i = 0; i < terms.length; i++ ) {
        var numberOfMolecules = terms[i].userCoefficient;
        var moleculeImageConstructor = terms[i].molecule.imageConstructor;
        var y = this.aligner.boxSize.height - yMargin - ( rowHeight / 2 );

        for ( var j = 0; j < numberOfMolecules; j++ ) {
          var imageNode = new moleculeImageConstructor( BCEConstants.ATOM_OPTIONS );
          this.contentNode.addChild( imageNode );
          imageNode.center = new Vector2( xOffsets[i] - this.x, y );
          y -= rowHeight;
        }
      }
    }
  } );

} );