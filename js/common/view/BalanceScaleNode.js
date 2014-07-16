// Copyright 2002-2014, University of Colorado

/**
 * A balance scale, depicts the relationship between the atom count
 * on the left and right side of an equation.
 * <p>
 * The 2 main parts of a balance scale are the fulcrum and the beam.
 * Origin is at the tip of the fulcrum.
 *
 * @author Vasily Shakhov (mlearner.com)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var BeamNode = require( 'BALANCING_CHEMICAL_EQUATIONS/common/view/BeamNode' );
  var FulcrumNode = require( 'BALANCING_CHEMICAL_EQUATIONS/common/view/FulcrumNode' );
  var AtomNode = require( 'NITROGLYCERIN/nodes/AtomNode' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var Vector2 = require( 'DOT/Vector2' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var BCEConstants = require( 'BALANCING_CHEMICAL_EQUATIONS/common/BCEConstants' );

  // constants
  var FULCRUM_SIZE = new Dimension2( 60, 45 );
  var BEAM_LENGTH = 205;
  var BEAM_THICKNESS = 6;
  var NUMBER_OF_TILT_ANGLES = 6;
  var ATOMS_IN_PILE_BASE = 5; // number of atoms along the base of each pile

  /**
   * @param {NITROGLYCERIN.Element} element the atom that we're displaying on the scale
   * @param {Number} leftNumberOfAtoms
   * @param {Number} rightNumberOfAtoms
   * @param {Boolean} highlighted whether the beam is highlighted (used to indicate whether the scale is balanaced)
   * @param {Object} options
   * @constructor
   */
  function BalanceScaleNode( element, leftNumberOfAtoms, rightNumberOfAtoms, highlighted, options ) {

    Node.call( this );

    this.element = element;
    this.leftNumberOfAtoms = leftNumberOfAtoms; // @private
    this.rightNumberOfAtoms = rightNumberOfAtoms; // @private

    this.addChild( new FulcrumNode( element, FULCRUM_SIZE ) );

    this.beamNode = new BeamNode( BEAM_LENGTH, BEAM_THICKNESS, { transformBounds: true /* issue #77 */ } ); // @private
    this.addChild( this.beamNode );
    this.beamNode.bottom = 0;

    this.atomPilesParentNode = new Node( { transformBounds: true /* issue #77 */ } ); // @private
    this.addChild( this.atomPilesParentNode );

    this.mutate( options );

    this.setHighlighted( highlighted );
    this.updateNode();
  }

  /**
   * Creates a triangular pile of atoms.
   * Atoms are populated one row at a time, starting from the base of the triangle and working up.
   * Origin is at the lower-left corner of the pile.
   *
   * @param {number} numberOfAtoms
   * @param {Element} element
   * @return {Node} node with atoms
   */
  var createAtomPile = function( numberOfAtoms, element ) {
    var parent = new Node();
    var atomsInRow = ATOMS_IN_PILE_BASE;
    var row = 0;
    var pile = 0;
    var x = 0;
    var y = 0;
    for ( var i = 0; i < numberOfAtoms; i++ ) {
      var atomNode = new AtomNode( element, BCEConstants.ATOM_OPTIONS );
      atomNode.scale( BCEConstants.MOLECULE_SCALE_FACTOR );
      parent.addChild( atomNode );
      atomNode.translation = new Vector2( x + ( atomNode.width / 2 ), y - ( atomNode.height / 2 ) );
      atomsInRow--;
      if ( atomsInRow > 0 ) {
        // continue with current row
        x = atomNode.bounds.maxX;
      }
      else if ( row < ATOMS_IN_PILE_BASE - 1 ) {
        // move to next row in current triangular pile
        row++;
        atomsInRow = ATOMS_IN_PILE_BASE - row;
        x = ( pile + row ) * ( atomNode.width / 2 );
        y = -( row * 0.85 * atomNode.height );
      }
      else {
        // start a new pile, offset from the previous pile
        row = 0;
        pile++;
        atomsInRow = ATOMS_IN_PILE_BASE;
        x = pile * ( atomNode.width / 2 );
        y = 0;
      }
    }
    return parent;
  };

  return inherit( Node, BalanceScaleNode, {

    /**
     * set highlighting of the beam, use to indicate whether the scale is balanced.
     * @param {Boolean} highlighted
     */
    setHighlighted: function( highlighted ) {
      this.beamNode.setHighlighted( highlighted );
    },

    /**
     * Places piles of atoms on the ends of the beam, with a count of the number of
     * atoms above each pile.  Then rotates the beam and stuff on it to indicate the
     * relative balance between the left and right piles.
     * @private
     */
    updateNode: function() {

      // all dynamic stuff is above the beam, and is children of atomPilesParentNode
      this.atomPilesParentNode.removeAllChildren();

      // left pile of atoms, centered on left-half of beam width number
      var leftPileChildren = [new Text( this.leftNumberOfAtoms, {font: new PhetFont( 18 ), fill: 'black'} )];
      if ( this.leftNumberOfAtoms > 0 ) {
        leftPileChildren.push( createAtomPile( this.leftNumberOfAtoms, this.element ) );
      }

      var leftPileNode = new VBox( {
        children: leftPileChildren,
        spacing: 5,
        centerX: -0.25 * BEAM_LENGTH,
        bottom: -1 - BEAM_THICKNESS / 2
      } );
      this.atomPilesParentNode.addChild( leftPileNode );

      // right pile of atoms, centered on left-half of beam width number
      var rightPileChildren = [new Text( this.rightNumberOfAtoms, {font: new PhetFont( 18 ), fill: 'black'} )];
      if ( this.rightNumberOfAtoms > 0 ) {
        rightPileChildren.push( createAtomPile( this.rightNumberOfAtoms, this.element ) );
      }

      var rightPileNode = new VBox( {
        children: rightPileChildren,
        spacing: 5,
        centerX: 0.25 * BEAM_LENGTH,
        bottom: -1 - BEAM_THICKNESS / 2
      } );
      this.atomPilesParentNode.addChild( rightPileNode );

      // rotate beam and piles on fulcrum
      var maxAngle = ( Math.PI / 2 ) - Math.acos( FULCRUM_SIZE.height / ( BEAM_LENGTH / 2 ) );
      var difference = this.rightNumberOfAtoms - this.leftNumberOfAtoms;
      var angle = 0;
      if ( Math.abs( difference ) >= NUMBER_OF_TILT_ANGLES ) {
        // max tilt
        var sign = Math.abs( difference ) / difference;
        angle = sign * maxAngle;
      }
      else {
        // partial tilt
        angle = difference * ( maxAngle / NUMBER_OF_TILT_ANGLES );
      }
      this.beamNode.setRotation( angle );
      this.atomPilesParentNode.setRotation( angle );
    }
  }, {
    /**
     * @static
     * @return {Number} length of beam
     */
    getBeamLength: function() {
      return BEAM_LENGTH;
    }
  } );
} );