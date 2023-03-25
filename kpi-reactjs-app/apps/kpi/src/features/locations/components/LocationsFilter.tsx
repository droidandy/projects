import React from 'react';
import { Select } from 'src/components/Select';
import { LocationsActions, getLocationsState } from '../interface';
import { useActions } from 'typeless';
import { Filter } from 'src/components/Filter';
import { Input } from 'src/components/FormInput';
import { isHeadquarterOptions } from '../utils';
import { getSelectOption } from 'src/common/utils';

export function LocationsFilter() {
  const { isFilterOpened, filter } = getLocationsState.useState();

  const { updateFilter, applyFilter, clearFilter, toggleFilter } = useActions(
    LocationsActions
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
          label: 'Address',
          control: (
            <Input
              value={filter.address}
              onChange={e => updateFilter('address', e.target.value)}
            />
          ),
        },
        {
          label: 'P.O Box',
          control: (
            <Input
              value={filter.poBox}
              onChange={e => updateFilter('poBox', e.target.value)}
            />
          ),
        },
        {
          label: 'City',
          control: (
            <Input
              value={filter.city}
              onChange={e => updateFilter('city', e.target.value)}
            />
          ),
        },
        {
          label: 'Country',
          control: (
            <Input
              value={filter.country}
              onChange={e => updateFilter('country', e.target.value)}
            />
          ),
        },
        {
          label: 'Is Headquarter',
          control: (
            <Select
              isClearable
              options={isHeadquarterOptions as any}
              value={getSelectOption(
                isHeadquarterOptions,
                filter.isHeadquarter
              )}
              onChange={(value: any) => updateFilter('isHeadquarter', value)}
            />
          ),
        },
      ]}
    />
  );
}
