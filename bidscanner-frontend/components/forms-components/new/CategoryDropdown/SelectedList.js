import React from 'react';

import { Flex } from 'grid-styled';
import SelectedItem from './SelectedItem';

export default ({ subcategories, onRemove }) =>
  <Flex wrap>
    {subcategories.map(subcategory =>
      <SelectedItem key={subcategory.id} {...subcategory} onRemove={onRemove} />
    )}
  </Flex>;
