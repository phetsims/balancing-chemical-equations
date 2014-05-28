// Copyright 2002-2014, University of Colorado Boulder

/**
 * Factory for creating molecule nodes.
 *
 * @author Vasily Shakhov (mlearner.com)
 */
define( function( require ) {
  'use strict';

  // modules
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var SubSupText = require( 'SCENERY_PHET/SubSupText' );
  var Atom = require( 'NITROGLYCERIN/nodes/H2Node' );
  var Element = require( 'NITROGLYCERIN/Element' );
  var CH4Node = require( 'NITROGLYCERIN/nodes/CH4Node' );
  var CO2Node = require( 'NITROGLYCERIN/nodes/CO2Node' );
  var H2Node = require( 'NITROGLYCERIN/nodes/H2Node' );
  var O2Node = require( 'NITROGLYCERIN/nodes/O2Node' );
  var H2ONode = require( 'NITROGLYCERIN/nodes/H2ONode' );
  var N2Node = require( 'NITROGLYCERIN/nodes/N2Node' );
  var NH3Node = require( 'NITROGLYCERIN/nodes/NH3Node' );

  // constants related to text
  var FONT_SIZE = 36;
  var FONT = new PhetFont( FONT_SIZE );
  var SUBSUP_OPTIONS = {font: FONT, supScale: 1}; // options for all instances of SubSupNode

  //TODO SUBSUP_OPTIONS to EquationNode
  var Molecule = function( image, symbolText, elements ) {
    var self = this;

    this.image = image;
    this.symbol = new SubSupText( symbolText, SUBSUP_OPTIONS );
    this.atoms = [];
    elements.forEach( function( element ) {
      self.atoms.push( new Atom( element ) );
    } );
  };

  /**
   * Any molecule with more than 5 atoms is considered "big".
   * This affects degree of difficulty in the Game.
   *
   * @return
   */
  Molecule.prototype.isBig = function() {
    return this.atoms.length > 5;
  };

  return {
    H2: function() {
      return new Molecule( new H2Node(), 'H<sub>2</sub>', [Element.H, Element.H] );
    },
    H2O: function() {
      return new Molecule( new H2ONode(), 'H<sub>2</sub>O', [Element.H, Element.H, Element.O] );
    },
    CH4: function() {
      return new Molecule( new CH4Node(), 'CH<sub>4</sub>', [Element.C, Element.H, Element.H, Element.H, Element.H] );
    },
    CO2: function() {
      return new Molecule( new CO2Node(), 'CO<sub>2</sub>', [Element.C, Element.O, Element.O] );
    },
    N2: function() {
      return new Molecule( new N2Node(), 'N<sub>2</sub>', [Element.N, Element.N, Element.O] );
    },
    NH3: function() {
      return new Molecule( new NH3Node(), 'NH<sub>3</sub>', [Element.N, Element.H, Element.H, Element.H] );
    },
    O2: function() {
      return new Molecule( new O2Node(), 'O<sub>2</sub>', [Element.O, Element.O] );
    }
  };

} );
