import React from 'react';
import { Select } from 'src/components/Select';
import { RolesActions, getRolesState } from '../interface';
import { useActions } from 'typeless';
import { Filter } from 'src/components/Filter';
import { Input } from 'src/components/FormInput';
import { permissions } from 'src/const';
import { SelectOption } from 'src/types';

const permissionOptions = permissions.map(x => ({ value: x, label: x }));

export function RolesFilter() {
  const { isFilterOpened, filter } = getRolesState.useState();

  const { updateFilter, applyFilter, clearFilter, toggleFilter } = useActions(
    RolesActions
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
          label: 'Roles',
          control: (
            <Select
              isMulti
              options={permissionOptions}
              value={filter.roles}
              onChange={(value: SelectOption[]) => updateFilter('roles', value)}
            />
          ),
        },
      ]}
    />
  );
}
