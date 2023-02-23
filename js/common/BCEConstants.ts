// Copyright 2014-2023, University of Colorado Boulder

/**
 * A collection of constants that configure global properties.
 * If you change something here, it will change *everywhere* in this project.
 *
 * @author Vasily Shakhov (mlearner.com)
 */

import Bounds2 from '../../../dot/js/Bounds2.js';
import { AtomNodeOptions } from '../../../nitroglycerin/js/nodes/AtomNode.js';
import balancingChemicalEquations from '../balancingChemicalEquations.js';

const ATOM_NODE_OPTIONS: AtomNodeOptions = {
  stroke: 'black',
  lineWidth: 0.5
};

const BCEConstants = {
  LAYOUT_BOUNDS: new Bounds2( 0, 0, 768, 504 ),
  UNBALANCED_COLOR: 'rgb(46,107,178)',
  BALANCED_HIGHLIGHT_COLOR: 'yellow',
  INTRODUCTION_CANVAS_BACKGROUND: '#d9ebff',
  GAME_CANVAS_BACKGROUND: '#ffffe4',
  BOX_COLOR: 'white',
  ATOM_NODE_OPTIONS: ATOM_NODE_OPTIONS,
  MOLECULE_SCALE_FACTOR: 0.74 // scale all molecules by scaleFactor to fit design
};

balancingChemicalEquations.register( 'BCEConstants', BCEConstants );
export default BCEConstants;