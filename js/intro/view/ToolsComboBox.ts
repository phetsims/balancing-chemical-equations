// Copyright 2014-2025, University of Colorado Boulder

/**
 * ToolsComboBox is the combo box for selecting the visual representation for "balanced".
 *
 * @author Vasily Shakhov (MLearner)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import StringUnionProperty from '../../../../axon/js/StringUnionProperty.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import ComboBox, { ComboBoxItem } from '../../../../sun/js/ComboBox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import BalancingChemicalEquationsStrings from '../../BalancingChemicalEquationsStrings.js';
import { BalancedRepresentation } from '../../common/model/BalancedRepresentation.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Color from '../../../../scenery/js/util/Color.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import HStrut from '../../../../scenery/js/nodes/HStrut.js';
import BalanceFulcrumNode from '../../common/view/BalanceFulcrumNode.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import ShadedSphereNode, { ShadedSphereNodeOptions } from '../../../../scenery-phet/js/ShadedSphereNode.js';

const FONT = new PhetFont( 20 );

export default class ToolsComboBox extends ComboBox<BalancedRepresentation> {

  public constructor( balanceRepresentationProperty: StringUnionProperty<BalancedRepresentation>,
                      listboxParent: Node,
                      tandem: Tandem ) {

    const items: ComboBoxItem<BalancedRepresentation>[] = [
      {
        value: 'none',
        tandemName: 'noneItem',
        createNode: () => new Text( BalancingChemicalEquationsStrings.noneStringProperty, { font: FONT, maxWidth: 100 } )
      },
      {
        value: 'balanceScales',
        tandemName: 'balanceScalesItem',
        createNode: () => createBalanceScales()
      },
      {
        value: 'barCharts',
        tandemName: 'barChartItem',
        createNode: () => createBarChartsIcon()
      }
    ];

    super( balanceRepresentationProperty, items, listboxParent, {
      isDisposable: false,
      align: 'center',
      xMargin: 10,
      yMargin: 5,
      cornerRadius: 4,
      maxWidth: 600,
      tandem: tandem
    } );
  }
}

function createBalanceScales(): Node {

  // Atoms
  const diameter = 12;
  const shadedSphereNodeOptions: ShadedSphereNodeOptions = {
    radius: 8,
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

balancingChemicalEquations.register( 'ToolsComboBox', ToolsComboBox );