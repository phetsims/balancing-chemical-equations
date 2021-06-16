// Copyright 2014-2021, University of Colorado Boulder

/**
 * 'Tools' combo box, for selecting the visual representation for "balanced".
 *
 * @author Vasily Shakhov (MLearner)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import ComboBox from '../../../../sun/js/ComboBox.js';
import ComboBoxItem from '../../../../sun/js/ComboBoxItem.js';
import chartsImage from '../../../images/charts_png.js';
import scalesImage from '../../../mipmaps/scales_png.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import balancingChemicalEquationsStrings from '../../balancingChemicalEquationsStrings.js';
import BalancedRepresentation from '../../common/model/BalancedRepresentation.js';

// constants
const FONT = new PhetFont( 22 );

class ToolsComboBox extends ComboBox {

  /**
   * @param {EnumerationProperty.<BalancedRepresentation>} balanceRepresentationProperty
   * @param {Node} parentNode node that will be used as the list's parent, use this to ensuring that the list is in front of everything else
   * @param {Object} [options]
   * @constructor
   */
  constructor( balanceRepresentationProperty, parentNode, options ) {

    options = merge( {
      xMargin: 10,
      yMargin: 5,
      cornerRadius: 4,
      maxWidth: 600
    }, options );

    // options that cannot be specified by client
    options.labelNode = new Text( balancingChemicalEquationsStrings.tools, {
      font: FONT,
      fontWeight: 'bold',
      maxWidth: 100
    } );

    const items = [
      // 'None'
      new ComboBoxItem( new Text( balancingChemicalEquationsStrings.none, { font: FONT, maxWidth: 100 } ), BalancedRepresentation.NONE ),
      // scales
      new ComboBoxItem( new Image( scalesImage, { scale: 0.1875 } ), BalancedRepresentation.BALANCE_SCALES ),
      // bar charts
      new ComboBoxItem( new Image( chartsImage, { scale: 0.375 } ), BalancedRepresentation.BAR_CHARTS )
    ];

    super( items, balanceRepresentationProperty, parentNode, options );
  }
}

balancingChemicalEquations.register( 'ToolsComboBox', ToolsComboBox );
export default ToolsComboBox;