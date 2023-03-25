import React from 'react';
import {
  ExcellenceThemesActions,
  getExcellenceThemesState,
} from '../interface';
import { useActions } from 'typeless';
import { Filter } from 'src/components/Filter';
import { Input } from 'src/components/FormInput';

export function ExcellenceThemesFilter() {
  const { isFilterOpened, filter } = getExcellenceThemesState.useState();

  const { updateFilter, applyFilter, clearFilter, toggleFilter } = useActions(
    ExcellenceThemesActions
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
