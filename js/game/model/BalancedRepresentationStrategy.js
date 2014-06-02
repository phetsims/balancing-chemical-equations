// Copyright 2002-2014, University of Colorado Boulder

/**
 * Author: Vasily Shakhov (mlearner.com)
 */

define( function( require ) {
  'use strict';

  //modules
  var BalancedRepresentation = require( 'BALANCING_CHEMICAL_EQUATIONS/common/model/BalancedRepresentation' );


  var BalancedRepresentationStrategy = function() {};

  BalancedRepresentationStrategy.prototype.Constant = function( balancedRepresentation ) {
    this.balancedRepresentation = balancedRepresentation;
  };

  BalancedRepresentationStrategy.prototype.Random = function() {
    this.balancedRepresentation = ( Math.random() < 0.5 ) ? BalancedRepresentation.BALANCE_SCALES : BalancedRepresentation.BAR_CHARTS;
  };

  return BalancedRepresentationStrategy;

} );