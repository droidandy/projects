import React from 'react';
import {
  LookupManagementActions,
  getLookupManagementState,
} from '../interface';
import { useActions } from 'typeless';
import { Filter } from 'src/components/Filter';
import { Input } from 'src/components/FormInput';

export function LookupManagementFilter() {
  const { isFilterOpened, filter } = getLookupManagementState.useState();
  const { updateFilter, applyFilter, clearFilter, toggleFilter } = useActions(
    LookupManagementActions
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
        {
          label: 'Category',
          control: (
            <Input
              value={filter.category}
              onChange={e => updateFilter('category', e.target.value)}
            />
          ),
        },
      ]}
    />
  );
}
