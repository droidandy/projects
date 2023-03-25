import React from 'react';
import { UsersActions, getUsersState } from '../interface';
import { useActions } from 'typeless';
import { Filter } from 'src/components/Filter';
import { Input } from 'src/components/FormInput';

export function UsersFilter() {
  const { isFilterOpened, filter } = getUsersState.useState();

  const { updateFilter, applyFilter, clearFilter, toggleFilter } = useActions(
    UsersActions
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
          label: 'Email',
          control: (
            <Input
              value={filter.email}
              onChange={e => updateFilter('email', e.target.value)}
            />
          ),
        },
      ]}
    />
  );
}
