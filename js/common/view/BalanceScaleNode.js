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
  var AtomNode = require( 'NITROGLYCERIN/nodes/AtomNode' );
  var BCEConstants = require( 'BALANCING_CHEMICAL_EQUATIONS/common/BCEConstants' );
  var BeamNode = require( 'BALANCING_CHEMICAL_EQUATIONS/common/view/BeamNode' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var FulcrumNode = require( 'BALANCING_CHEMICAL_EQUATIONS/common/view/FulcrumNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var FULCRUM_SIZE = new Dimension2( 60, 45 );
  var BEAM_LENGTH = 205;
  var BEAM_THICKNESS = 6;
  var NUMBER_OF_TILT_ANGLES = 6;
  var VBOX_SPACING = 5;
  var ATOMS_IN_PILE_BASE = 5; // number of atoms along the base of each pile
  var TEXT_OPTIONS = { font: new PhetFont( 18 ), fill: 'black' };

  /**
   * @param {NITROGLYCERIN.Element} element the atom that we're displaying on the scale
   * @param {Property<Number>} leftNumberOfAtomsProperty number of atoms on left (reactants) side of the beam
   * @param {Property<Number>} rightNumberOfAtomsProperty number of atoms on right (products) side of the beam
   * @param {Property<Boolean>} highlightedProperty
   * @param {Object} options
   * @constructor
   */
  function BalanceScaleNode( element, leftNumberOfAtomsProperty, rightNumberOfAtomsProperty, highlightedProperty, options ) {

    var self = this;

    this.element = element; // @private
    this.leftNumberOfAtomsProperty = leftNumberOfAtomsProperty; // @private
    this.rightNumberOfAtomsProperty = rightNumberOfAtomsProperty; // @private

    // fulcrum & beam
    var fulcrumNode = new FulcrumNode( element, FULCRUM_SIZE );
    this.beamNode = new BeamNode( BEAM_LENGTH, BEAM_THICKNESS, { bottom: 0, transformBounds: true /* issue #77 */ } ); // @private

    // left pile
    this.leftCountNode = new Text( leftNumberOfAtomsProperty.get(), TEXT_OPTIONS ); // @private
    this.leftPileNode = new Node(); // @private
    // @private
    this.leftVBox = new VBox( {
      children: [ this.leftCountNode, this.leftPileNode ],
      spacing: VBOX_SPACING
    } );

    // right pile
    this.rightCountNode = new Text( rightNumberOfAtomsProperty.get(), TEXT_OPTIONS ); // @private
    this.rightPileNode = new Node(); // @private
    // @private
    this.rightVBox = new VBox( {
      children: [ this.rightCountNode, this.rightPileNode ],
      spacing: VBOX_SPACING
    } );

    // parent for both piles, to simplify rotation
    this.pilesParent = new Node( {
      children: [ this.leftVBox, this.rightVBox ],
      transformBounds: true /* see issue #77 */
    } ); // @private

    options.children = [ fulcrumNode, this.beamNode, this.pilesParent ];
    Node.call( this, options );

    // highlight the beam
    highlightedProperty.link( function( highlighted ) {
      self.beamNode.setHighlighted( highlighted );
    } );

    // update piles
    var updateNodeBind = this.updateNode.bind( this );
    leftNumberOfAtomsProperty.lazyLink( updateNodeBind );
    rightNumberOfAtomsProperty.lazyLink( updateNodeBind );
    this.updateNode();
  }

  /**
   * Updates a triangular pile of atoms.
   * Atoms are populated one row at a time, starting from the base of the triangle and working up.
   * To improve performance:
   * - Atoms are added to the pile as needed.
   * - Atoms are never removed from the pile; they stay in the pile for the lifetime of this node.
   * - The visibility of atoms is adjusted to show the correct number of atoms.
   *
   * @param {Node} pileNode pile that will be modified
   * @param {number} numberOfAtoms number of atoms that will be visible in the pile
   * @param {Element} element
   */
  var updatePile = function( pileNode, numberOfAtoms, element ) {

    var nodesInPile = pileNode.getChildrenCount(); // how many atom nodes are currently in the pile
    var pile = 0; // which pile we're working on, layered back-to-front, offset left-to-right
    var row = 0; // the row number, bottom row is zero
    var atomsInRow = 0; // number of atoms that have been added to the current row
    var x = 0;
    var y = 0;

    for ( var i = 0; i < numberOfAtoms; i++ ) {

      if ( i < nodesInPile ) {
        // set visibility of an atom that's already in the pile
        pileNode.getChildAt( i ).visible = ( i < numberOfAtoms );
      }
      else {
        // add an atom node
        var atomNode = new AtomNode( element, BCEConstants.ATOM_OPTIONS );
        atomNode.scale( BCEConstants.MOLECULE_SCALE_FACTOR );
        pileNode.addChild( atomNode );
        atomNode.translation = new Vector2( x + ( atomNode.width / 2 ), y - ( atomNode.height / 2 ) );
      }

      // determine position of next atom
      atomsInRow++;
      if ( atomsInRow < ATOMS_IN_PILE_BASE - row ) {
        // continue with current row
        x = atomNode.right;
      }
      else if ( row < ATOMS_IN_PILE_BASE - 1 ) {
        // move to next row in current triangular pile
        row++;
        atomsInRow = 0;
        x = ( pile + row ) * ( atomNode.width / 2 );
        y = -( row * 0.85 * atomNode.height );
      }
      else {
        // start a new pile, offset from the previous pile
        row = 0;
        pile++;
        atomsInRow = 0;
        x = pile * ( atomNode.width / 2 );
        y = 0;
      }
    }
  };

  return inherit( Node, BalanceScaleNode, {

    /**
     * Places piles of atoms on the ends of the beam, with a count of the number of
     * atoms above each pile.  Then rotates the beam and stuff on it to indicate the
     * relative balance between the left and right piles.
     * @private
     */
    updateNode: function() {

      var leftNumberOfAtoms = this.leftNumberOfAtomsProperty.get();
      var rightNumberOfAtoms = this.rightNumberOfAtomsProperty.get();

      // rebuild left pile
      this.leftPileNode.removeAllChildren();
      this.leftCountNode.text = leftNumberOfAtoms;
      if ( leftNumberOfAtoms > 0 ) {
        updatePile( this.leftPileNode, leftNumberOfAtoms, this.element );
      }

      // rebuild right pile
      this.rightPileNode.removeAllChildren();
      this.rightCountNode.text = rightNumberOfAtoms;
      if ( rightNumberOfAtoms > 0 ) {
        updatePile( this.rightPileNode, rightNumberOfAtoms, this.element );
      }

      // position piles on beam, in neutral orientation
      this.beamNode.setRotation( 0 );
      this.pilesParent.setRotation( 0 );
      this.leftVBox.centerX = this.beamNode.left + 0.25 * this.beamNode.width;
      this.rightVBox.centerX = this.beamNode.right - 0.25 * this.beamNode.width;
      this.leftVBox.bottom = this.rightVBox.bottom = this.beamNode.top + 1;

      // rotate beam and piles on fulcrum
      var maxAngle = ( Math.PI / 2 ) - Math.acos( FULCRUM_SIZE.height / ( BEAM_LENGTH / 2 ) );
      var difference = rightNumberOfAtoms - leftNumberOfAtoms;
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
      this.pilesParent.setRotation( angle );
    }
  } );
} );