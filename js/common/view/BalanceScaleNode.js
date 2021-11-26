// Copyright 2014-2021, University of Colorado Boulder

/**
 * A balance scale, depicts the relationship between the atom count
 * on the left and right side of an equation.
 *
 * The 2 main parts of a balance scale are the fulcrum and the beam.
 * Origin is at the tip of the fulcrum.
 *
 * @author Vasily Shakhov (mlearner.com)
 */

import Dimension2 from '../../../../dot/js/Dimension2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import AtomNode from '../../../../nitroglycerin/js/nodes/AtomNode.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Node } from '../../../../scenery/js/imports.js';
import { Text } from '../../../../scenery/js/imports.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import BCEConstants from '../BCEConstants.js';
import BeamNode from './BeamNode.js';
import FulcrumNode from './FulcrumNode.js';

// constants
const FULCRUM_SIZE = new Dimension2( 60, 45 );
const BEAM_LENGTH = 205;
const BEAM_THICKNESS = 6;
const NUMBER_OF_TILT_ANGLES = 6;
const COUNT_Y_SPACING = 3;
const ATOMS_IN_PILE_BASE = 5; // number of atoms along the base of each pile
const TEXT_OPTIONS = { font: new PhetFont( 18 ), fill: 'black' };

class BalanceScaleNode extends Node {

  /**
   * @param {NITROGLYCERIN.Element} element the atom that we're displaying on the scale
   * @param {Property.<number>} leftNumberOfAtomsProperty number of atoms on left (reactants) side of the beam
   * @param {Property.<number>} rightNumberOfAtomsProperty number of atoms on right (products) side of the beam
   * @param {Property.<boolean>} highlightedProperty
   * @param {Object} [options]
   */
  constructor( element, leftNumberOfAtomsProperty, rightNumberOfAtomsProperty, highlightedProperty, options ) {

    super();

    this.element = element; // @private
    this.leftNumberOfAtomsProperty = leftNumberOfAtomsProperty; // @private
    this.rightNumberOfAtomsProperty = rightNumberOfAtomsProperty; // @private

    // fulcrum
    const fulcrumNode = new FulcrumNode( element, FULCRUM_SIZE );

    // @private beam
    this.beamNode = new BeamNode( BEAM_LENGTH, BEAM_THICKNESS, {
      bottom: 0,
      transformBounds: true /* see issue #77 */
    } );

    // left pile & count
    this.leftPileNode = new Node(); // @private
    this.leftCountNode = new Text( leftNumberOfAtomsProperty.get(), TEXT_OPTIONS ); // @private

    // right pile & count
    this.rightPileNode = new Node(); // @private
    this.rightCountNode = new Text( rightNumberOfAtomsProperty.get(), TEXT_OPTIONS ); // @private

    // @private parent for both piles, to simplify rotation
    this.pilesParent = new Node( {
      children: [ this.leftPileNode, this.leftCountNode, this.rightPileNode, this.rightCountNode ],
      transformBounds: true /* see issue #77 */
    } );

    options.children = [ fulcrumNode, this.beamNode, this.pilesParent ];
    this.mutate( options );

    // highlight the beam
    const highlightObserver = highlighted => this.beamNode.setHighlighted( highlighted );
    highlightedProperty.link( highlightObserver );

    // update piles
    const updateNodeBind = this.updateNode.bind( this );
    leftNumberOfAtomsProperty.lazyLink( updateNodeBind );
    rightNumberOfAtomsProperty.lazyLink( updateNodeBind );
    this.updateNode();

    // unlink from Properties
    this.balanceScaleNodeDispose = () => {
      highlightedProperty.unlink( highlightObserver );
      leftNumberOfAtomsProperty.unlink( updateNodeBind );
      rightNumberOfAtomsProperty.unlink( updateNodeBind );
    };
  }

  // @public
  dispose() {
    this.balanceScaleNodeDispose();
    super.dispose();
  }

