// Copyright 2002-2014, University of Colorado Boulder

/**
 * A happy face that is visible when the current equation is balanced.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var FaceNode = require( 'SCENERY_PHET/FaceNode' );

  function BCEFaceNode( equationProperty, options ) {

    var self = this;

    FaceNode.call( this, 70, options );

    var updateFace = function() {
      self.visible = equationProperty.get().balanced;
    };

    equationProperty.link( function( newEquation, oldEquation ) {
      if ( oldEquation ) { oldEquation.removeCoefficientsObserver( updateFace ); }
      newEquation.addCoefficientsObserver( updateFace );
    } );
  }

  return inherit( FaceNode, BCEFaceNode );
} );
