import React from 'react';
import * as Rx from 'src/rx';
import { KPIReportsView } from './components/KPIReportsView';
import {
  KPIReportsActions,
  handle,
  getKPIReportsState,
  KPIReportsState,
} from './interface';
import { searchKpiReports, getAllOrganizationUnit } from 'shared/API';
import { catchErrorAndShowModal } from 'src/common/utils';
import { defaultPeriod } from '../dashboard/utils';
import { getRouterState } from 'typeless-router';
import { DisplayTransString } from 'src/components/DisplayTransString';
import { OrganizationUnit } from 'shared/types';
import { SelectOption } from 'src/types';

function getQueryStringParams(query: string) {
  return query
    ? (/^[?#]/.test(query) ? query.slice(1) : query)
        .split('&')
        .reduce((params: any, param: string) => {
          let [key, value] = param.split('=');
          params[key] = value
            ? decodeURIComponent(value.replace(/\+/g, ' '))
            : '';
          return params;
        }, {})
    : {};
}

export function _getCriteria() {
  const { filter, sortBy, sortType, period } = getKPIReportsState();
  const criteria: any = {
    year: period.year,
    periodNumber: period.periodNumber,
    periodFrequency: period.frequency,
    pageSize: 0,
    // pageIndex: pagination.pageIndex,
    sortBy: sortBy,
    sortType: sortType,
  };

  Object.keys(filter).forEach(key => {
    if (
      key === 'colors' ||
      key === 'kpiLevels' ||
      key === 'kpiTypes' ||
      key === 'frequencies' ||
      key === 'units' ||
      key === 'aggregationTypes'
    ) {
      filter[key]
        ? (criteria[key] = filter[key].map((el: SelectOption) => {
            return el.value;
          }))
        : null;
    }
  });
  if (filter.organizationId) {
    criteria.organizationId = filter.organizationId.value;
  }
  if (filter.searchText) {
    criteria.searchText = filter.searchText;
  }

  return criteria;
}

const initialParams = () => {
  const { location } = getRouterState();
  const value = getQueryStringParams(location!.search);
  const filter: any = {};

  Object.keys(value).forEach(key => {
    if (key === 'organizationId' || key === 'year' || key === 'periodNumber') {
      filter[key] = +value[key];
    }
    if (
      key === 'units' ||
      key === 'colors' ||
      key === 'frequencies' ||
      key === 'aggregationTypes' ||
      key === 'kpiTypes' ||
      key === 'kpiLevels'
    ) {
      switch (key) {
        case 'units':
          filter[key] = value[key].split(',').map((el: string) => {
            return +el;
          });
          break;
        default:
          filter[key] = value[key].split(',');
          break;
      }
    }
    if (
      key === 'fileType' ||
      key === 'periodFrequency' ||
      key === 'searchText'
    ) {
      filter[key] = value[key];
    }
  });

  return { filter };
};

// --- Reducer ---
handle
  .epic()
  .on(KPIReportsActions.$mounted, () => {
    const { filter } = initialParams();

    return Rx.concatObs(
      Rx.of(KPIReportsActions.setIsLoading(true)),
      searchKpiReports(filter).pipe(
        Rx.map((ret: any) => KPIReportsActions.loaded(ret)),
        catchErrorAndShowModal()
      ),
      getAllOrganizationUnit(1).pipe(
        Rx.mergeMap(ret => [
          KPIReportsActions.loadedUnits(ret),
          KPIReportsActions.initialFilter(filter, ret),
        ]),
        catchErrorAndShowModal()
      ),
      Rx.of(KPIReportsActions.setIsLoading(false))
    );
  })
  .on(KPIReportsActions.search, (_, { action$ }) => {
    return Rx.concatObs(
      Rx.of(KPIReportsActions.setIsLoading(true)),
      searchKpiReports(_getCriteria()).pipe(
        Rx.map((ret: any) => KPIReportsActions.loaded(ret)),
        catchErrorAndShowModal()
      ),
      Rx.of(KPIReportsActions.setIsLoading(false))
    ).pipe(Rx.takeUntil(action$.pipe(Rx.ofType(KPIReportsActions.search))));
  })
  .on(KPIReportsActions.changePeriod, () => KPIReportsActions.search())
  // .on(KPIReportsActions.changePage, () => {
  //   return KPIReportsActions.search();
  // })
  .on(KPIReportsActions.changeSortType, () => {
    return KPIReportsActions.search();
  })
  .on(KPIReportsActions.clearFilters, () => {
    return KPIReportsActions.search();
  });

const initialState: KPIReportsState = {
  period: defaultPeriod,
  filter: {},
  items: [],
  units: [],
  isLoading: false,
  pageSize: 0,
  sortBy: 'performance.id',
  sortType: 'ASC',
  isFilterExpanded: false,
  // pagination: {
  //   pageIndex: 1,
  //   pageSize: 10,
  //   totalCount: 1,
  // },
};

handle
  .reducer(initialState)
  .on(KPIReportsActions.$mounted, () => initialState)
  .on(KPIReportsActions.setIsLoading, (state, { isLoading }) => {
    state.isLoading = isLoading;
  })
  .on(KPIReportsActions.loaded, (state, { items }) => {
    state.items = items;
  })
  .on(KPIReportsActions.setFilter, (state, { name, value }) => {
    state.filter[name] = value;
  })
  .on(KPIReportsActions.changePeriod, (state, { period }) => {
    state.period = period;
  })
  .on(KPIReportsActions.loadedUnits, (state, { items }) => {
    state.units = items;
  })
  // .on(KPIReportsActions.changePage, (state, { pageIndex, pageSize }) => {
  //   pageSize ? (state.pagination.pageSize = pageSize) : null;
  //   state.pagination.pageIndex = pageIndex;
  // })
  .on(KPIReportsActions.changeSortType, (state, { sortType, sortBy }) => {
    state.sortType = sortType;
    sortBy ? (state.sortBy = sortBy) : null;
  })
  .on(KPIReportsActions.initialFilter, (state, items) => {
    const { filters } = items;
    const { units: unitsArr } = items;
    const initialFilter: any = {};

    Object.keys(filters).forEach(key => {
      if (
        key === 'colors' ||
        key === 'kpiLevels' ||
        key === 'kpiTypes' ||
        key === 'frequencies' ||
        key === 'aggregationTypes'
      ) {
        initialFilter[key] = filters[key].map((el: string) => {
          return {
            label: el.charAt(0).toUpperCase() + el.slice(1),
            value: el,
          };
        });
      }
    });

    Object.keys(filters).forEach(key => {
      if (key === 'units') {
        const initialUnit = unitsArr.filter((el: OrganizationUnit) => {
          return filters[key].some((item: string) => +item === el.id);
        });
        initialUnit && initialUnit.length
          ? (initialFilter[key] = initialUnit.map(el => {
              return {
                label: <DisplayTransString value={el.name} />,
                value: el.id,
              };
            }))
          : null;
      }
    });

    if (filters.organizationId) {
      const initialUnit = unitsArr.find((el: OrganizationUnit) => {
        return filters.organizationId === el.id;
      });
      initialUnit
        ? (initialFilter.organizationId = {
            label: <DisplayTransString value={initialUnit.name} />,
            value: initialUnit.id,
          })
        : null;
    }

    if (filters.searchText) {
      initialFilter.searchText = filters.searchText;
    }

    Object.keys(filters).forEach(filterKey => {
      switch (filterKey) {
        case 'year':
          state.period = { ...state.period, year: filters[filterKey] };
          break;
        case 'periodFrequency':
          state.period = { ...state.period, frequency: filters[filterKey] };
          break;
        case 'periodNumber':
          state.period = { ...state.period, periodNumber: filters[filterKey] };
          break;
        default:
          break;
      }
    });

    state.filter = { ...initialFilter };
  })
  .on(KPIReportsActions.clearFilters, state => {
    state.filter = {};
    state.period = defaultPeriod;
    window.history.replaceState({}, '', '/kpi-reports');
  })
  .on(KPIReportsActions.setIsFilterExpanded, (state, { isFilterExpanded }) => {
    state.isFilterExpanded = isFilterExpanded;
  });

// --- Module ---
export default () => {
  handle();
  return <KPIReportsView />;
};
