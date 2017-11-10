// Copyright 2014-2017, University of Colorado Boulder

/**
 * A box that shows the number of molecules indicated by the equation's user coefficients.
 *
 * @author Vasily Shakhov (mlearner.com)
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var balancingChemicalEquations = require( 'BALANCING_CHEMICAL_EQUATIONS/balancingChemicalEquations' );
  var BCEConstants = require( 'BALANCING_CHEMICAL_EQUATIONS/common/BCEConstants' );
  var ExpandCollapseButton = require( 'SUN/ExpandCollapseButton' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Shape = require( 'KITE/Shape' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * @param {Property.<Equation>} equationProperty
   * @param {function} getTerms 1 parameter {Equation}, gets the terms that this box will display
   * @param {function} getXOffsets 1 parameter {Equation}, gets the x-offsets for each term
   * @param {DOT.Range} coefficientRange range of the coefficients
   * @param {Property} expandedProperty controls whether the box is expanded or collapsed
   * @param {Object} [options]
   * @constructor
   */
  function BoxNode( equationProperty, getTerms, getXOffsets, coefficientRange, expandedProperty, options ) {

    var self = this;

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
    var collapsedBoxNode = new Rectangle( 0, 0, options.boxWidth, options.buttonLength + 2 * options.yMargin, {
      fill: options.fill,
      lineWidth: options.lineWidth,
      stroke: options.stroke
    } );
    collapsedBoxNode.addChild( new Text( options.title, {
      font: new PhetFont( { size: 18, weight: 'bold' } ),
      center: collapsedBoxNode.center,
      maxWidth: 0.75 * options.boxWidth  // constrain width for i18n
    } ) );

    // expand/collapse button
    var expandCollapseButton = new ExpandCollapseButton( expandedProperty, {
      sideLength: options.buttonLength,
      right: expandedBoxNode.right - options.xMargin,
      top:   expandedBoxNode.top + options.yMargin
    } );
    expandCollapseButton.mouseArea = Shape.bounds( expandCollapseButton.localBounds.dilatedXY( 10, 10 ) );
    expandCollapseButton.touchArea = Shape.bounds( expandCollapseButton.localBounds.dilatedXY( 20, 20 ) );

    // expand/collapse the box
    expandedProperty.link( function( expanded ) {
      expandedBoxNode.visible = expanded;
      collapsedBoxNode.visible = !expanded;
    } );

    options.children = [ collapsedBoxNode, expandedBoxNode, expandCollapseButton ];
    Node.call( this, options );

    // update visible molecules to match the coefficients
    var coefficientsObserver = function() {
      self.updateCounts( getTerms( equationProperty.get() ), getXOffsets( equationProperty.get() ) );
    };

    equationProperty.link( function( newEquation, oldEquation ) {

      // updates the node for molecules of the current equation
      self.updateNode( getTerms( newEquation ), getXOffsets( newEquation ) );

      // wire up coefficients observer to current equation
      if ( oldEquation ) { oldEquation.removeCoefficientsObserver( coefficientsObserver ); }
      newEquation.addCoefficientsObserver( coefficientsObserver );
    } );
  }

  balancingChemicalEquations.register( 'BoxNode', BoxNode );

  return inherit( Node, BoxNode, {

    // No dispose needed, instances of this type persist for lifetime of the sim.

    /**
     * Creates molecules in the boxes for one set of terms (reactants or products).
     * To improve performance:
     * - Molecules are created as needed.
     * - Molecules are never removed; they remain as children for the lifetime of this node.
     * - The visibility of molecules is adjusted to show the correct number of molecules.
     *
     * @param {EquationTerm} terms array
     * @param {number[]} xOffsets array of offsets for terms
     * @private
     */
    updateNode: function( terms, xOffsets ) {

      // remove all molecule nodes
      this.moleculesParent.removeAllChildren();

      // clear the map
      this.termNodes = {};
      for ( var i = 0; i < terms.length; i++ ) {
        this.termNodes[ terms[ i ].molecule.symbol ] = [];
      }

      this.updateCounts( terms, xOffsets );
    },

    /**
     * Updates visibility of molecules to match the current coefficients.
     *
     * @param {EquationTerm[]} terms
     * @param {number[]} xOffsets array of offsets for terms
     * @private
     */
    updateCounts: function( terms, xOffsets ) {

      var Y_MARGIN = 0;
      var rowHeight = ( this.boxHeight - ( 2 * Y_MARGIN ) ) / this.coefficientRange.max;

      for ( var i = 0; i < terms.length; i++ ) {

        var moleculeNodes = this.termNodes[ terms[ i ].molecule.symbol ];
        var userCoefficient = terms[ i ].userCoefficientProperty.get();
        var MoleculeNodeConstructor = terms[ i ].molecule.nodeConstructor;
        var y = this.boxHeight - Y_MARGIN - ( rowHeight / 2 );

        for ( var j = 0; j < Math.max( userCoefficient, moleculeNodes.length ); j++ ) {
          if ( j < moleculeNodes.length ) {
            // set visibility of a molecule that already exists
            moleculeNodes[ j ].visible = ( j < userCoefficient );
          }
          else {
            // add a molecule node
            var moleculeNode = new MoleculeNodeConstructor( { atomOptions: BCEConstants.ATOM_OPTIONS } );
            moleculeNode.scale( BCEConstants.MOLECULE_SCALE_FACTOR );
            this.moleculesParent.addChild( moleculeNode );
            moleculeNode.center = new Vector2( xOffsets[ i ] - this.x, y );

            moleculeNodes.push( moleculeNode );
          }
          y -= rowHeight;
        }
      }
    }
  } );
} );