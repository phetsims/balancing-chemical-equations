// Copyright 2014-2025, University of Colorado Boulder

/**
 * BalanceScaleNode displays a balance scale, which depicts the relationship between the atom count on the left
 * and right side of an equation. The 2 main parts of a balance scale are the fulcrum and the beam.
 *
 * The origin is at the tip of the fulcrum.
 *
 * @author Vasily Shakhov (mlearner.com)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Element from '../../../../nitroglycerin/js/Element.js';
import AtomNode from '../../../../nitroglycerin/js/nodes/AtomNode.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Node, { NodeOptions, NodeTranslationOptions } from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import BCEConstants from '../BCEConstants.js';
import BalanceBeamNode from './BalanceBeamNode.js';
import BalanceFulcrumNode from './BalanceFulcrumNode.js';

const FULCRUM_SIZE = new Dimension2( 60, 45 );
const BEAM_LENGTH = 205;
const BEAM_THICKNESS = 6;
//TODO https://github.com/phetsims/balancing-chemical-equations/issues/170 Should we increase NUMBER_OF_TILT_ANGLES, or fix how tilting works?
const NUMBER_OF_TILT_ANGLES = 6;
const COUNT_Y_SPACING = 3;
const ATOMS_IN_PILE_BASE = 5; // number of atoms along the base of each pile
const TEXT_OPTIONS = {
  font: new PhetFont( 18 ),
  fill: 'black'
};

type SelfOptions = EmptySelfOptions;

type BalanceScaleNodeOptions = SelfOptions & NodeTranslationOptions;

export default class BalanceScaleNode extends Node {

  private readonly element: Element;
  private readonly leftNumberOfAtomsProperty: TReadOnlyProperty<number>;
  private readonly rightNumberOfAtomsProperty: TReadOnlyProperty<number>;
  private readonly beamNode: BalanceBeamNode;
  private readonly leftPileNode: Node;
  private readonly rightPileNode: Node;
  private readonly leftCountText: Text;
  private readonly rightCountText: Text;
  private readonly pilesParent: Node;

  private readonly balanceScaleNodeDispose: () => void;

  /**
   * @param element the atom that we're displaying on the scale
   * @param leftNumberOfAtomsProperty number of atoms on left (reactants) side of the beam
   * @param rightNumberOfAtomsProperty number of atoms on right (products) side of the beam
   * @param isBalancedProperty
   * @param [providedOptions]
   */
  public constructor( element: Element,
                      leftNumberOfAtomsProperty: TReadOnlyProperty<number>,
                      rightNumberOfAtomsProperty: TReadOnlyProperty<number>,
                      isBalancedProperty: TReadOnlyProperty<boolean>,
                      providedOptions?: BalanceScaleNodeOptions ) {

    const options = optionize<BalanceScaleNodeOptions, SelfOptions, NodeOptions>()( {}, providedOptions );

    super();

    this.element = element;
    this.leftNumberOfAtomsProperty = leftNumberOfAtomsProperty;
    this.rightNumberOfAtomsProperty = rightNumberOfAtomsProperty;

    // fulcrum
    const fulcrumNode = new BalanceFulcrumNode( {
      size: FULCRUM_SIZE,
      symbol: element.symbol
    } );

    this.beamNode = new BalanceBeamNode( BEAM_LENGTH, BEAM_THICKNESS, {
      bottom: 0,
      transformBounds: true // see https://github.com/phetsims/balancing-chemical-equations/issues/77
    } );

    // left pile & count
    this.leftPileNode = new Node();
    this.leftCountText = new Text( leftNumberOfAtomsProperty.value, TEXT_OPTIONS );

    // right pile & count
    this.rightPileNode = new Node();
    this.rightCountText = new Text( rightNumberOfAtomsProperty.value, TEXT_OPTIONS );

    // parent for both piles, to simplify rotation
    this.pilesParent = new Node( {
      children: [ this.leftPileNode, this.leftCountText, this.rightPileNode, this.rightCountText ],
      transformBounds: true // see https://github.com/phetsims/balancing-chemical-equations/issues/77
    } );

    options.children = [ fulcrumNode, this.beamNode, this.pilesParent ];
    this.mutate( options );

    // highlight the beam
    const highlightListener = ( isBalanced: boolean ) => this.beamNode.setHighlighted( isBalanced );
    isBalancedProperty.link( highlightListener );

    // update piles
    const updateNodeBind = this.updateNode.bind( this );
    leftNumberOfAtomsProperty.lazyLink( updateNodeBind );
    rightNumberOfAtomsProperty.lazyLink( updateNodeBind );
    this.updateNode();

    // unlink from Properties
    this.balanceScaleNodeDispose = () => {
      isBalancedProperty.unlink( highlightListener );
      leftNumberOfAtomsProperty.unlink( updateNodeBind );
      rightNumberOfAtomsProperty.unlink( updateNodeBind );
    };
  }

  public override dispose(): void {
    this.balanceScaleNodeDispose();
    super.dispose();
  }

  /**
   * Places piles of atoms on the ends of the beam, with a count of the number of
   * atoms above each pile.  Then rotates the beam and stuff on it to indicate the
   * relative balance between the left and right piles.
   */
  private updateNode(): void {

    // update piles on beam in neutral orientation
    this.beamNode.setRotation( 0 );
    this.pilesParent.setRotation( 0 );

    const leftNumberOfAtoms = this.leftNumberOfAtomsProperty.value;
    const rightNumberOfAtoms = this.rightNumberOfAtomsProperty.value;

    // update piles
    updatePile( this.element, leftNumberOfAtoms, this.leftPileNode, this.leftCountText, this.beamNode.left + 0.25 * this.beamNode.width, this.beamNode.top );
    updatePile( this.element, rightNumberOfAtoms, this.rightPileNode, this.rightCountText, this.beamNode.right - 0.25 * this.beamNode.width, this.beamNode.top );

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
 * @param element
 * @param numberOfAtoms - number of atoms that will be visible in the pile
 * @param pileNode - pile that will be modified
 * @param countText - displays numberOfAtoms
 * @param pileCenterX - x-coordinate of the pile's center, relative to the beam
 * @param beamTop - y-coordinate of the beam's top
 */
function updatePile( element: Element, numberOfAtoms: number, pileNode: Node, countText: Text,
                     pileCenterX: number, beamTop: number ): void {

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
      atomNode = new AtomNode( element, BCEConstants.ATOM_NODE_OPTIONS );
      atomNode.scale( BCEConstants.PARTICLES_SCALE_FACTOR );
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
  countText.string = numberOfAtoms;

  // layout
  if ( pileNode.visibleBounds.isEmpty() ) {
    // pile is empty, just deal with count
    countText.centerX = pileCenterX;
    countText.bottom = beamTop - COUNT_Y_SPACING;
  }
  else {
    // account for invisible atoms in the pile
    pileNode.centerX = pileCenterX + ( pileNode.width - pileNode.visibleBounds.width ) / 2;
    pileNode.bottom = beamTop + 1;
    countText.centerX = pileCenterX;
    countText.bottom = pileNode.visibleBounds.top - COUNT_Y_SPACING;
  }
}

balancingChemicalEquations.register( 'BalanceScaleNode', BalanceScaleNode );