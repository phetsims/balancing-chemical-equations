// Copyright 2014-2020, University of Colorado Boulder

/**
 * The 'Introduction' Screen
 *
 * @author Vasily Shakhov (mlearner.com)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../axon/js/Property.js';
import Screen from '../../../joist/js/Screen.js';
import Shape from '../../../kite/js/Shape.js';
import Element from '../../../nitroglycerin/js/Element.js';
import AtomNode from '../../../nitroglycerin/js/nodes/AtomNode.js';
import ArrowNode from '../../../scenery-phet/js/ArrowNode.js';
import PhetFont from '../../../scenery-phet/js/PhetFont.js';
import Node from '../../../scenery/js/nodes/Node.js';
import Path from '../../../scenery/js/nodes/Path.js';
import Rectangle from '../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../scenery/js/nodes/Text.js';
import LinearGradient from '../../../scenery/js/util/LinearGradient.js';
import balancingChemicalEquationsStrings from '../balancing-chemical-equations-strings.js';
import balancingChemicalEquations from '../balancingChemicalEquations.js';
import BCEConstants from '../common/BCEConstants.js';
import IntroductionModel from './model/IntroductionModel.js';
import IntroductionScreenView from './view/IntroductionScreenView.js';

const screenIntroductionString = balancingChemicalEquationsStrings.screen.introduction;

class IntroductionScreen extends Screen {

  constructor() {

    const options = {
      name: screenIntroductionString,
      backgroundColorProperty: new Property( BCEConstants.INTRODUCTION_CANVAS_BACKGROUND ),
      homeScreenIcon: createScreenIcon()
    };

    super(
      () => new IntroductionModel(),
      model => new IntroductionScreenView( model ),
      options
    );
  }
}

// creates the icon for this screen: an equation above a balance beam
function createScreenIcon() {

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

  return new Node( { children: [ background, contentNode ] } );
}

balancingChemicalEquations.register( 'IntroductionScreen', IntroductionScreen );
export default IntroductionScreen;