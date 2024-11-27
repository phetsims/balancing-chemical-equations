// Copyright 2014-2023, University of Colorado Boulder

/**
 * The 'Intro' screen
 *
 * @author Vasily Shakhov (mlearner.com)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Screen, { ScreenOptions } from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import { Shape } from '../../../kite/js/imports.js';
import Element from '../../../nitroglycerin/js/Element.js';
import AtomNode from '../../../nitroglycerin/js/nodes/AtomNode.js';
import ArrowNode from '../../../scenery-phet/js/ArrowNode.js';
import PhetFont from '../../../scenery-phet/js/PhetFont.js';
import { LinearGradient, Node, Path, Rectangle, Text } from '../../../scenery/js/imports.js';
import Tandem from '../../../tandem/js/Tandem.js';
import balancingChemicalEquations from '../balancingChemicalEquations.js';
import BalancingChemicalEquationsStrings from '../BalancingChemicalEquationsStrings.js';
import BCEColors from '../common/BCEColors.js';
import IntroModel from './model/IntroModel.js';
import IntroScreenView from './view/IntroScreenView.js';

export default class IntroScreen extends Screen<IntroModel, IntroScreenView> {

  public constructor( tandem: Tandem ) {

    const options: ScreenOptions = {

      // In https://github.com/phetsims/balancing-chemical-equations/issues/151, we decided to rename this screen to 'Intro'
      // for consistency with other PhET sims. We also decided to change only the English string value, and not
      // the string key, due to the hassles involved in changing string keys.
      name: BalancingChemicalEquationsStrings.screen.introductionStringProperty,
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

  // background rectangle
  const width = Screen.MINIMUM_HOME_SCREEN_ICON_SIZE.width;
  const height = Screen.MINIMUM_HOME_SCREEN_ICON_SIZE.height;
  const background = new Rectangle( 0, 0, width, height, { fill: 'white' } );

  // equation: X + Y -> XY
  const textOptions = { font: new PhetFont( { size: 24, weight: 'bold' } ) };
  const xPlusYText = new Text( 'X + Y', textOptions );
  const xyText = new Text( 'XY', textOptions );
  const arrowLength = 25;
  const arrowNode = new ArrowNode( 0, 0, arrowLength, 0, { stroke: null, headWidth: 15 } );
  const equationNode = new Node( { children: [ xPlusYText, arrowNode, xyText ] } );
  const equationXSpacing = 5;
  arrowNode.left = xPlusYText.right + equationXSpacing;
  arrowNode.centerY = xPlusYText.centerY;
  xyText.left = arrowNode.right + equationXSpacing;

  // balance beam, in horizontal (balanced) orientation
  const beamNode = new Rectangle( 0, 0, equationNode.width, 10, { fill: 'yellow', stroke: 'black', lineWidth: 0.25 } );
  beamNode.left = equationNode.left;
  beamNode.top = equationNode.bottom + 25;

  // fulcrum, centered below balance beam
  const fulcrumWidth = 0.25 * beamNode.width;
  const fulcrumHeight = 20;
  const fulcrumFill = new LinearGradient( 0, 0, 0, fulcrumHeight ).addColorStop( 0, 'white' ).addColorStop( 1, 'rgb(192, 192, 192)' );
  const fulcrumNode = new Path( new Shape().moveTo( 0, 0 ).lineTo( fulcrumWidth / 2, fulcrumHeight ).lineTo( -fulcrumWidth / 2, fulcrumHeight ).close(),
    { fill: fulcrumFill, stroke: 'black', lineWidth: 0.25 } );
  fulcrumNode.centerX = beamNode.centerX;
  fulcrumNode.top = beamNode.bottom;

  // atoms, left to right (this is brute force, but is unlikely to change)
  const atomsXMargin = 10;
  const atom1 = new AtomNode( Element.O );
  const atom2 = new AtomNode( Element.O );
  const atom3 = new AtomNode( Element.O );
  const atom4 = new AtomNode( Element.O );
  // all atoms are on top of the beam
  atom1.bottom = beamNode.top;
  atom2.bottom = beamNode.top;
  atom3.bottom = beamNode.top;
  atom4.bottom = beamNode.top;
  // atoms on the left of the beam
  atom1.left = beamNode.left + atomsXMargin;
  atom2.left = atom1.right;
  // atom on the right of the beam
  atom4.right = beamNode.right - atomsXMargin;
  atom3.right = atom4.left;

  // scale to fit, center in background
  const contentNode = new Node( { children: [ equationNode, beamNode, fulcrumNode, atom1, atom2, atom3, atom4 ] } );
  contentNode.setScaleMagnitude( Math.min( 0.82 * background.width / contentNode.width, 0.82 * background.height / contentNode.height ) );
  contentNode.center = background.center;

  const iconNode = new Node( { children: [ background, contentNode ] } );

  return new ScreenIcon( iconNode, {
    maxIconWidthProportion: 1,
    maxIconHeightProportion: 1
  } );
}

balancingChemicalEquations.register( 'IntroScreen', IntroScreen );