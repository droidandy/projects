import React from 'react';
import { DataSourceListActions, getDataSourceListState } from '../interface';
import { useActions } from 'typeless';
import { Filter } from 'src/components/Filter';
import { Input } from 'src/components/FormInput';

export function DataSourceFilter() {
  const { isFilterOpened, filter } = getDataSourceListState.useState();
  const { updateFilter, applyFilter, clearFilter, toggleFilter } = useActions(
    DataSourceListActions
  );

  return (
    <Filter
      isFilterOpened={isFilterOpened}
      applyFilter={applyFilter}
      clearFilter={clearFilter}
      toggleFilter={toggleFilter}
      fields={[
        {
          label: 'Name',
          control: (
            <Input
              value={filter.name}
              onChange={e => updateFilter('name', e.target.value)}
            />
          ),
        },
      ]}
    />
  );
}
