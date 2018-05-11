// Copyright 2014-2017, University of Colorado Boulder

/**
 * A term in the equation, includes the coefficient and symbol.
 * The coefficient may or may not be editable.
 *
 * @author Vasily Shakhov (mlearner.com)
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var balancingChemicalEquations = require( 'BALANCING_CHEMICAL_EQUATIONS/balancingChemicalEquations' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var NumberPicker = require( 'SCENERY_PHET/NumberPicker' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Property = require( 'AXON/Property' );
  var RichText = require( 'SCENERY/nodes/RichText' );

  /**
   * @param {DOT.Range} coefficientRange
   * @param {EquationTerm} term
   * @param {Object} [options]
   * @constructor
   */
  function TermNode( coefficientRange, term, options ) {

    options = _.extend( {
      fontSize: 32,
      xSpacing: 4
    }, options );

    // @private coefficient picker
    this.coefficientNode = new NumberPicker( term.userCoefficientProperty, new Property( coefficientRange ), {
      color: 'rgb(50,50,50)',
      pressedColor: 'black',
      xMargin: 8,
      yMargin: 0,
      touchAreaXDilation: 30,
      font: new PhetFont( options.fontSize ),
      timerDelay: 400, // ms until the picker starts to fire continuously
      timerInterval: 200 // ms between value change while firing continuously
    } );

    // symbol, non-subscript part of the symbol is vertically centered on the picker
    var richTextOptions = { font: new PhetFont( options.fontSize ), supScale: 1, maxWidth: 75 };
    var symbolNode = new RichText( term.molecule.symbol, richTextOptions );
    symbolNode.left = this.coefficientNode.right + options.xSpacing;
    symbolNode.centerY = this.coefficientNode.centerY + ( symbolNode.height - new RichText( 'H', richTextOptions ).height ) / 2;

    options.children = [ this.coefficientNode, symbolNode ];
    Node.call( this, options );
  }

  balancingChemicalEquations.register( 'TermNode', TermNode );

  return inherit( Node, TermNode, {

    // @public
    dispose: function() {
      this.coefficientNode.dispose();
      Node.prototype.dispose.call( this );
    },

    /**
     * When a term is disabled, it is not pickable and the arrows on its picker are hidden.
     * @param enabled
     * @public
     */
    setEnabled: function( enabled ) {
      this.pickable = enabled;
      this.coefficientNode.setArrowsVisible( enabled );
    }
  } );
} );
