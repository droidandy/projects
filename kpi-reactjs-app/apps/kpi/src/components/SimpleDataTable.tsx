import { Column, DataTable } from './DataTable';
import React from 'react';

interface SimpleDataTableProps<T> {
  className?: string;
  columns: Array<Column<T>>;
  items: T[];
}

export function SimpleDataTable<T>(props: SimpleDataTableProps<T>) {
  const { items, columns } = props;
  return (
    <DataTable<T>
      sortBy={'_'}
      sortDesc={false}
      isLoading={false}
      items={items}
      columns={columns}
      pageSize={0}
      pageNumber={0}
      total={items.length}
      search={() => {
        //
      }}
      noPagination
    />
  );
}
