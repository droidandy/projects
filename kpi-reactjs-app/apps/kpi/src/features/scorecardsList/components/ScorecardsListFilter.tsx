import React from 'react';
import { ScorecardsListActions, getScorecardsListState } from '../interface';
import { useActions } from 'typeless';
import { Filter } from 'src/components/Filter';
import { Input } from 'src/components/FormInput';
import { Select } from 'src/components/Select';
import { booleanOptions } from 'src/common/options';
import { getSelectOption } from 'src/common/utils';

export function ScorecardsListFilter() {
  const { isFilterOpened, filter } = getScorecardsListState.useState();

  const { updateFilter, applyFilter, clearFilter, toggleFilter } = useActions(
    ScorecardsListActions
  );

  return (
    <Filter
      isFilterOpened={isFilterOpened}
      applyFilter={applyFilter}
      clearFilter={clearFilter}
      toggleFilter={toggleFilter}
      fields={[
        {
          label: 'Strategic Plan ID',
          control: (
            <Input
              value={filter.strategicPlanId}
              onChange={e => updateFilter('strategicPlanId', e.target.value)}
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
      ]}
    />
  );
}
