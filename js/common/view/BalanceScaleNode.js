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
   * @param {Property<Number>} leftNumberOfAtomsProperty
   * @param {Property<Number>} rightNumberOfAtomsProperty
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

    // parent for both piles, to simplify rotation
    this.pilesParent = new Node( { transformBounds: true /* issue #77 */ } ); // @private

    // left pile
    this.leftCountNode = new Text( leftNumberOfAtomsProperty.get(), TEXT_OPTIONS ); // @private
    this.leftPileParent = new Node();
    this.leftVBox = new VBox( {
      children: [ this.leftCountNode, this.leftPileParent ],
      spacing: VBOX_SPACING
    } );
    this.pilesParent.addChild( this.leftVBox );

    // right pile
    this.rightCountNode = new Text( rightNumberOfAtomsProperty.get(), TEXT_OPTIONS ); // @private
    this.rightPileParent = new Node();
    this.rightVBox = new VBox( {
      children: [ this.rightCountNode, this.rightPileParent ],
      spacing: VBOX_SPACING
    } );
    this.pilesParent.addChild( this.rightVBox );

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
        x = atomNode.right;
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
     * Places piles of atoms on the ends of the beam, with a count of the number of
     * atoms above each pile.  Then rotates the beam and stuff on it to indicate the
     * relative balance between the left and right piles.
     * @private
     */
    updateNode: function() {

      var leftNumberOfAtoms = this.leftNumberOfAtomsProperty.get();
      var rightNumberOfAtoms = this.rightNumberOfAtomsProperty.get();

      // rebuild left pile
      this.leftPileParent.removeAllChildren();
      this.leftCountNode.text = leftNumberOfAtoms;
      if ( leftNumberOfAtoms > 0 ) {
        this.leftPileParent.addChild( createAtomPile( leftNumberOfAtoms, this.element ) );
      }

      // rebuild right pile
      this.rightPileParent.removeAllChildren();
      this.rightCountNode.text = rightNumberOfAtoms;
      if ( rightNumberOfAtoms > 0 ) {
        this.rightPileParent.addChild( createAtomPile( rightNumberOfAtoms, this.element ) );
      }

      // position piles on beam
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