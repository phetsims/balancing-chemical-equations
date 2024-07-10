// Copyright 2014-2024, University of Colorado Boulder

/**
 * 'Tools' combo box, for selecting the visual representation for "balanced".
 *
 * @author Vasily Shakhov (MLearner)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Image, Node, Text } from '../../../../scenery/js/imports.js';
import ComboBox from '../../../../sun/js/ComboBox.js';
import charts_png from '../../../images/charts_png.js';
import scales_png from '../../../mipmaps/scales_png.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import BalancingChemicalEquationsStrings from '../../BalancingChemicalEquationsStrings.js';
import BalancedRepresentation from '../../common/model/BalancedRepresentation.js';

// constants
const FONT = new PhetFont( 22 );

export default class ToolsComboBox extends ComboBox<BalancedRepresentation> {

  public constructor( balanceRepresentationProperty: EnumerationProperty<BalancedRepresentation>, listboxParent: Node ) {

    const items = [
      { value: BalancedRepresentation.NONE, createNode: () => new Text( BalancingChemicalEquationsStrings.noneStringProperty, { font: FONT, maxWidth: 100 } ) },
      { value: BalancedRepresentation.BALANCE_SCALES, createNode: () => new Image( scales_png, { scale: 0.1875 } ) },
      { value: BalancedRepresentation.BAR_CHARTS, createNode: () => new Image( charts_png, { scale: 0.375 } ) }
    ];

    super( balanceRepresentationProperty, items, listboxParent, {
      isDisposable: false,
      xMargin: 10,
      yMargin: 5,
      cornerRadius: 4,
      maxWidth: 600
    } );
  }
}

balancingChemicalEquations.register( 'ToolsComboBox', ToolsComboBox );