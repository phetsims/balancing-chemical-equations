// Copyright 2025, University of Colorado Boulder

/**
 * EquationsScreen is the 'Intro' screen
 *
 * @author Vasily Shakhov (mlearner.com)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Screen, { ScreenOptions } from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import Tandem from '../../../tandem/js/Tandem.js';
import balancingChemicalEquations from '../balancingChemicalEquations.js';
import BalancingChemicalEquationsStrings from '../BalancingChemicalEquationsStrings.js';
import BCEColors from '../common/BCEColors.js';
import EquationsScreenView from './view/EquationsScreenView.js';
import EquationsModel from './model/EquationsModel.js';
import PhetFont from '../../../scenery-phet/js/PhetFont.js';
import HBox from '../../../scenery/js/layout/nodes/HBox.js';
import Text from '../../../scenery/js/nodes/Text.js';
import ArrowNode from '../../../scenery-phet/js/ArrowNode.js';

export default class EquationsScreen extends Screen<EquationsModel, EquationsScreenView> {

  public constructor( tandem: Tandem ) {

    const options: ScreenOptions = {
      name: BalancingChemicalEquationsStrings.screen.equationsStringProperty,
      backgroundColorProperty: BCEColors.introScreenBackgroundColorProperty,
      homeScreenIcon: createScreenIcon(),
      tandem: tandem
    };

    super(
      () => new EquationsModel( tandem.createTandem( 'model' ) ),
      model => new EquationsScreenView( model, tandem.createTandem( 'view' ) ),
      options
    );
  }
}

/**
 * Creates the icon for this screen.
 */
function createScreenIcon(): ScreenIcon {

  // A + B -> AB
  const textOptions = {
    font: new PhetFont( { size: 24, weight: 'bold' } )
  };
  const equationNode = new HBox( {
    children: [
      new Text( 'A + B', textOptions ),
      //TODO https://github.com/phetsims/balancing-chemical-equations/issues/170 Replace ArrowNode with '\u2B95' ?
      new ArrowNode( 0, 0, 25, 0, {
        stroke: null,
        headWidth: 15
      } ),
      new Text( 'AB', textOptions )
    ],
    spacing: 5
  } );

  return new ScreenIcon( equationNode, {
    maxIconWidthProportion: 0.85,
    maxIconHeightProportion: 0.85,
    fill: 'white'
  } );
}

balancingChemicalEquations.register( 'EquationsScreen', EquationsScreen );