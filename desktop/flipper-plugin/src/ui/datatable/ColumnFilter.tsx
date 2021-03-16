/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import {useMemo, useState} from 'react';
import styled from '@emotion/styled';
import React from 'react';
import {theme} from '../theme';
import type {DataTableColumn} from './DataTable';

import {Button, Checkbox, Dropdown, Menu, Typography, Input} from 'antd';
import {FilterFilled, MinusCircleOutlined} from '@ant-design/icons';
import {Layout} from '../Layout';

const {Text} = Typography;

export const HeaderButton = styled(Button)({
  padding: 4,
  backgroundColor: theme.backgroundWash,
  borderRadius: 0,
});

export type ColumnFilterHandlers = {
  onAddColumnFilter(columnId: string, value: string): void;
  onRemoveColumnFilter(columnId: string, index: number): void;
  onToggleColumnFilter(columnId: string, index: number): void;
};

export function FilterIcon({
  column,
  ...props
}: {column: DataTableColumn<any>} & ColumnFilterHandlers) {
  const [input, setInput] = useState('');
  const {filters} = column;
  const isActive = useMemo(() => filters?.some((f) => f.enabled), [filters]);

  const onAddFilter = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    props.onAddColumnFilter(column.key, input);
    setInput('');
  };

  const menu = (
    <Menu
      onMouseDown={(e) => {
        e.stopPropagation(); // prevents interaction accidentally with the Interactive component organizing resizng
      }}>
      <Menu.Item>
        <Layout.Right gap>
          <Input
            placeholder="Filter by value"
            value={input}
            onChange={(e) => {
              e.stopPropagation();
              setInput(e.target.value);
            }}
            onClick={(e) => {
              e.stopPropagation();
            }}
            onPressEnter={onAddFilter}
            disabled={false}
          />
          <Button onClick={onAddFilter}>Add</Button>
        </Layout.Right>
      </Menu.Item>
      <Menu.Divider />
      {filters?.length ? (
        filters?.map((filter, index) => (
          <Menu.Item key={index}>
            <Layout.Right center>
              <Checkbox
                checked={filter.enabled}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  props.onToggleColumnFilter(column.key, index);
                }}>
                {filter.label}
              </Checkbox>
              {!filter.predefined && (
                <MinusCircleOutlined
                  onClick={(e) => {
                    e.stopPropagation();
                    props.onRemoveColumnFilter(column.key, index);
                  }}
                />
              )}
            </Layout.Right>
          </Menu.Item>
        ))
      ) : (
        <Text type="secondary" style={{margin: 12}}>
          No active filters
        </Text>
      )}
    </Menu>
  );

  return (
    <Dropdown overlay={menu} trigger={['click']}>
      <HeaderButton
        type="text"
        style={{
          visibility: isActive ? 'visible' : 'hidden',
          color: isActive ? theme.primaryColor : theme.disabledColor,
        }}>
        <FilterFilled />
      </HeaderButton>
    </Dropdown>
  );
}
