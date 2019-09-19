// Copyright 2014-2017, University of Colorado Boulder

/**
 * Model of a molecule.
 *
 * @author Vasily Shakhov (mlearner.com)
 */
define( require => {
  'use strict';

  // modules
  const Atom = require( 'NITROGLYCERIN/Atom' );
  const balancingChemicalEquations = require( 'BALANCING_CHEMICAL_EQUATIONS/balancingChemicalEquations' );
  const inherit = require( 'PHET_CORE/inherit' );

  /**
   * @param {NITROGLYCERIN.node} nodeConstructor constructor of molecule from NITROGLYCERIN
   * @param {string} symbolText html string
   * @param {NITROGLYCERIN.Element[]} elements
   * @constructor
   */
  function Molecule( nodeConstructor, symbolText, elements ) {
    var self = this;

    // @public
    this.nodeConstructor = nodeConstructor;
    this.symbol = symbolText;
    this.atoms = [];

    elements.forEach( function( element ) {
      self.atoms.push( new Atom( element ) );
    } );
  }

  balancingChemicalEquations.register( 'Molecule', Molecule );

  return inherit( Object, Molecule, {

    /**
     * Any molecule with more than 5 atoms is considered "big".
     * This affects degree of difficulty in the Game.
     * @returns {boolean}
     * @public
     */
    isBig: function() {
      return this.atoms.length > 5;
    }
  } );
} );
