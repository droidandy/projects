import React from 'react';
import * as Rx from 'src/rx';
import { ExcellenceView } from './components/ExcellenceView';
import {
  ExcellenceActions,
  ExcellenceState,
  handle,
  ExcellenceFilter,
  getExcellenceState,
} from './interface';
import { searchExcellenceRequirements } from 'shared/API';
import { catchErrorAndShowModal } from 'src/common/utils';
import { CalcExcellence } from 'src/types';

// --- Epic ---

function _getCriteria() {
  const { filter } = getExcellenceState();
  const criteria: any = {
    pageIndex: 0,
    pageSize: 1e5,
  };
  if (filter.status) {
    //
  }
  return criteria;
}

handle
  .epic()
  .on(ExcellenceActions.$mounted, () => ExcellenceActions.search())
  .on(ExcellenceActions.search, (_, { action$ }) => {
    return Rx.concatObs(
      Rx.of(ExcellenceActions.setIsLoading(true)),
      searchExcellenceRequirements(_getCriteria()).pipe(
        Rx.map(ret => ExcellenceActions.loaded(ret.items)),
        catchErrorAndShowModal()
      ),
      Rx.of(ExcellenceActions.setIsLoading(false))
    ).pipe(Rx.takeUntil(action$.pipe(Rx.ofType(ExcellenceActions.search))));
  });

// --- Reducer ---
const defaultFilter: ExcellenceFilter = {
  status: [],
};

const initialState: ExcellenceState = {
  isLoading: true,
  items: [],
  filter: defaultFilter,
  tempFilter: defaultFilter,
  isFilterExpanded: false,
};

handle
  .reducer(initialState)
  .on(ExcellenceActions.$mounted, () => initialState)
  .on(ExcellenceActions.setIsLoading, (state, { isLoading }) => {
    state.isLoading = isLoading;
  })
  .on(ExcellenceActions.loaded, (state, { items }) => {
    state.items = items.map(item => {
      return {
        ...item,
        calcStatus: item.isCompleted
          ? 'Completed'
          : item.isEnabled
          ? 'Active'
          : item.requirementStatus,
      } as CalcExcellence;
    });
  })
  .on(ExcellenceActions.setFilter, (state, { name, value }) => {
    state.tempFilter[name] = value;
  })
  .on(ExcellenceActions.clearFilter, state => {
    state.filter = defaultFilter;
    state.tempFilter = defaultFilter;
  })
  .on(ExcellenceActions.applyFilter, state => {
    state.filter = state.tempFilter;
  })
  .on(ExcellenceActions.setIsFilterExpanded, (state, { isFilterExpanded }) => {
    state.isFilterExpanded = isFilterExpanded;
  });

// --- Module ---
export default () => {
  handle();
  return <ExcellenceView />;
};
