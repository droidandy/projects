import React from 'react';
import { StrategicPlansActions, getStrategicPlansState } from '../interface';
import { useActions } from 'typeless';
import { Filter } from 'src/components/Filter';
import { Input } from 'src/components/FormInput';

export function StrategicPlansFilter() {
  const { isFilterOpened, filter } = getStrategicPlansState.useState();

  const { updateFilter, applyFilter, clearFilter, toggleFilter } = useActions(
    StrategicPlansActions
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
