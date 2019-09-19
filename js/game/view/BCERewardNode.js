// Copyright 2014-2018, University of Colorado Boulder

/**
 * Game reward for this simulations.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const AtomNode = require( 'NITROGLYCERIN/nodes/AtomNode' );
  const balancingChemicalEquations = require( 'BALANCING_CHEMICAL_EQUATIONS/balancingChemicalEquations' );
  const BCEConstants = require( 'BALANCING_CHEMICAL_EQUATIONS/common/BCEConstants' );
  const Element = require( 'NITROGLYCERIN/Element' );
  const FaceNode = require( 'SCENERY_PHET/FaceNode' );
  const inherit = require( 'PHET_CORE/inherit' );
  const RewardNode = require( 'VEGAS/RewardNode' );
  const StarNode = require( 'SCENERY_PHET/StarNode' );

  // modules - molecules
  const C2H2Node = require( 'NITROGLYCERIN/nodes/C2H2Node' );
  const C2H4Node = require( 'NITROGLYCERIN/nodes/C2H4Node' );
  const C2H5ClNode = require( 'NITROGLYCERIN/nodes/C2H5ClNode' );
  const C2H5OHNode = require( 'NITROGLYCERIN/nodes/C2H5OHNode' );
  const C2H6Node = require( 'NITROGLYCERIN/nodes/C2H6Node' );
  const CH2ONode = require( 'NITROGLYCERIN/nodes/CH2ONode' );
  const CH3OHNode = require( 'NITROGLYCERIN/nodes/CH3OHNode' );
  const CH4Node = require( 'NITROGLYCERIN/nodes/CH4Node' );
  const Cl2Node = require( 'NITROGLYCERIN/nodes/Cl2Node' );
  const CNode = require( 'NITROGLYCERIN/nodes/CNode' );
  const CO2Node = require( 'NITROGLYCERIN/nodes/CO2Node' );
  const CONode = require( 'NITROGLYCERIN/nodes/CONode' );
  const CS2Node = require( 'NITROGLYCERIN/nodes/CS2Node' );
  const F2Node = require( 'NITROGLYCERIN/nodes/F2Node' );
  const H2Node = require( 'NITROGLYCERIN/nodes/H2Node' );
  const H2ONode = require( 'NITROGLYCERIN/nodes/H2ONode' );
  const H2SNode = require( 'NITROGLYCERIN/nodes/H2SNode' );
  const HClNode = require( 'NITROGLYCERIN/nodes/HClNode' );
  const HFNode = require( 'NITROGLYCERIN/nodes/HFNode' );
  const N2Node = require( 'NITROGLYCERIN/nodes/N2Node' );
  const N2ONode = require( 'NITROGLYCERIN/nodes/N2ONode' );
  const NH3Node = require( 'NITROGLYCERIN/nodes/NH3Node' );
  const NO2Node = require( 'NITROGLYCERIN/nodes/NO2Node' );
  const NONode = require( 'NITROGLYCERIN/nodes/NONode' );
  const O2Node = require( 'NITROGLYCERIN/nodes/O2Node' );
  const OF2Node = require( 'NITROGLYCERIN/nodes/OF2Node' );
  const P4Node = require( 'NITROGLYCERIN/nodes/P4Node' );
  const PCl3Node = require( 'NITROGLYCERIN/nodes/PCl3Node' );
  const PCl5Node = require( 'NITROGLYCERIN/nodes/PCl5Node' );
  const PF3Node = require( 'NITROGLYCERIN/nodes/PF3Node' );
  const PH3Node = require( 'NITROGLYCERIN/nodes/PH3Node' );
  const SNode = require( 'NITROGLYCERIN/nodes/SNode' );
  const SO2Node = require( 'NITROGLYCERIN/nodes/SO2Node' );
  const SO3Node = require( 'NITROGLYCERIN/nodes/SO3Node' );

  // constants
  var NUMBER_OF_NODES = 150;
  var ATOM_OPTIONS = BCEConstants.ATOM_OPTIONS;
  var MOLECULE_OPTIONS = { atomOptions: BCEConstants.ATOM_OPTIONS };

  // nodes used in reward, indexed by game level
  var NODES = [

    // level 1: atoms
    [
      new AtomNode( Element.C, ATOM_OPTIONS ),
      new AtomNode( Element.Cl, ATOM_OPTIONS ),
      new AtomNode( Element.F, ATOM_OPTIONS ),
      new AtomNode( Element.H, ATOM_OPTIONS ),
      new AtomNode( Element.N, ATOM_OPTIONS ),
      new AtomNode( Element.O, ATOM_OPTIONS ),
      new AtomNode( Element.P, ATOM_OPTIONS ),
      new AtomNode( Element.S, ATOM_OPTIONS )
    ],

    // level 2: molecules
    [
      new CNode( MOLECULE_OPTIONS ),
      new C2H2Node( MOLECULE_OPTIONS ),
      new C2H4Node( MOLECULE_OPTIONS ),
      new C2H5ClNode( MOLECULE_OPTIONS ),
      new C2H5OHNode( MOLECULE_OPTIONS ),
      new C2H6Node( MOLECULE_OPTIONS ),
      new CH2ONode( MOLECULE_OPTIONS ),
      new CH3OHNode( MOLECULE_OPTIONS ),
      new CH4Node( MOLECULE_OPTIONS ),
      new Cl2Node( MOLECULE_OPTIONS ),
      new CONode( MOLECULE_OPTIONS ),
      new CO2Node( MOLECULE_OPTIONS ),
      new CS2Node( MOLECULE_OPTIONS ),
      new F2Node( MOLECULE_OPTIONS ),
      new CONode( MOLECULE_OPTIONS ),
      new H2Node( MOLECULE_OPTIONS ),
      new H2ONode( MOLECULE_OPTIONS ),
      new H2SNode( MOLECULE_OPTIONS ),
      new HClNode( MOLECULE_OPTIONS ),
      new HFNode( MOLECULE_OPTIONS ),
      new N2Node( MOLECULE_OPTIONS ),
      new N2ONode( MOLECULE_OPTIONS ),
      new NH3Node( MOLECULE_OPTIONS ),
      new NONode( MOLECULE_OPTIONS ),
      new NO2Node( MOLECULE_OPTIONS ),
      new O2Node( MOLECULE_OPTIONS ),
      new OF2Node( MOLECULE_OPTIONS ),
      new P4Node( MOLECULE_OPTIONS ),
      new PCl3Node( MOLECULE_OPTIONS ),
      new PCl5Node( MOLECULE_OPTIONS ),
      new PH3Node( MOLECULE_OPTIONS ),
      new PF3Node( MOLECULE_OPTIONS ),
      new SNode( MOLECULE_OPTIONS ),
      new SO2Node( MOLECULE_OPTIONS ),
      new SO3Node( MOLECULE_OPTIONS )
    ],

    // level 3: faces and stars
    [
      new FaceNode( 40, { headStroke: 'black' } ),
      new StarNode()
    ]
  ];

  /**
   * @param {number} level game level
   * @constructor
   */
  function BCERewardNode( level ) {
    assert && assert( level >= 0 && level < NODES.length );
    RewardNode.call( this, { nodes: RewardNode.createRandomNodes( NODES[ level ], NUMBER_OF_NODES ) } );
  }

  balancingChemicalEquations.register( 'BCERewardNode', BCERewardNode );

  return inherit( RewardNode, BCERewardNode );
} );
