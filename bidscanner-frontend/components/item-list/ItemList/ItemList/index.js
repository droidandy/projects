// @flow
import React from 'react';
import { Row, Col } from 'reactstrap';

import Item, { type ItemProps } from 'components/item-list/ItemList/ItemList/Item';

export type ItemListProps = {
  items: ItemProps[]
};

export default ({ items }: ItemListProps) => (
  <Row>
    <Col>
      {/* TODO: keys */}
      {items.map(item => <Item {...item} />)}
    </Col>
  </Row>
);
