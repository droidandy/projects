import React from 'react';
import { MetricsActions, getMetricsState } from '../interface';
import { useActions } from 'typeless';
import { Filter } from 'src/components/Filter';
import { Input } from 'src/components/FormInput';
import { booleanOptions } from 'src/common/options';
import { getSelectOption } from 'src/common/utils';
import { Select } from 'src/components/Select';

export function MetricsFilter() {
  const { isFilterOpened, filter } = getMetricsState.useState();

  const { updateFilter, applyFilter, clearFilter, toggleFilter } = useActions(
    MetricsActions
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
          label: 'Enabled',
          control: (
            <Select
              options={booleanOptions}
              value={getSelectOption(booleanOptions, filter.enabled)}
              onChange={(value: any) => updateFilter('enabled', value)}
            />
          ),
        },
        {
          label: 'Metric Type',
          control: (
            <Input
              value={filter.metricType}
              onChange={e => updateFilter('metricType', e.target.value)}
            />
          ),
        },
        {
          label: 'Data Type',
          control: (
            <Input
              value={filter.dataType}
              onChange={e => updateFilter('dataType', e.target.value)}
            />
          ),
        },
        {
          label: 'Data Source',
          control: (
            <Input
              value={filter.dataSource}
              onChange={e => updateFilter('dataSource', e.target.value)}
            />
          ),
        },
      ]}
    />
  );
}
