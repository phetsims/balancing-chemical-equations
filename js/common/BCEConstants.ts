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
import BCEColors from './BCEColors.js';

const ATOM_NODE_OPTIONS: AtomNodeOptions = {
  stroke: BCEColors.atomStrokeProperty,
  lineWidth: 0.5
};

const BCEConstants = {

  // A PhET wide decision was made to not update custom layout bounds even if they do not match the
  // default layout bounds in ScreenView. Do not change these bounds as changes could break or disturb
  // any phet-io instrumention. https://github.com/phetsims/phet-io/issues/1939
  LAYOUT_BOUNDS: new Bounds2( 0, 0, 768, 504 ),
  ATOM_NODE_OPTIONS: ATOM_NODE_OPTIONS,
  MOLECULE_SCALE_FACTOR: 0.74 // scale all molecules by scaleFactor to fit design
};

balancingChemicalEquations.register( 'BCEConstants', BCEConstants );
export default BCEConstants;