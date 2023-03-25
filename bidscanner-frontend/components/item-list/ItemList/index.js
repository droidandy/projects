// @flow
import React from 'react';

import SearchContainer from 'containers/item-list/ItemList/SearchContainer';
import PaginationContainer from 'containers/item-list/ItemList/PaginationContainer';
import ItemList, { type ItemListProps } from 'components/item-list/ItemList/ItemList';

type Props = ItemListProps;

export default ({ items }: Props) => (
  <div>
    <div className="mt-5">
      <SearchContainer />
    </div>
    <div className="mt-3">
      <ItemList items={items} />
    </div>
    <div className="mt-3">
      <PaginationContainer />
    </div>
  </div>
);
