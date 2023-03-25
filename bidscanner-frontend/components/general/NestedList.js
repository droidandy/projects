// @flow
import React from 'react';
import { List, ListItem } from 'material-ui/List';
import { Flex } from 'grid-styled';
import styled from 'styled-components';

type NestedListProps = {
  items: Array<{
    title: string,
    text: string,
  }>,
};

const Title = styled(Flex)`
  font-size: 16px;
  font-weight: bold;
`;

const EmptyIconWrapper = (props) => <i />

export default ({ items }: NestedListProps) => (
  <List>
    {items.map((item, index) => (
      <Flex key={`listItem-${index}`} align="center">
        <ListItem
          key={`item-${item.title}`}
          rightIconButton={<EmptyIconWrapper />}
          primaryText={
            <Title>
              {item.title}
              {<i className="fa fa-caret-down" aria-hidden="true" style={{ marginLeft: '1em' }} />}
            </Title>
          }
          primaryTogglesNestedList
          nestedItems={[<ListItem key={1} primaryText={item.text} disabled />]}
        />
      </Flex>
    ))}
  </List>
);
