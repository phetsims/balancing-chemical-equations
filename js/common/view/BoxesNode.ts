// Copyright 2014-2024, University of Colorado Boulder

/**
 * BoxesNode is a pair of accordion boxes that show the number of molecules indicated by the equation's
 * user coefficients. The left box is for the reactants, the right box is for the products.
 *
 * @author Vasily Shakhov (mlearner.com)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import optionize from '../../../../phet-core/js/optionize.js';
import Node, { NodeOptions, NodeTranslationOptions } from '../../../../scenery/js/nodes/Node.js';
import TColor from '../../../../scenery/js/util/TColor.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import balancingChemicalEquations from '../../balancingChemicalEquations.js';
import BalancingChemicalEquationsStrings from '../../BalancingChemicalEquationsStrings.js';
import Equation from '../model/Equation.js';
import BoxNode from './BoxNode.js';
import HorizontalAligner from './HorizontalAligner.js';
import RightArrowNode from './RightArrowNode.js';

type SelfOptions = {
  parentTandem: Tandem;
};

type BoxesNodeOptions = SelfOptions & NodeTranslationOptions;

export default class BoxesNode extends Node {

  private readonly arrowNode: RightArrowNode;

  /**
   * @param equationProperty - the equation displayed in the boxes
   * @param coefficientsRange
   * @param aligner - provides layout information to ensure horizontal alignment with other user-interface elements
   * @param boxSize
   * @param boxColor - fill color of the boxes
   * @param reactantsBoxExpandedProperty
   * @param productsBoxExpandedProperty
   * @param [providedOptions]
   */
  public constructor( equationProperty: TReadOnlyProperty<Equation>,
                      coefficientsRange: Range,
                      aligner: HorizontalAligner,
                      boxSize: Dimension2,
                      boxColor: TColor,
                      reactantsBoxExpandedProperty: Property<boolean>,
                      productsBoxExpandedProperty: Property<boolean>,
                      providedOptions?: BoxesNodeOptions ) {

    const options = optionize<BoxesNodeOptions, SelfOptions, NodeOptions>()( {

      // NodeOptions
      isDisposable: false
    }, providedOptions );

    // reactants on the left
    const reactantsAccordionBox = new BoxNode( equationProperty,
      equation => equation.reactants,
      equation => aligner.getReactantXOffsets( equation ),
      coefficientsRange,
      BalancingChemicalEquationsStrings.reactantsStringProperty, {
        expandedProperty: reactantsBoxExpandedProperty,
        fill: boxColor,
        boxWidth: boxSize.width,
        boxHeight: boxSize.height,
        x: aligner.getReactantsBoxLeft(),
        y: 0,
        tandem: options.parentTandem.createTandem( 'reactantsAccordionBox' )
      } );

    // products on the right
    const productsAccordionBox = new BoxNode( equationProperty,
      equation => equation.products,
      equation => aligner.getProductXOffsets( equation ),
      coefficientsRange,
      BalancingChemicalEquationsStrings.productsStringProperty, {
        expandedProperty: productsBoxExpandedProperty,
        fill: boxColor,
        boxWidth: boxSize.width,
        boxHeight: boxSize.height,
        x: aligner.getProductsBoxLeft(),
        y: 0,
        tandem: options.parentTandem.createTandem( 'productsAccordionBox' )
      } );

    // right-pointing arrow, in the middle
    const arrowNode = new RightArrowNode( equationProperty, {
      center: new Vector2( aligner.getScreenCenterX(), boxSize.height / 2 )
    } );

    options.children = [ reactantsAccordionBox, productsAccordionBox, arrowNode ];
    super( options );

    this.arrowNode = arrowNode;
  }

  /**
   * Enables or disables the highlighting feature.
   * When enabled, the arrow between the boxes will light up when the equation is balanced.
   * This is enabled by default, but we want to disable in the Game until the user presses the "Check" button.
   */
  public setBalancedHighlightEnabled( enabled: boolean ): void {
    this.arrowNode.setHighlightEnabled( enabled );
  }
}

balancingChemicalEquations.register( 'BoxesNode', BoxesNode );