// Copyright 2014-2025, University of Colorado Boulder

/**
 * ToolsComboBox is the combo box for selecting the visual representation for "balanced".
 *
 * @author Vasily Shakhov (MLearner)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import StringUnionProperty from '../../../../axon/js/StringUnionProperty.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import ComboBox, { ComboBoxItem } from '../../../../sun/js/ComboBox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import charts_png from '../../../images/charts_png.js';
import scales_png from '../../../mipmaps/scales_png.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import BalancingChemicalEquationsStrings from '../../BalancingChemicalEquationsStrings.js';
import { BalancedRepresentation } from '../../common/model/BalancedRepresentation.js';

const FONT = new PhetFont( 22 );

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
      xMargin: 10,
      yMargin: 5,
      cornerRadius: 4,
      maxWidth: 600,
      tandem: tandem
    } );
  }
}

function createBalanceScales(): Node {
  return new Image( scales_png, { scale: 0.1875 } );
}

function createBarChartsIcon(): Node {
  return new Image( charts_png, { scale: 0.375 } );
}

balancingChemicalEquations.register( 'ToolsComboBox', ToolsComboBox );