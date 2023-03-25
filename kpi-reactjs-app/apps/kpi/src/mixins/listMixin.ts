import * as Rx from 'src/rx';
import * as R from 'remeda';
import { stringify, parse } from 'query-string';
import { catchErrorAndShowModal } from 'src/common/utils';
import { SearchOptions, SearchResult, SelectOption } from 'src/types';
import { HandleWithState } from 'typeless';
import { getRouterState, RouterActions } from 'typeless-router';

export const BaseListActions = {
  $init: () => ({}),
  reset: (options: SearchOptions) => ({ payload: options }),
  $mounted: () => ({}),
  load: () => ({}),
  setIsLoading: (isLoading: boolean) => ({ payload: { isLoading } }),
  loaded: (result: SearchResult<any>) => ({ payload: result }),
  search: (options: SearchOptions) => ({ payload: options }),
  applyFilter: () => ({}),
  clearFilter: () => ({}),
  updateFilter: (key: keyof any, value: any) => ({
    payload: { key, value },
  }),
  toggleFilter: () => ({}),
  onExport: () => ({}),
};

export interface ListState<TItem, TFilter> extends SearchResult<TItem> {
  isLoading: boolean;
  sortDesc: boolean;
  sortBy: string;
  isFilterOpened: boolean;
  filter: TFilter;
  appliedFilter: TFilter;
}

export const defaultListInitialState = {
  items: [],
  total: 0,
  pageNumber: 0,
  pageSize: 10,
  isLoading: false,
  sortDesc: false,
  isFilterOpened: false,
};

export type ListMixinCriteriaType = 'string' | 'list' | 'enum' | 'bool';

export type ListMixinCriteria = {
  [x: string]: ListMixinCriteriaType;
};

interface MixinOptions<S extends ListState<any, TItem>, A, TItem> {
  handle: HandleWithState<S>;
  Actions: A;
  searchCriteria: ListMixinCriteria;
  getState: () => S;
  search: (criteria: any) => Rx.Observable<SearchResult<any>>;
  exportItems: (criteria: any) => void;
  initialState: S;
}

const paginationKeys = ['pageNumber', 'pageSize', 'sortDesc', 'sortBy'] as [
  'pageNumber',
  'pageSize',
  'sortDesc',
  'sortBy'
];

function _getSearchCriteria(state: any, searchCriteria: any) {
  const criteria: any = R.pick(state, paginationKeys);
  const search = parse(getRouterState().location!.search);
  if (typeof search.pageNumber === 'string') {
    criteria.pageNumber = Number(search.pageNumber);
  }
  if (typeof search.pageSize === 'string') {
    criteria.pageSize = Number(search.pageSize);
  }
  if (typeof search.sortBy === 'string') {
    criteria.sortBy = search.sortBy;
  }
  if (typeof search.sortDesc === 'string') {
    criteria.sortDesc = search.sortDesc === 'true';
  }

  Object.entries(searchCriteria).forEach(([key, type]) => {
    const value = search[key];
    switch (type) {
      case 'string':
        if (typeof value === 'string') {
          criteria[key] = value;
        }
        break;
      case 'enum':
        if (typeof value === 'string') {
          criteria[key] = value;
        }
        break;
      case 'list':
        if (typeof value === 'string' && value) {
          criteria[key] = value.split(',');
        }
        break;
      case 'bool':
        if (typeof value === 'string') {
          criteria[key] = value === 'true';
        }
        break;
    }
  });
  return criteria;
}

export const mixinList = <
  S extends ListState<any, any>,
  A extends typeof BaseListActions,
  Q
>(
  mixinOptions: MixinOptions<S, A, Q>
) => {
  const {
    handle,
    initialState,
    Actions,
    searchCriteria,
    getState,
    search,
    exportItems,
  } = mixinOptions;

  const getSearchCriteria = () =>
    _getSearchCriteria(getState(), searchCriteria);

  const epic = handle.epic();
  const reducer = handle.reducer(initialState);

  epic
    .on(Actions.$init, () => Actions.reset(getSearchCriteria()))
    .on(Actions.load, () => {
      return Rx.concatObs(
        Rx.of(Actions.setIsLoading(true)),
        search(getSearchCriteria()).pipe(
          Rx.map(result => Actions.loaded(result)),
          catchErrorAndShowModal()
        ),
        Rx.of(Actions.setIsLoading(false))
      );
    })
    .on(Actions.$mounted, () => Actions.load())
    .on(RouterActions.locationChange, () => Actions.load())
    .onMany([Actions.search, Actions.applyFilter, Actions.clearFilter], () => {
      const values: any = R.pick(getState(), [
        'pageNumber',
        'pageSize',
        'sortDesc',
        'sortBy',
      ]);
      const { appliedFilter } = getState();
      Object.entries(searchCriteria).forEach(([key, type]) => {
        const value = appliedFilter[key];
        switch (type) {
          case 'string':
            if (value) {
              values[key] = value;
            }
            break;
          case 'enum':
            if (value) {
              values[key] =
                typeof value === 'object'
                  ? (value as SelectOption).value
                  : value;
            }
            break;
          case 'list':
            if (value.length) {
              values[key] = value.map((x: SelectOption) => x.value).join(',');
            }
            break;
          case 'bool':
            if (value != null) {
              values[key] =
                typeof value === 'object'
                  ? (value as SelectOption).value
                  : value;
            }
            break;
        }
      });
      const searchQuery = stringify(values);
      return RouterActions.push({
        pathname: getRouterState().location!.pathname,
        search: searchQuery,
      });
    })
    .on(Actions.onExport, () => {
      exportItems(getSearchCriteria());
      return Rx.empty();
    });

  reducer
    .replace(Actions.reset, (state, options) => {
      const base: any = R.pick(options, paginationKeys);
      const filterFields: any = R.omit(options, paginationKeys);

      return {
        ...initialState,
        ...base,
        filter: filterFields,
        appliedFilter: filterFields,
      };
    })
    .on(Actions.loaded, (state, data) => {
      Object.assign(state, data);
    })
    .on(Actions.setIsLoading, (state, { isLoading }) => {
      state.isLoading = isLoading;
    })
    .on(Actions.search, (state, options) => {
      Object.assign(state, options);
    })
    .on(Actions.applyFilter, state => {
      state.appliedFilter = state.filter;
      state.pageNumber = 0;
    })
    .on(Actions.clearFilter, state => {
      state.appliedFilter = initialState.filter;
      state.filter = initialState.filter;
      state.isFilterOpened = false;
    })
    .on(Actions.updateFilter, (state, { key, value }) => {
      state.filter[key] = value;
    })
    .on(Actions.toggleFilter, state => {
      state.isFilterOpened = !state.isFilterOpened;
    })
    .on(Actions.setIsLoading, (state, { isLoading }) => {
      state.isLoading = isLoading;
    });

  return { epic, reducer };
};
