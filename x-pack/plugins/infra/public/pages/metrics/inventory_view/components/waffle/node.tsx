/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { darken, readableColor } from 'polished';
import React from 'react';

import { i18n } from '@kbn/i18n';

import { first } from 'lodash';
import {
  InfraWaffleMapBounds,
  InfraWaffleMapNode,
  InfraWaffleMapOptions,
} from '../../../../../lib/lib';
import { colorFromValue } from '../../lib/color_from_value';
import { InventoryItemType } from '../../../../../../common/inventory_models/types';

const initialState = {
  isPopoverOpen: false,
  isOverlayOpen: false,
  isAlertFlyoutVisible: false,
};

type State = Readonly<typeof initialState>;

interface Props {
  squareSize: number;
  options: InfraWaffleMapOptions;
  node: InfraWaffleMapNode;
  formatter: (val: number) => string;
  bounds: InfraWaffleMapBounds;
  nodeType: InventoryItemType;
  currentTime: number;
}

export class Node extends React.PureComponent<Props, State> {
  public readonly state: State = initialState;
  public render() {
    const { nodeType, node, options, squareSize, bounds, formatter, currentTime } = this.props;
    // const { isPopoverOpen, isAlertFlyoutVisible } = this.state;
    const metric = first(node.metrics);
    const valueMode = squareSize > 70;
    const ellipsisMode = squareSize > 30;
    const rawValue = (metric && metric.value) || 0;
    const color = colorFromValue(options.legend, rawValue, bounds);
    const value = formatter(rawValue);
    const nodeAriaLabel = i18n.translate('xpack.infra.node.ariaLabel', {
      defaultMessage: '{nodeName}, click to open menu',
      values: { nodeName: node.name },
    });

    const squareOuterColor = { backgroundColor: darken(0.1, color) };
    const squareOuterStyle = this.state.isOverlayOpen
      ? { border: 'solid 4px #000', ...squareOuterColor }
      : squareOuterColor;

    const textColor = readableColor(color);
    return (
      <div
        data-test-subj="nodeContainer"
        style={{ width: squareSize || 0, height: squareSize || 0, position: 'relative' }}
      >
        <div className="square-outer" style={squareOuterStyle}>
          <div className="square-inner" style={{ backgroundColor: color }}>
            {valueMode ? (
              <div className="value-inner" aria-label={nodeAriaLabel}>
                <div className="infra-node-label" style={{ color: textColor }}>
                  {node.name}
                </div>
                <div className="infra-node-value" style={{ color: textColor }}>
                  {value}
                </div>
              </div>
            ) : (
              ellipsisMode && (
                <div className="value-inner" aria-label={nodeAriaLabel}>
                  <div className="infra-node-label" style={{ color: textColor }}>
                    ...
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    );
  }

  // private openAlertFlyout = () => {
  //   this.setState({
  //     isOverlayOpen: false,
  //     isAlertFlyoutVisible: true,
  //   });
  // };

  // private setAlertFlyoutVisible = (isOpen: boolean) => {
  //   this.setState({
  //     isAlertFlyoutVisible: isOpen,
  //   });
  // };

  // private togglePopover = () => {
  //   const { nodeType } = this.props;
  //   if (nodeType === 'host') {
  //     this.toggleNewOverlay();
  //   } else {
  //     this.setState((prevState) => ({ isPopoverOpen: !prevState.isPopoverOpen }));
  //   }
  // };

  // private toggleNewOverlay = () => {
  //   this.setState((prevState) => ({
  //     isPopoverOpen: !prevState.isOverlayOpen === true ? false : prevState.isPopoverOpen,
  //     isOverlayOpen: !prevState.isOverlayOpen,
  //   }));
  // };

  // private closePopover = () => {
  //   if (this.state.isPopoverOpen) {
  //     this.setState({ isPopoverOpen: false });
  //   }
  // };
  // }

  // const NodeContainer = euiStyled.div`
  //   position: relative;
  // `;

  // interface ColorProps {
  //   color: string;
  // }

  // const SquareOuter = euiStyled.div<ColorProps>`

  //   background-color: ${(props) => darken(0.1, props.color)};
  // `;

  // const SquareInner = euiStyled.div<ColorProps>`
  //   cursor: pointer;
  //   position: absolute;
  //   top: 0;
  //   right: 0;
  //   bottom: 2px;
  //   left: 0;
  //   border-radius: 3px;
  //   background-color: ${(props) => props.color};
  // `;

  // const ValueInner = euiStyled.button`
  //   position: absolute;
  //   top: 0;
  //   left: 0;
  //   right: 0;
  //   bottom: 0;
  //   display: flex;
  //   line-height: 1.2em;
  //   align-items: center;
  //   align-content: center;
  //   padding: 1em;
  //   overflow: hidden;
  //   flex-wrap: wrap;
  //   width: 100%;
  //   border: none;
  //   &:focus {
  //     outline: none !important;
  //     border: ${(params) => params.theme?.eui.euiFocusRingSize} solid
  //       ${(params) => params.theme?.eui.euiFocusRingColor};
  //     box-shadow: none;
  //   }
  // `;

  // const SquareTextContent = euiStyled.div<ColorProps>`
  //   text-align: center;
  //   width: 100%;
  //   overflow: hidden;
  //   text-overflow: ellipsis;
  //   white-space: nowrap;
  //   flex: 1 0 auto;
  //   color: ${(props) => readableColor(props.color)};
  // `;

  // const Value = euiStyled(SquareTextContent)`
  //   font-weight: bold;
  //   font-size: 0.9em;
  //   line-height: 1.2em;
  // `;

  // const Label = euiStyled(SquareTextContent)`
  //   font-size: 0.7em;
  //   margin-bottom: 0.7em;
  // `;
}
