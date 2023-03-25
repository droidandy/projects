import React from 'react';
import * as Rx from 'src/rx';
import { ExcellenceReportsView } from './components/ExcellenceReportsView';
import {
  ExcellenceReportsActions,
  handle,
  getExcellenceReportsState,
  ExcellenceReportsState,
} from './interface';
import { getAllOrganizationUnit, searchExcellenceReports } from 'shared/API';
import { catchErrorAndShowModal } from 'src/common/utils';
import { getRouterState } from 'typeless-router';
import { DisplayTransString } from 'src/components/DisplayTransString';
import { OrganizationUnit } from 'shared/types';
import { SelectOption } from 'src/types';
import { Trans } from 'react-i18next';

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
  const { filter, sortBy, sortType } = getExcellenceReportsState();
  const criteria: any = {
    pageSize: 0,
    sortBy: sortBy,
    sortType: sortType,
  };

  if (filter.reportId) {
    criteria.reportId = +filter.reportId;
  }
  if (filter.fileType) {
    criteria.fileType = filter.fileType.value;
  }
  if (filter.ownerUnits && filter.ownerUnits.length) {
    criteria.ownerUnits = filter.ownerUnits.map((el: SelectOption) => {
      return el.value;
    });
  }
  if (filter.responsilbeUnits && filter.responsilbeUnits.length) {
    criteria.responsilbeUnits = filter.responsilbeUnits.map(
      (el: SelectOption) => {
        return el.value;
      }
    );
  }

  return criteria;
}

const initialParams = () => {
  const { location } = getRouterState();
  const value = getQueryStringParams(location!.search);
  const filter: any = {};

  Object.keys(value).forEach(key => {
    if (key === 'reportId') {
      filter[key] = +value[key];
    }
    if (key === 'fileType') {
      filter[key] = value[key];
    }
    if (key === 'ownerUnits' || key === 'responsilbeUnits') {
      filter[key] = value[key].split(',').map((el: string) => {
        return +el;
      });
    }
  });

  return { filter };
};

// --- Reducer ---
handle
  .epic()
  .on(ExcellenceReportsActions.$mounted, () => {
    const { filter } = initialParams();

    return Rx.concatObs(
      Rx.of(ExcellenceReportsActions.setIsLoading(true)),
      searchExcellenceReports(filter).pipe(
        Rx.map((ret: any) => ExcellenceReportsActions.loaded(ret)),
        catchErrorAndShowModal()
      ),
      getAllOrganizationUnit(1).pipe(
        Rx.mergeMap(ret => [
          ExcellenceReportsActions.loadedUnits(ret),
          ExcellenceReportsActions.initialFilter(filter, ret),
        ]),
        catchErrorAndShowModal()
      ),
      Rx.of(ExcellenceReportsActions.setIsLoading(false))
    );
  })
  .on(ExcellenceReportsActions.search, (_, { action$ }) => {
    return Rx.concatObs(
      Rx.of(ExcellenceReportsActions.setIsLoading(true)),
      searchExcellenceReports(_getCriteria()).pipe(
        Rx.map((ret: any) => ExcellenceReportsActions.loaded(ret)),
        catchErrorAndShowModal()
      ),
      Rx.of(ExcellenceReportsActions.setIsLoading(false))
    ).pipe(
      Rx.takeUntil(action$.pipe(Rx.ofType(ExcellenceReportsActions.search)))
    );
  })
  .on(ExcellenceReportsActions.setFilter, ({ name }, { action$ }) => {
    if (name === 'reportId') {
      return Rx.of(ExcellenceReportsActions.search()).pipe(
        Rx.delay(300),
        Rx.takeUntil(
          action$.pipe(Rx.ofType(ExcellenceReportsActions.setFilter))
        )
      );
    } else {
      return ExcellenceReportsActions.search();
    }
  })
  .on(ExcellenceReportsActions.changeSortType, () => {
    return ExcellenceReportsActions.search();
  })
  .on(ExcellenceReportsActions.clearFilters, () => {
    return ExcellenceReportsActions.search();
  });

const initialState: ExcellenceReportsState = {
  filter: {},
  items: [],
  units: [],
  isLoading: false,
  pageSize: 0,
  sortBy: 'performance.id',
  sortType: 'ASC',
};

handle
  .reducer(initialState)
  .on(ExcellenceReportsActions.$mounted, () => initialState)
  .on(ExcellenceReportsActions.setIsLoading, (state, { isLoading }) => {
    state.isLoading = isLoading;
  })
  .on(ExcellenceReportsActions.loaded, (state, { items }) => {
    state.items = items;
  })
  .on(ExcellenceReportsActions.setFilter, (state, { name, value }) => {
    state.filter[name] = value;
  })
  .on(ExcellenceReportsActions.loadedUnits, (state, { items }) => {
    state.units = items;
  })
  .on(
    ExcellenceReportsActions.changeSortType,
    (state, { sortType, sortBy }) => {
      state.sortType = sortType;
      sortBy ? (state.sortBy = sortBy) : null;
    }
  )
  .on(ExcellenceReportsActions.initialFilter, (state, items) => {
    const { filters } = items;
    const { units } = items;
    const initialFilter: any = {};

    Object.keys(filters).forEach(key => {
      if (
        (key === 'ownerUnits' && filters[key].length) ||
        (key === 'responsilbeUnits' && filters[key].length)
      ) {
        const initialUnit = units.filter((el: OrganizationUnit) => {
          return filters[key].some((item: number) => item === el.id);
        });
        initialUnit.length
          ? (initialFilter[key] = initialUnit.map(el => {
              return {
                label: <DisplayTransString value={el.name} />,
                value: el.id,
              };
            }))
          : null;
      }
    });
    if (filters.reportId) {
      initialFilter.reportId = filters.reportId;
    }
    if (filters.fileType) {
      initialFilter.fileType = {
        label: <Trans>{filters.fileType}</Trans>,
        value: filters.fileType,
      };
    }

    state.filter = { ...initialFilter };
  })
  .on(ExcellenceReportsActions.clearFilters, state => {
    state.filter = {};
    window.history.replaceState({}, '', '/excellence-reports');
  });

// --- Module ---
export default () => {
  handle();
  return <ExcellenceReportsView />;
};
