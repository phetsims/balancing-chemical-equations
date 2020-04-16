// Copyright 2014-2020, University of Colorado Boulder

/**
 * Model container for the 'Introduction' screen.
 * This model has a small set of equations, one of which is the current equation that we're operating on.*
 *
 * @author Vasily Shakhov (MLearner)
 */

import Property from '../../../../axon/js/Property.js';
import Range from '../../../../dot/js/Range.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import balancingChemicalEquationsStrings from '../../balancingChemicalEquationsStrings.js';
import DecompositionEquation from '../../common/model/DecompositionEquation.js';
import DisplacementEquation from '../../common/model/DisplacementEquation.js';
import SynthesisEquation from '../../common/model/SynthesisEquation.js';

class IntroductionModel {

  constructor() {

    this.COEFFICENTS_RANGE = new Range( 0, 3 ); // @public (read-only) Range of possible equation coefficients

    /*
     * @public
     * Choices available in the 'Introduction' screen.
     * The contract for a choice is: { equation: {Equation}, label: {string} }
     */
    this.choices = [
      { equation: SynthesisEquation.create_N2_3H2_2NH3(), label: balancingChemicalEquationsStrings.makeAmmonia },
      { equation: DecompositionEquation.create_2H2O_2H2_O2(), label: balancingChemicalEquationsStrings.separateWater },
      { equation: DisplacementEquation.create_CH4_2O2_CO2_2H2O(), label: balancingChemicalEquationsStrings.combustMethane }
    ];

    // @public the equation that is selected
    this.equationProperty = new Property( this.choices[ 0 ].equation );
  }

  // @public
  reset() {
    this.equationProperty.reset();
    this.choices.forEach( choice => choice.equation.reset() );
  }
}

balancingChemicalEquations.register( 'IntroductionModel', IntroductionModel );
export default IntroductionModel;