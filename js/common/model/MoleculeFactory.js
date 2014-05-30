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
  var Atom = require( 'NITROGLYCERIN/Atom' );
  var Element = require( 'NITROGLYCERIN/Element' );
  var CH4Node = require( 'NITROGLYCERIN/nodes/CH4Node' );
  var CO2Node = require( 'NITROGLYCERIN/nodes/CO2Node' );
  var H2Node = require( 'NITROGLYCERIN/nodes/H2Node' );
  var O2Node = require( 'NITROGLYCERIN/nodes/O2Node' );
  var H2ONode = require( 'NITROGLYCERIN/nodes/H2ONode' );
  var N2Node = require( 'NITROGLYCERIN/nodes/N2Node' );
  var NH3Node = require( 'NITROGLYCERIN/nodes/NH3Node' );
  var HClNode = require( 'NITROGLYCERIN/nodes/HClNode' );
  var Cl2Node = require( 'NITROGLYCERIN/nodes/Cl2Node' );
  var CONode = require( 'NITROGLYCERIN/nodes/CONode' );
  var CH3OHNode = require( 'NITROGLYCERIN/nodes/CH3OHNode' );
  var C2H6Node = require( 'NITROGLYCERIN/nodes/C2H6Node' );
  var C2H4Node = require( 'NITROGLYCERIN/nodes/C2H4Node' );
  var CNode = require( 'NITROGLYCERIN/nodes/C2H4Node' );
  var NONode = require( 'NITROGLYCERIN/nodes/C2H4Node' );
  var NO2Node = require( 'NITROGLYCERIN/nodes/C2H4Node' );

  // constants related to text
  var FONT_SIZE = 36;
  var FONT = new PhetFont( FONT_SIZE );
  var SUBSUP_OPTIONS = {font: FONT, supScale: 1}; // options for all instances of SubSupNode

  //TODO SUBSUP_OPTIONS to EquationNode
  var Molecule = function( imageConstructor, symbolText, elements ) {
    var self = this;

    this.imageConstructor = imageConstructor;
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
    C: function() {
      return new Molecule( CNode, 'C', [Element.C] );
    },
    Cl2: function() {
      return new Molecule( Cl2Node, 'Cl<sub>2</sub>', [Element.Cl, Element.Cl] );
    },
    CH3OH: function() {
      return new Molecule( CH3OHNode, 'CH<sub>3</sub>OH', [Element.C, Element.H, Element.H, Element.H, Element.O, Element.H] );
    },
    CH4: function() {
      return new Molecule( CH4Node, 'CH<sub>4</sub>', [Element.C, Element.H, Element.H, Element.H, Element.H] );
    },
    C2H4: function() {
      return new Molecule( C2H4Node, 'C<sub>2</sub>H<sub>4</sub>', [Element.C, Element.C, Element.H, Element.H, Element.H, Element.H] );
    },
    C2H6: function() {
      return new Molecule( C2H6Node, 'C<sub>2</sub>H<sub>6</sub>', [Element.C, Element.C, Element.H, Element.H, Element.H, Element.H, Element.H, Element.H] );
    },
    CO: function() {
      return new Molecule( CONode, 'CO', [Element.C, Element.O] );
    },
    CO2: function() {
      return new Molecule( CO2Node, 'CO<sub>2</sub>', [Element.C, Element.O, Element.O] );
    },
    H2: function() {
      return new Molecule( H2Node, 'H<sub>2</sub>', [Element.H, Element.H] );
    },
    H2O: function() {
      return new Molecule( H2ONode, 'H<sub>2</sub>O', [Element.H, Element.H, Element.O] );
    },
    HCl: function() {
      return new Molecule( HClNode, 'HCl', [Element.H, Element.Cl] );
    },
    N2: function() {
      return new Molecule( N2Node, 'N<sub>2</sub>', [Element.N, Element.N] );
    },
    NH3: function() {
      return new Molecule( NH3Node, 'NH<sub>3</sub>', [Element.N, Element.H, Element.H, Element.H] );
    },
    NO: function() {
      return new Molecule( NONode, 'NO', [Element.N, Element.O] );
    },
    NO2: function() {
      return new Molecule( NO2Node, 'NO<sub>2</sub>', [Element.N, Element.O, Element.O] );
    },
    O2: function() {
      return new Molecule( O2Node, 'O<sub>2</sub>', [Element.O, Element.O] );
    }
  };

} );
