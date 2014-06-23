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

  // constants related to text
  var FONT_SIZE = 36;
  var FONT = new PhetFont( FONT_SIZE );
  var SUBSUP_OPTIONS = {font: FONT, supScale: 1}; // options for all instances of SubSupNode

  /**
   * @param {DOT.Range} coefficientRange range of the coefficients
   * @param {EquationTerm} term
   * @constructor
   */

  function TermNode( coefficientRange, term ) {
    Node.call( this );

    var capHeight = this.getCapHeight();

    this.symbolNode = new SubSupText( term.molecule.symbol, SUBSUP_OPTIONS );
    this.addChild( this.symbolNode );
    this.symbolNode.centerY = capHeight / 2 - (capHeight / 2 - this.symbolNode.height / 2);

    this.coefficientNode = new NumberPicker( term.userCoefficientProperty, new Property( coefficientRange ), {
      color: 'black',
      xMargin: 8,
      yMargin: 0,
      touchAreaExpandX: 30,
      font: new PhetFont( FONT_SIZE )
    } );
    this.addChild( this.coefficientNode );
    this.coefficientNode.x = this.symbolNode.x - this.coefficientNode.width - 2;
    this.coefficientNode.centerY = capHeight / 2;
  }

  return inherit( Node, TermNode, {
    setEditable: function( editable ) {
      this.coefficientNode.pickable = editable;
    },
    /**
     * get height of standard uppercase letter
     * */
    getCapHeight: function() {
      return new SubSupText( 'T', SUBSUP_OPTIONS ).height;
    }
  } );

} );
