// Copyright 2014-2025, University of Colorado Boulder

/**
 * Game reward for this simulation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Element from '../../../../nitroglycerin/js/Element.js';
import AtomNode from '../../../../nitroglycerin/js/nodes/AtomNode.js';
import C2H2Node from '../../../../nitroglycerin/js/nodes/C2H2Node.js';
import C2H4Node from '../../../../nitroglycerin/js/nodes/C2H4Node.js';
import C2H5ClNode from '../../../../nitroglycerin/js/nodes/C2H5ClNode.js';
import C2H5OHNode from '../../../../nitroglycerin/js/nodes/C2H5OHNode.js';
import C2H6Node from '../../../../nitroglycerin/js/nodes/C2H6Node.js';
import CH2ONode from '../../../../nitroglycerin/js/nodes/CH2ONode.js';
import CH3OHNode from '../../../../nitroglycerin/js/nodes/CH3OHNode.js';
import CH4Node from '../../../../nitroglycerin/js/nodes/CH4Node.js';
import Cl2Node from '../../../../nitroglycerin/js/nodes/Cl2Node.js';
import CNode from '../../../../nitroglycerin/js/nodes/CNode.js';
import CO2Node from '../../../../nitroglycerin/js/nodes/CO2Node.js';
import CONode from '../../../../nitroglycerin/js/nodes/CONode.js';
import CS2Node from '../../../../nitroglycerin/js/nodes/CS2Node.js';
import F2Node from '../../../../nitroglycerin/js/nodes/F2Node.js';
import H2Node from '../../../../nitroglycerin/js/nodes/H2Node.js';
import H2ONode from '../../../../nitroglycerin/js/nodes/H2ONode.js';
import H2SNode from '../../../../nitroglycerin/js/nodes/H2SNode.js';
import HClNode from '../../../../nitroglycerin/js/nodes/HClNode.js';
import HFNode from '../../../../nitroglycerin/js/nodes/HFNode.js';
import N2Node from '../../../../nitroglycerin/js/nodes/N2Node.js';
import N2ONode from '../../../../nitroglycerin/js/nodes/N2ONode.js';
import NH3Node from '../../../../nitroglycerin/js/nodes/NH3Node.js';
import NO2Node from '../../../../nitroglycerin/js/nodes/NO2Node.js';
import NONode from '../../../../nitroglycerin/js/nodes/NONode.js';
import O2Node from '../../../../nitroglycerin/js/nodes/O2Node.js';
import OF2Node from '../../../../nitroglycerin/js/nodes/OF2Node.js';
import P4Node from '../../../../nitroglycerin/js/nodes/P4Node.js';
import PCl3Node from '../../../../nitroglycerin/js/nodes/PCl3Node.js';
import PCl5Node from '../../../../nitroglycerin/js/nodes/PCl5Node.js';
import PF3Node from '../../../../nitroglycerin/js/nodes/PF3Node.js';
import PH3Node from '../../../../nitroglycerin/js/nodes/PH3Node.js';
import SNode from '../../../../nitroglycerin/js/nodes/SNode.js';
import SO2Node from '../../../../nitroglycerin/js/nodes/SO2Node.js';
import SO3Node from '../../../../nitroglycerin/js/nodes/SO3Node.js';
import FaceNode from '../../../../scenery-phet/js/FaceNode.js';
import StarNode from '../../../../scenery-phet/js/StarNode.js';
import RewardNode from '../../../../vegas/js/RewardNode.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import BCEConstants from '../../common/BCEConstants.js';

const NUMBER_OF_NODES = 150;
const ATOM_NODE_OPTIONS = BCEConstants.ATOM_NODE_OPTIONS;
const MOLECULE_NODE_OPTIONS = {
  atomNodeOptions: ATOM_NODE_OPTIONS
};

// nodes used in reward, indexed by game level
const NODES = [

  // level 1: atoms
  [
    new AtomNode( Element.C, ATOM_NODE_OPTIONS ),
    new AtomNode( Element.Cl, ATOM_NODE_OPTIONS ),
    new AtomNode( Element.F, ATOM_NODE_OPTIONS ),
    new AtomNode( Element.H, ATOM_NODE_OPTIONS ),
    new AtomNode( Element.N, ATOM_NODE_OPTIONS ),
    new AtomNode( Element.O, ATOM_NODE_OPTIONS ),
    new AtomNode( Element.P, ATOM_NODE_OPTIONS ),
    new AtomNode( Element.S, ATOM_NODE_OPTIONS )
  ],

  // level 2: molecules
  [
    new CNode( MOLECULE_NODE_OPTIONS ),
    new C2H2Node( MOLECULE_NODE_OPTIONS ),
    new C2H4Node( MOLECULE_NODE_OPTIONS ),
    new C2H5ClNode( MOLECULE_NODE_OPTIONS ),
    new C2H5OHNode( MOLECULE_NODE_OPTIONS ),
    new C2H6Node( MOLECULE_NODE_OPTIONS ),
    new CH2ONode( MOLECULE_NODE_OPTIONS ),
    new CH3OHNode( MOLECULE_NODE_OPTIONS ),
    new CH4Node( MOLECULE_NODE_OPTIONS ),
    new Cl2Node( MOLECULE_NODE_OPTIONS ),
    new CONode( MOLECULE_NODE_OPTIONS ),
    new CO2Node( MOLECULE_NODE_OPTIONS ),
    new CS2Node( MOLECULE_NODE_OPTIONS ),
    new F2Node( MOLECULE_NODE_OPTIONS ),
    new CONode( MOLECULE_NODE_OPTIONS ),
    new H2Node( MOLECULE_NODE_OPTIONS ),
    new H2ONode( MOLECULE_NODE_OPTIONS ),
    new H2SNode( MOLECULE_NODE_OPTIONS ),
    new HClNode( MOLECULE_NODE_OPTIONS ),
    new HFNode( MOLECULE_NODE_OPTIONS ),
    new N2Node( MOLECULE_NODE_OPTIONS ),
    new N2ONode( MOLECULE_NODE_OPTIONS ),
    new NH3Node( MOLECULE_NODE_OPTIONS ),
    new NONode( MOLECULE_NODE_OPTIONS ),
    new NO2Node( MOLECULE_NODE_OPTIONS ),
    new O2Node( MOLECULE_NODE_OPTIONS ),
    new OF2Node( MOLECULE_NODE_OPTIONS ),
    new P4Node( MOLECULE_NODE_OPTIONS ),
    new PCl3Node( MOLECULE_NODE_OPTIONS ),
    new PCl5Node( MOLECULE_NODE_OPTIONS ),
    new PH3Node( MOLECULE_NODE_OPTIONS ),
    new PF3Node( MOLECULE_NODE_OPTIONS ),
    new SNode( MOLECULE_NODE_OPTIONS ),
    new SO2Node( MOLECULE_NODE_OPTIONS ),
    new SO3Node( MOLECULE_NODE_OPTIONS )
  ],

  // level 3: faces and stars
  [
    new FaceNode( 40, { headStroke: 'black' } ),
    new StarNode()
  ]
];

export default class BCERewardNode extends RewardNode {

  /**
   * @param levelNumber - game level number, 1-based numbering
   */
  public constructor( levelNumber: number ) {
    const index = levelNumber - 1;
    super( {
      nodes: RewardNode.createRandomNodes( NODES[ index ], NUMBER_OF_NODES )
    } );
  }
}

balancingChemicalEquations.register( 'BCERewardNode', BCERewardNode );