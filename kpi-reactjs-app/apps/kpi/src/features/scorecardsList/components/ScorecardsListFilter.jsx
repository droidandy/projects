import React from 'react';
import { ScorecardsListActions, getScorecardsListState } from '../interface';
import { useActions } from 'typeless';
import { Filter } from 'src/components/Filter';
import { Input } from 'src/components/FormInput';

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
