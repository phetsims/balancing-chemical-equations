// Copyright 2002-2014, University of Colorado

/**
 * A term in the equation, includes the coefficient and symbol.
 * The coefficient may or may not be editable.
 *
 * @author Vasily Shakhov (mlearner.com)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Property = require( 'AXON/Property' );
  var NumberPicker = require( 'SCENERY_PHET/NumberPicker' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var SubSupText = require( 'SCENERY_PHET/SubSupText' );

  /**
   * @param {DOT.Range} coefficientRange range of the coefficients
   * @param {EquationTerm} term
   * @constructor
   */
  function TermNode( coefficientRange, term, options ) {

    options = _.extend( {
      fontSize: 32,
      xSpacing: 4
    }, options );

    Node.call( this );

    this.subSupOptions = { font: new PhetFont( options.fontSize ), supScale: 1 };
    this.symbolNode = new SubSupText( term.molecule.symbol, this.subSupOptions );
    this.addChild( this.symbolNode );

    this.coefficientNode = new NumberPicker( term.userCoefficientProperty, new Property( coefficientRange ), {
      color: 'black',
      xMargin: 8,
      yMargin: 0,
      touchAreaExpandX: 30,
      font: new PhetFont( options.fontSize )
    } );
    this.addChild( this.coefficientNode );

    this.symbolNode.left = this.coefficientNode.right + options.xSpacing;
    // vertically center the non-subscript part of the symbol on the picker
    this.symbolNode.centerY = this.coefficientNode.centerY + ( this.symbolNode.height - new SubSupText( 'H', this.subSupOptions ).height )/2;
  }

  return inherit( Node, TermNode, {

    setEditable: function( editable ) {
      this.coefficientNode.pickable = editable;
    }
  } );
} );
