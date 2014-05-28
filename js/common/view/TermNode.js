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
  var CoefficientNode = require( 'BALANCING_CHEMICAL_EQUATIONS/common/view/CoefficientNode' );


  function TermNode( coefficientRange, term, editable ) {
    Node.call( this );

    this.symbolNode = term.molecule.symbol;
    this.addChild( this.symbolNode );

    this.coefficientNode = new CoefficientNode( coefficientRange, term.userCoefficient, editable );
    this.addChild( this.coefficientNode );
    this.coefficientNode.x = this.symbolNode.x - this.coefficientNode.width - 2;
    this.coefficientNode.centerY = this.symbolNode.centerY;

  }

  return inherit( Node, TermNode, {
    setEditable: function( editable ) {
      this.coefficientNode.setEditable( editable );
    },
    cleanup: function() {
      this.coefficientNode.removeCoefficientObserver();
    }
  } );

} );
