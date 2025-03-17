// Copyright 2025, University of Colorado Boulder

/**
 * BCEFiniteStatusBar is the status bar for the Game screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ScoreDisplayLabeledNumber from '../../../../vegas/js/ScoreDisplayLabeledNumber.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import FiniteStatusBar from '../../../../vegas/js/FiniteStatusBar.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import GameModel from '../model/GameModel.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';

const STATUS_BAR_FONT = new PhetFont( 14 );
const STATUS_BAR_TEXT_FILL = 'white';

export class BCEFiniteStatusBar extends FiniteStatusBar {

  public constructor( model: GameModel,
                      layoutBounds: Bounds2,
                      visibleBoundsProperty: TReadOnlyProperty<Bounds2>,
                      tandem: Tandem ) {

    super( layoutBounds, visibleBoundsProperty, model.scoreProperty, {
      createScoreDisplay: scoreProperty => new ScoreDisplayLabeledNumber( scoreProperty, {
        font: STATUS_BAR_FONT,
        textFill: STATUS_BAR_TEXT_FILL
      } ),
      levelProperty: new DerivedProperty( [ model.levelProperty ], level => level ? level.levelNumber : 0 ),
      challengeIndexProperty: model.currentEquationIndexProperty,
      numberOfChallengesProperty: model.numberOfEquationsProperty,
      elapsedTimeProperty: model.timer.elapsedTimeProperty,
      timerEnabledProperty: model.timerEnabledProperty,
      font: STATUS_BAR_FONT,
      textFill: STATUS_BAR_TEXT_FILL,
      barFill: 'rgb( 49, 117, 202 )',
      xMargin: 30,
      yMargin: 5,
      startOverButtonOptions: {
        baseColor: 'rgb( 229, 243, 255 )',
        textFill: 'black',
        listener: () => {
          this.interruptSubtreeInput();
          model.startOver();
        },
        xMargin: 10,
        yMargin: 5
      },
      levelTextOptions: {
        tandem: tandem.createTandem( 'levelText' ),
        phetioVisiblePropertyInstrumented: true
      },
      challengeTextOptions: {
        tandem: tandem.createTandem( 'challengeText' ),
        phetioVisiblePropertyInstrumented: true
      },
      tandem: tandem,
      phetioVisiblePropertyInstrumented: false
    } );
  }
}

balancingChemicalEquations.register( 'BCEFiniteStatusBar', BCEFiniteStatusBar );