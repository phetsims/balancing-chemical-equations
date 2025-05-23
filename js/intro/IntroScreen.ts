// Copyright 2014-2025, University of Colorado Boulder

/**
 * IntroScreen is the 'Intro' screen
 *
 * @author Vasily Shakhov (mlearner.com)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Screen, { ScreenOptions } from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import Element from '../../../nitroglycerin/js/Element.js';
import AtomNode from '../../../nitroglycerin/js/nodes/AtomNode.js';
import Rectangle from '../../../scenery/js/nodes/Rectangle.js';
import Tandem from '../../../tandem/js/Tandem.js';
import balancingChemicalEquations from '../balancingChemicalEquations.js';
import BalancingChemicalEquationsStrings from '../BalancingChemicalEquationsStrings.js';
import BCEColors from '../common/BCEColors.js';
import IntroModel from './model/IntroModel.js';
import IntroScreenView from './view/IntroScreenView.js';
import BalanceFulcrumNode from '../common/view/BalanceFulcrumNode.js';
import Dimension2 from '../../../dot/js/Dimension2.js';
import HBox from '../../../scenery/js/layout/nodes/HBox.js';
import HStrut from '../../../scenery/js/nodes/HStrut.js';
import VBox from '../../../scenery/js/layout/nodes/VBox.js';

export default class IntroScreen extends Screen<IntroModel, IntroScreenView> {

  public constructor( tandem: Tandem ) {

    const options: ScreenOptions = {
      name: BalancingChemicalEquationsStrings.screen.introStringProperty,
      backgroundColorProperty: BCEColors.introScreenBackgroundColorProperty,
      homeScreenIcon: createScreenIcon(),
      tandem: tandem
    };

    super(
      () => new IntroModel( tandem.createTandem( 'model' ) ),
      model => new IntroScreenView( model, tandem.createTandem( 'view' ) ),
      options
    );
  }
}

/**
 * Creates the icon for this screen: an equation above a balance beam
 */
function createScreenIcon(): ScreenIcon {

  // Atoms
  const atomsNode = new HBox( {
    spacing: 0,
    children: [
      new AtomNode( Element.O ),
      new AtomNode( Element.O ),
      new HStrut( 35 ),
      new AtomNode( Element.O ),
      new AtomNode( Element.O )
    ]
  } );

  // balance beam, in horizontal (balanced) orientation
  const beamNode = new Rectangle( 0, 0, 128, 10, {
    fill: BCEColors.BALANCED_HIGHLIGHT_COLOR,
    stroke: 'black',
    lineWidth: 0.75
  } );

  const fulcrumNode = new BalanceFulcrumNode( {
    size: new Dimension2( 0.25 * beamNode.width, 20 ),
    lineWidth: 0.75
  } );

  const contentNode = new VBox( {
    align: 'center',
    spacing: 0,
    children: [
      atomsNode,
      beamNode,
      fulcrumNode
    ]
  } );

  return new ScreenIcon( contentNode, {
    maxIconWidthProportion: 0.85,
    maxIconHeightProportion: 0.85,
    fill: 'white'
  } );
}

balancingChemicalEquations.register( 'IntroScreen', IntroScreen );