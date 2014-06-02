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

    this.getBalancedRepresentation = function() {
      return this.balancedRepresentation;
    };

    return this;
  };

  BalancedRepresentationStrategy.prototype.Random = function() {
    this.getBalancedRepresentation = function() {
      return ( Math.random() < 0.5 ) ? BalancedRepresentation.BALANCE_SCALES : BalancedRepresentation.BAR_CHARTS;
    };

    this.balancedRepresentation = this.getBalancedRepresentation();

    return this;
  };

  return BalancedRepresentationStrategy;

} );