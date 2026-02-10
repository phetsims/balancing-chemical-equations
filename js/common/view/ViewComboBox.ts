// Copyright 2014-2025, University of Colorado Boulder

/**
 * ViewsComboBox is the combo box for selecting the visual representation for "balanced".
 *
 * @author Vasily Shakhov (MLearner)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import StringUnionProperty from '../../../../axon/js/StringUnionProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import affirm from '../../../../perennial-alias/js/browser-and-node/affirm.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import ShadedSphereNode, { ShadedSphereNodeOptions } from '../../../../scenery-phet/js/ShadedSphereNode.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import HStrut from '../../../../scenery/js/nodes/HStrut.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Color from '../../../../scenery/js/util/Color.js';
import ComboBox, { ComboBoxItem } from '../../../../sun/js/ComboBox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import BalancingChemicalEquationsStrings from '../../BalancingChemicalEquationsStrings.js';
import { ViewMode } from '../model/ViewMode.js';
import BalanceFulcrumNode from './BalanceFulcrumNode.js';

const FONT = new PhetFont( 18 );

export default class ViewComboBox extends ComboBox<ViewMode> {

  public constructor( viewModeProperty: StringUnionProperty<ViewMode>,
                      listboxParent: Node,
                      tandem: Tandem ) {

    const viewModeValues = viewModeProperty.validValues!;
    affirm( viewModeValues );

    const items: ComboBoxItem<ViewMode>[] = viewModeValues.map( viewMode => {
      return {
        value: viewMode,
        tandemName: `${viewMode}Item`,
        accessibleName: viewMode === 'particles' ? BalancingChemicalEquationsStrings.a11y.particlesStringProperty :
                        viewMode === 'balanceScales' ? BalancingChemicalEquationsStrings.a11y.balanceScalesStringProperty :
                        viewMode === 'barCharts' ? BalancingChemicalEquationsStrings.a11y.barChartsStringProperty :
                        BalancingChemicalEquationsStrings.noneStringProperty,
        createNode: () => createIcon( viewMode )
      };
    } );

    super( viewModeProperty, items, listboxParent, {
      isDisposable: false,
      align: 'center',
      xMargin: 10,
      yMargin: 10,
      cornerRadius: 4,
      maxWidth: 600,
      accessibleName: BalancingChemicalEquationsStrings.viewStringProperty,
      tandem: tandem
    } );
  }
}

function createIcon( viewMode: ViewMode ): Node {
  if ( viewMode === 'particles' ) {
    return createParticlesIcon();
  }
  else if ( viewMode === 'balanceScales' ) {
    return createBalanceScalesIcon();
  }
  else if ( viewMode === 'barCharts' ) {
    return createBarChartsIcon();
  }
  else {
    return new Text( BalancingChemicalEquationsStrings.noneStringProperty, {
      font: FONT,
      maxWidth: 100
    } );
  }
}

/**
 * This icon looks like a grayscale version of H2O.
 */
function createParticlesIcon(): Node {

  const bigAtomDiameter = 18;
  const smallAtomDiameter = 12;

  const stroke = 'black';
  const lineWidth = 0.5;

  const bigAtom = new ShadedSphereNode( bigAtomDiameter, {
    mainColor: Color.grayColor( 100 ),
    highlightColor: Color.grayColor( 220 ),
    stroke: stroke,
    lineWidth: lineWidth
  } );

  const smallAtomOptions = {
    mainColor: Color.grayColor( 180 ),
    highlightColor: Color.grayColor( 240 ),
    stroke: stroke,
    lineWidth: lineWidth
  };

  const smallAtomLeft = new ShadedSphereNode( smallAtomDiameter, smallAtomOptions );
  smallAtomLeft.centerX = bigAtom.left;
  smallAtomLeft.centerY = bigAtom.bottom - ( 0.25 * bigAtom.height );

  const smallAtomRight = new ShadedSphereNode( smallAtomDiameter, smallAtomOptions );
  smallAtomRight.centerX = bigAtom.right;
  smallAtomRight.centerY = smallAtomLeft.centerY;

  return new Node( {
    children: [ bigAtom, smallAtomLeft, smallAtomRight ]
  } );
}

function createBalanceScalesIcon(): Node {

  // Atoms
  const diameter = 18;
  const shadedSphereNodeOptions: ShadedSphereNodeOptions = {
    mainColor: Color.grayColor( 180 ),
    highlightColor: Color.grayColor( 240 ),
    stroke: 'black',
    lineWidth: 0.5
  };
  const atomsNode = new HBox( {
    spacing: 0,
    children: [
      new ShadedSphereNode( diameter, shadedSphereNodeOptions ),
      new ShadedSphereNode( diameter, shadedSphereNodeOptions ),
      new HStrut( 40 ),
      new ShadedSphereNode( diameter, shadedSphereNodeOptions ),
      new ShadedSphereNode( diameter, shadedSphereNodeOptions )
    ]
  } );

  // balance beam, in horizontal (balanced) orientation
  const beamNode = new Rectangle( 0, 0, 135, 6, {
    fill: 'black'
  } );

  const fulcrumNode = new BalanceFulcrumNode( {
    // size: new Dimension2( 60, 45 ),
    size: new Dimension2( 40, 30 ),
    lineWidth: 1
  } );

  return new VBox( {
    children: [ atomsNode, beamNode, fulcrumNode ],
    spacing: 0,
    align: 'center',
    scale: 0.35
  } );
}

function createBarChartsIcon(): Node {
  const barWidth = 12;
  const stroke = 'black';
  const lineWidth = 0.5;
  const rectangle1 = new Rectangle( 0, 0, barWidth, 10, {
    fill: Color.grayColor( 109 ),
    stroke: stroke,
    lineWidth: lineWidth
  } );
  const rectangle2 = new Rectangle( 0, 0, barWidth, 15, {
    fill: Color.grayColor( 217 ),
    stroke: stroke,
    lineWidth: lineWidth
  } );
  const rectangle3 = new Rectangle( 0, 0, barWidth, 20, {
    fill: Color.grayColor( 163 ),
    stroke: stroke,
    lineWidth: lineWidth
  } );
  return new HBox( {
    children: [ rectangle1, rectangle2, rectangle3 ],
    spacing: 3,
    align: 'bottom'
  } );
}

balancingChemicalEquations.register( 'ViewComboBox', ViewComboBox );