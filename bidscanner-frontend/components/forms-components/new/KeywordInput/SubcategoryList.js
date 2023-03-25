import React from 'react';

import { Flex } from 'grid-styled';
import ListItem from './ListItem';

export default ({ subcategories, onRemove }) =>
  <Flex wrap>
    {subcategories.map(subcategory => <ListItem key={subcategory.id} {...subcategory} onRemove={onRemove} />)}
  </Flex>;
