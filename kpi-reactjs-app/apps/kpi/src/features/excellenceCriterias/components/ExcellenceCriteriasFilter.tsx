import React from 'react';
import {
  ExcellenceCriteriasActions,
  getExcellenceCriteriasState,
} from '../interface';
import { useActions } from 'typeless';
import { Filter } from 'src/components/Filter';
import { Input } from 'src/components/FormInput';

export function ExcellenceCriteriasFilter() {
  const { isFilterOpened, filter } = getExcellenceCriteriasState.useState();

  const { updateFilter, applyFilter, clearFilter, toggleFilter } = useActions(
    ExcellenceCriteriasActions
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
          label: 'Parent Id',
          control: (
            <Input
              value={filter.parentId || ''}
              onChange={e => updateFilter('parentId', e.target.value)}
            />
          ),
        },
      ]}
    />
  );
}
