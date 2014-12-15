// Copyright 2002-2014, University of Colorado Boulder

/**
 * Model of a molecule.
 *
 * @author Vasily Shakhov (mlearner.com)
 */
define( function( require ) {
  'use strict';

  // modules
  var Atom = require( 'NITROGLYCERIN/Atom' );
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   * @param {NITROGLYCERIN.node} nodeConstructor constructor of molecule from NITROGLYCERIN
   * @param {string} symbolText html string
   * @param {NITROGLYCERIN.Element[]} elements
   * @constructor
   */
  function Molecule( nodeConstructor, symbolText, elements ) {
    var self = this;

    this.nodeConstructor = nodeConstructor;
    this.symbol = symbolText;
    this.atoms = [];
    elements.forEach( function( element ) {
      self.atoms.push( new Atom( element ) );
    } );
  }

  return inherit( Object, Molecule, {

    /**
     * Any molecule with more than 5 atoms is considered "big".
     * This affects degree of difficulty in the Game.
     * @return {boolean}
     */
    isBig: function() {
      return this.atoms.length > 5;
    }
  } );
} );
