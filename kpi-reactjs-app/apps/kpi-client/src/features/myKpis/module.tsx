import React from 'react';
import * as Rx from 'src/rx';
import { MyKpisView } from './components/MyKpisView';
import {
  MyKpisActions,
  MyKpisState,
  handle,
  getMyKpisState,
} from './interface';
import { defaultPeriod } from '../dashboard/utils';
import { catchErrorAndShowModal } from 'src/common/utils';
import { getMyObjectPerformanceMeasures, getKpi } from 'shared/API';
import { getGlobalState } from '../global/interface';
import { getRouterState } from 'typeless-router';
import { KpiDetailsActions } from '../kpiDetails/interface';

// --- Epic ---
function _getCriteria() {
  const { period } = getMyKpisState();
  const { orgId } = getGlobalState().user!.orgUsers[0];
  const criteria: any = {
    orgId,
    periodNumber: period.periodNumber,
    year: period.year,
    periodAggregation: period.frequency,
  };

  return criteria;
}

function _getKpiId() {
  const { search } = getRouterState().location!;
  if (!search) {
    return null;
  }
  const match = /id=(\d+)/.exec(search);
  return match ? Number(match[1]) : null;
}

handle
  .epic()
  .on(MyKpisActions.$mounted, () => MyKpisActions.search())
  .on(MyKpisActions.$mounted, () => {
    const id = _getKpiId();
    if (!id) {
      return Rx.empty();
    }
    return getKpi(id).pipe(
      Rx.map(kpi => KpiDetailsActions.show(kpi, 'details'))
    );
  })
  .on(MyKpisActions.search, (_, { action$ }) => {
    return Rx.concatObs(
      Rx.of(MyKpisActions.setIsLoading(true)),
      getMyObjectPerformanceMeasures(_getCriteria()).pipe(
        Rx.map(ret => MyKpisActions.loaded(ret)),
        catchErrorAndShowModal()
      ),
      Rx.of(MyKpisActions.setIsLoading(false))
    ).pipe(Rx.takeUntil(action$.pipe(Rx.ofType(MyKpisActions.search))));
  })
  .onMany([MyKpisActions.applyFilter, MyKpisActions.clearFilter], () => {
    if (getMyKpisState().periodChanged) {
      return MyKpisActions.search();
    }

    return false;
  });

// --- Reducer ---
const initialState: MyKpisState = {
  period: defaultPeriod,
  items: [],
  isLoading: false,
  isFilterExpanded: false,
  sortType: 'ASC',
  sortBy: 'name',
  filter: {
    aggregation: null,
    scoringType: null,
    level: null,
    frequency: null,
    status: null,
    kpiCode: '',
    kpiName: '',
  },
  tempFilter: {
    aggregation: null,
    scoringType: null,
    level: null,
    frequency: null,
    status: null,
    kpiCode: '',
    kpiName: '',
  },
  periodChanged: false,
};

handle
  .reducer(initialState)
  .on(MyKpisActions.$mounted, () => initialState)
  .on(MyKpisActions.setIsLoading, (state, { isLoading }) => {
    state.isLoading = isLoading;
  })
  .on(MyKpisActions.loaded, (state, { items }) => {
    state.items = items;
    state.periodChanged = false;
  })
  .on(MyKpisActions.changePeriod, (state, { period }) => {
    state.period = period;
    state.periodChanged = true;
  })
  .on(MyKpisActions.setIsFilterExpanded, (state, { isFilterExpanded }) => {
    state.isFilterExpanded = isFilterExpanded;
  })
  .on(MyKpisActions.setFilter, (state, { name, value }) => {
    state.tempFilter[name] = value;
  })
  .on(MyKpisActions.applyFilter, state => {
    state.filter = state.tempFilter;
  })
  .on(MyKpisActions.clearFilter, state => {
    state.filter = initialState.filter;
    state.tempFilter = initialState.filter;
    if (state.period !== defaultPeriod) {
      state.periodChanged = true;
      state.period = defaultPeriod;
    }
  });

// --- Module ---
export default () => {
  handle();
  return <MyKpisView />;
};