  /**
   * Places piles of atoms on the ends of the beam, with a count of the number of
   * atoms above each pile.  Then rotates the beam and stuff on it to indicate the
   * relative balance between the left and right piles.
   * @private
   */
  updateNode() {

    // update piles on beam in neutral orientation
    this.beamNode.setRotation( 0 );
    this.pilesParent.setRotation( 0 );

    const leftNumberOfAtoms = this.leftNumberOfAtomsProperty.get();
    const rightNumberOfAtoms = this.rightNumberOfAtomsProperty.get();

    // update piles
    updatePile( this.element, leftNumberOfAtoms, this.leftPileNode, this.leftCountNode, this.beamNode.left + 0.25 * this.beamNode.width, this.beamNode.top );
    updatePile( this.element, rightNumberOfAtoms, this.rightPileNode, this.rightCountNode, this.beamNode.right - 0.25 * this.beamNode.width, this.beamNode.top );

    // rotate beam and piles on fulcrum
    const maxAngle = ( Math.PI / 2 ) - Math.acos( FULCRUM_SIZE.height / ( BEAM_LENGTH / 2 ) );
    const difference = rightNumberOfAtoms - leftNumberOfAtoms;
    let angle = 0;
    if ( Math.abs( difference ) >= NUMBER_OF_TILT_ANGLES ) {
      // max tilt
      const sign = Math.abs( difference ) / difference;
      angle = sign * maxAngle;
    }
    else {
      // partial tilt
      angle = difference * ( maxAngle / NUMBER_OF_TILT_ANGLES );
    }
    this.beamNode.setRotation( angle );
    this.pilesParent.setRotation( angle );
  }
}

/**
 * Updates a triangular pile of atoms.
 * Atoms are populated one row at a time, starting from the base of the triangle and working up.
 * To improve performance:
 * - Atoms are added to the pile as needed.
 * - Atoms are never removed from the pile; they stay in the pile for the lifetime of this node.
 * - The visibility of atoms is adjusted to show the correct number of atoms.
 *
 * @param {Element} element
 * @param {number} numberOfAtoms number of atoms that will be visible in the pile
 * @param {Node} pileNode pile that will be modified
 * @param {Node} countNode displays numberOfAtoms
 * @param {number} pileCenterX x-coordinate of the pile's center, relative to the beam
 * @param {number} beamTop y-coordinate of the beam's top
 */
function updatePile( element, numberOfAtoms, pileNode, countNode, pileCenterX, beamTop ) {

  const nodesInPile = pileNode.getChildrenCount(); // how many atom nodes are currently in the pile
  let pile = 0; // which pile we're working on, layered back-to-front, offset left-to-right
  let row = 0; // the row number, bottom row is zero
  let atomsInRow = 0; // number of atoms that have been added to the current row
  let x = 0;
  let y = 0;
  let atomNode;

  for ( let i = 0; i < Math.max( nodesInPile, numberOfAtoms ); i++ ) {

    if ( i < nodesInPile ) {
      // set visibility of an atom that's already in the pile
      atomNode = pileNode.getChildAt( i );
      atomNode.visible = ( i < numberOfAtoms );
    }
    else {
      // add an atom node
      atomNode = new AtomNode( element, BCEConstants.ATOM_OPTIONS );
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

  // count display
  countNode.text = numberOfAtoms;

  // layout
  if ( pileNode.visibleBounds.isEmpty() ) {
    // pile is empty, just deal with count
    countNode.centerX = pileCenterX;
    countNode.bottom = beamTop - COUNT_Y_SPACING;
  }
  else {
    // account for invisible atoms in the pile
    pileNode.centerX = pileCenterX + ( pileNode.width - pileNode.visibleBounds.width ) / 2;
    pileNode.bottom = beamTop + 1;
    countNode.centerX = pileCenterX;
    countNode.bottom = pileNode.visibleBounds.top - COUNT_Y_SPACING;
  }
}

balancingChemicalEquations.register( 'BalanceScaleNode', BalanceScaleNode );
export default BalanceScaleNode;