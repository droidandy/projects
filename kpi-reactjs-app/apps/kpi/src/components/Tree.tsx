import * as React from 'react';
import styled, { css } from 'styled-components';

export interface TreeItem {
  id: string | number;
  label: React.ReactNode;
  children: TreeItem[];
}

// tslint:disable-next-line:no-var-requires
const sprite = require('../../assets/images/tree_32px.png');

interface IconProps {
  iconType?: 'default' | 'opened' | 'closed';
}
const Icon = styled.i<IconProps>`
  background-image: url('${sprite}');
  width: 24px;
  height: 24px;
  line-height: 24px;
  display: inline-block;
  vertical-align: top;
  ${props => {
    switch (props.iconType) {
      case 'opened':
        return css`
          background-position: -132px -4px;
          cursor: pointer;
        `;
      case 'closed':
        return css`
          background-position: -100px -4px;
          cursor: pointer;
        `;
      default:
        return css`
          background-position: -68px -4px;
        `;
    }
  }}
`;

const Item = styled.li`
  margin-left: 24px;
  color: #a2a5b9;
  min-height: 24px;
  line-height: 24px;
  min-width: 24px;
  background-image: url('${sprite}');
  background-position: -292px -4px;
  background-repeat: repeat-y;
  white-space: nowrap;

  &:last-child {
    background: transparent;
  }
`;

interface TextProps {
  active?: boolean;
}

const Text = styled.a<TextProps>`
  color: #a2a5b9;
  padding: 0 8px 0 8px;
  line-height: 24px;
  height: 24px;
  white-space: nowrap;
  vertical-align: top;
  &:hover {
    background: #f7f8fa;
    cursor: pointer;
  }
  ${props =>
    props.active &&
    css`
      background: #f7f8fa;
    `}
`;

const Group = styled.ul`
  display: block;
  margin: 0;
  padding: 0;
  list-style-type: none;
  list-style-image: none;
`;

interface TreeProps {
  className?: string;
  items: TreeItem[];
  selected: string | number;
  onChange: (item: TreeItem) => any;
}

const _Tree = (props: TreeProps) => {
  const { className, items, selected, onChange } = props;
  const [collapsed, setCollapsed] = React.useState(
    {} as {
      [x: string]: boolean;
    }
  );

  const renderItem = (item: TreeItem, depth: number) => {
    const hasChildren = item.children.length > 0;
    const isCollapsed = collapsed[item.id];
    return (
      <React.Fragment key={item.id}>
        <Item>
          <Icon
            onClick={() => {
              if (hasChildren) {
                const copy = { ...collapsed };
                copy[item.id] = !copy[item.id];
                setCollapsed(copy);
              }
            }}
            iconType={
              hasChildren ? (isCollapsed ? 'closed' : 'opened') : 'default'
            }
          />
          <Text
            onClick={() => {
              onChange(item);
            }}
            active={item.id === selected}
          >
            {item.label}
          </Text>
          {hasChildren && !isCollapsed && (
            <Group>
              {item.children.map(child => renderItem(child, depth + 1))}
            </Group>
          )}
        </Item>
      </React.Fragment>
    );
  };

  return (
    <ul className={className}>{items.map(item => renderItem(item, 0))}</ul>
  );
};

export const Tree = styled(_Tree)`
  display: block;
  margin: 0;
  padding: 0;
  list-style-type: none;
  list-style-image: none;
  > ${Item} {
    margin-left: 0;
  }
`;
