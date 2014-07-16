// Copyright 2002-2014, University of Colorado Boulder

/**
 * A box that shows the number of molecules indicated by the equation's user coefficients.
 *
 * @author Vasily Shakhov (mlearner.com)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var ExpandCollapseButton = require( 'SUN/ExpandCollapseButton' );
  var Shape = require( 'KITE/Shape' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Vector2 = require( 'DOT/Vector2' );
  var BCEConstants = require( 'BALANCING_CHEMICAL_EQUATIONS/common/BCEConstants' );

  /**
   * @param {DOT.Range} coefficientRange range of the coefficients
   * @param {Property} expandedProperty controls whether the box is expanded or collapsed
   * @param {*} options
   * @constructor
   */
  function BoxNode( coefficientRange, expandedProperty, options ) {

    options = _.extend( {
      buttonLength: 15,
      xMargin: 5,
      yMargin: 5,
      fill: 'white',
      stroke: 'black',
      lineWidth: 1,
      title: '',
      boxWidth: 100,
      boxHeight: 100
    }, options );

    this.boxHeight = options.boxHeight; // @private
    this.coefficientRange = coefficientRange; // @private
    this.termNodes = {}; // @private molecule nodes for each term, key: term.molecule.symbol, value: [{Node}]

    // expanded box shows molecules
    var expandedBoxNode = new Rectangle( 0, 0, options.boxWidth, options.boxHeight,
      { fill: options.fill, lineWidth: options.lineWidth, stroke: options.stroke } );
    this.moleculesParent = new Node(); // @private parent for all molecule nodes
    expandedBoxNode.addChild( this.moleculesParent );

    // collapsed box shows the title
    var collapsedBoxNode = new Rectangle( 0, 0, options.boxWidth, options.buttonLength + 2 * options.yMargin,
      { fill: options.fill, lineWidth: options.lineWidth, stroke: options.stroke } );
    collapsedBoxNode.addChild( new Text( options.title,
      { font: new PhetFont( { size: 18, weight: 'bold' } ), center: collapsedBoxNode.center } ) );

    // expand/collapse button
    var expandCollapseButton = new ExpandCollapseButton( options.buttonLength, expandedProperty, {
      right: expandedBoxNode.right - options.xMargin,
      top: expandedBoxNode.top + options.yMargin
    } );
    expandCollapseButton.touchArea = Shape.bounds( expandCollapseButton.localBounds.dilatedXY( 10, 10 ) );

    // expand/collapse the box
    expandedProperty.link( function( expanded ) {
      expandedBoxNode.visible = expanded;
      collapsedBoxNode.visible = !expanded;
    } );

    options.children = [ collapsedBoxNode, expandedBoxNode, expandCollapseButton ];
    Node.call( this, options );
  }

  return inherit( Node, BoxNode, {

    /**
     * Creates molecules in the boxes for one set of terms (reactants or products).
     * The maximum number of molecules are created, and then we make the correct
     * number of molecules visible in updateMolecules.
     *
     * @param {EquationTerm} terms array
     * @param {[Number]} xOffsets array of offsets for terms
     */
    createMolecules: function( terms, xOffsets ) {

      this.moleculesParent.removeAllChildren();

      this.termNodes = {};

      var yMargin = 0;
      var rowHeight = ( this.boxHeight - ( 2 * yMargin ) ) / this.coefficientRange.max;

      // for each term ...
      for ( var i = 0; i < terms.length; i++ ) {

        var moleculeNodes = []; // the nodes for this term
        var MoleculeNodeConstructor = terms[i].molecule.nodeConstructor;
        var y = this.boxHeight - yMargin - ( rowHeight / 2 );

        // create the max number of molecules for each term
        for ( var j = 0; j < this.coefficientRange.max; j++ ) {
          var moleculeNode = new MoleculeNodeConstructor( BCEConstants.ATOM_OPTIONS );
          moleculeNode.scale( BCEConstants.MOLECULE_SCALE_FACTOR );
          this.moleculesParent.addChild( moleculeNode );
          moleculeNode.center = new Vector2( xOffsets[i] - this.x, y );
          y -= rowHeight;
          moleculeNodes.push( moleculeNode );
        }

        this.termNodes[ terms[i].molecule.symbol ] = moleculeNodes;
      }
    },

    /**
     * Updates visibility of molecules to match the current coefficients.
     * @param {[EquationTerm]} terms
     */
    updateVisibility: function( terms ) {
      for ( var i = 0; i < terms.length; i++ ) {
        var moleculeNodes = this.termNodes[ terms[i].molecule.symbol ];
        for ( var j = 0; j < this.coefficientRange.max; j++ ) {
          moleculeNodes[j].visible = ( j < terms[i].userCoefficient );
        }
      }
    }
  } );
} );