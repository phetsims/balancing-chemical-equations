// Copyright 2014-2023, University of Colorado Boulder

// @ts-nocheck
/**
 * Equality operator between 2 sides of equation: equals (balanced) or not equals (not balanced).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Node, Text } from '../../../../scenery/js/imports.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import BCEConstants from '../BCEConstants.js';

export default class EqualityOperatorNode extends Node {

  /**
   * @param {Property.<Equation>} equationProperty
   * @param {Object} [options]
   */
  constructor( equationProperty, options ) {

    options = merge( {}, options );

    const textOptions = {
      font: new PhetFont( 80 ),
      stroke: 'black'
    };

    // nodes
    const equalsSignNode = new Text( '\u003D',
      merge( { fill: BCEConstants.BALANCED_HIGHLIGHT_COLOR }, textOptions ) );
    const notEqualsSignNode = new Text( '\u2260',
      merge( { fill: BCEConstants.UNBALANCED_COLOR, center: equalsSignNode.center }, textOptions ) );

    options.children = [ equalsSignNode, notEqualsSignNode ];
    super( options );

    // show the correct operator, based on whether the equation is balanced
    const balancedObserver = balanced => {
      equalsSignNode.visible = balanced;
      notEqualsSignNode.visible = !balanced;
    };
    equationProperty.link( ( newEquation, oldEquation ) => {
      if ( oldEquation ) { oldEquation.balancedProperty.unlink( balancedObserver ); }
      newEquation.balancedProperty.link( balancedObserver );
    } );
  }

  // No dispose needed, instances of this type persist for lifetime of the sim.
}

balancingChemicalEquations.register( 'EqualityOperatorNode', EqualityOperatorNode );