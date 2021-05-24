/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React, { useEffect, useState } from 'react';
import { divide, first } from 'lodash';
import { darken, readableColor } from 'polished';
import { i18n } from '@kbn/i18n';
import { EuiPopover, EuiWrappingPopover, EuiToolTip } from '@elastic/eui';
// import { euiStyled } from '../../../../../../../../../src/plugins/kibana_react/common';
import {
  InfraWaffleMapBounds,
  InfraWaffleMapGroupOfNodes,
  InfraWaffleMapNode,
  InfraWaffleMapOptions,
} from '../../../../../lib/lib';
import { GroupName } from './group_name';
// import { Node } from './node';
import { InventoryItemType } from '../../../../../../common/inventory_models/types';

// import { EuiPopover } from '@elastic/eui';
// import { ConditionalToolTip } from './conditional_tooltip';
import { colorFromValue } from '../../lib/color_from_value';
import './node.scss';
import { NodeContextMenu } from './node_context_menu';
import { ConditionalToolTip } from './conditional_tooltip';

interface Props {
  onDrilldown: (filter: string) => void;
  options: InfraWaffleMapOptions;
  group: InfraWaffleMapGroupOfNodes;
  formatter: (val: number) => string;
  isChild: boolean;
  bounds: InfraWaffleMapBounds;
  nodeType: InventoryItemType;
  currentTime: number;
}

export const GroupOfNodes: React.FC<Props> = ({
  group,
  options,
  formatter,
  onDrilldown,
  isChild = false,
  bounds,
  nodeType,
  currentTime,
}) => {
  const width = group.width > 200 ? group.width : 200;
  const [popoverDetails, setPopoverDetails] = useState({
    isOpen: false,
    node: {},
    target: {},
  });

  const [tooltipDetails, setTooltipDetails] = useState({
    isOpen: false,
    node: {},
    target: undefined,
    top: undefined,
    left: undefined,
  });

  const closePopover = () => setPopoverDetails({ ...popoverDetails, isOpen: false });

  const handleClick = (event: any) => {
    const nodeId = event.target.closest('.node-with-id').id;
    const node = group.nodes.find((n) => n.id === nodeId);
    setPopoverDetails({
      isOpen: true,
      node: node as any,
      target: event.target.closest('.node-with-id'),
    });
  };

  const handleMouseMove = (event: any) => {
    const elem = event.target.closest('.node-with-id');
    if (!elem) {
      return;
    }

    if (elem.isSameNode(tooltipDetails.target) && popoverDetails.isOpen) {
      return;
    }

    const node = group.nodes.find((n) => n.id === elem.id);

    setTooltipDetails({
      isOpen: true,
      target: event.target,
      node: node as any,
      top: elem.offsetTop,
      left: elem.offsetLeft,
    });
  };

  const handleOverlayClick = (event: any) => {
    setTooltipDetails({ ...tooltipDetails, isOpen: false });
    if (tooltipDetails.target) {
      tooltipDetails.target.click();
    }
  };

  return (
    <div style={{ width, margin: '0 10px' }}>
      <GroupName group={group} onDrilldown={onDrilldown} isChild={isChild} options={options} />
      <div
        className="waffle-map-nodes"
        onClick={(event) => handleClick(event)}
        onKeyDown={(event) => handleClick(event)}
        onMouseMove={(event) => handleMouseMove(event)}
      >
        {group.width
          ? group.nodes.map((node) => {
              const metric = first(node.metrics);
              const valueMode = group.squareSize > 70;
              const ellipsisMode = group.squareSize > 30;
              const rawValue = (metric && metric.value) || 0;
              const color = colorFromValue(options.legend, rawValue, bounds);
              const value = formatter(rawValue);
              const nodeAriaLabel = i18n.translate('xpack.infra.node.ariaLabel', {
                defaultMessage: '{nodeName}, click to open menu',
                values: { nodeName: node.name },
              });

              const squareOuterColor = { backgroundColor: darken(0.1, color) };
              const squareOuterStyle = false
                ? { border: 'solid 4px #000', ...squareOuterColor }
                : squareOuterColor;

              const textColor = readableColor(color);
              return (
                <div
                  key={node.id}
                  id={node.id}
                  data-test-subj="nodeContainer"
                  className="node-with-id"
                  style={{
                    width: group.squareSize || 0,
                    height: group.squareSize || 0,
                    position: 'relative',
                  }}
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
            })
          : null}
        {tooltipDetails.isOpen && (
          <div
            style={{
              width: group.squareSize || 0,
              height: group.squareSize || 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              position: 'absolute',
              top: tooltipDetails.top,
              left: tooltipDetails.left,
            }}
          >
            <EuiToolTip
              delay="regular"
              position="right"
              content={
                <ConditionalToolTip
                  currentTime={currentTime}
                  node={tooltipDetails.node}
                  nodeType={nodeType}
                />
              }
            >
              <div
                style={{
                  width: group.squareSize || 0,
                  height: group.squareSize || 0,
                }}
                onClick={handleOverlayClick}
                onKeyDown={handleOverlayClick}
              />
            </EuiToolTip>
          </div>
        )}
      </div>

      {popoverDetails.isOpen && (
        <EuiWrappingPopover
          button={popoverDetails.target}
          isOpen={popoverDetails.isOpen}
          closePopover={closePopover}
          anchorPosition="downCenter"
        >
          <NodeContextMenu
            node={popoverDetails.node}
            nodeType={nodeType}
            options={options}
            currentTime={currentTime}
          />
        </EuiWrappingPopover>
      )}
    </div>
  );
};
