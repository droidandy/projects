import * as Rx from 'src/rx';
import * as R from 'remeda';
import { stringify, parse } from 'query-string';
import { catchErrorAndShowModal } from 'src/common/utils';
import { SearchOptions, SelectOption } from 'src/types';
import { PickAndFlatten } from 'src/types-next';
import { SearchResult } from 'src/services/API-next';
import { HandleWithState } from 'typeless';
import { getRouterState, RouterActions } from 'typeless-router';
import { GlobalActions } from 'src/features/global/interface';

export const BaseListActions = {
  $init: () => ({}),
  reset: (options: SearchOptions) => ({ payload: options }),
  $mounted: () => ({}),
  load: () => ({}),
  setIsLoading: (isLoading: boolean) => ({ payload: { isLoading } }),
  loaded: (result: SearchResult<any>) => ({ payload: result }),
  search: (options: SearchOptions) => ({ payload: options }),
  removeItem: (item: any) => ({ payload: { item } }),
  applyFilter: () => ({}),
  clearFilter: () => ({}),
  updateFilter: (key: keyof any, value: any) => ({
    payload: { key, value },
  }),
  toggleFilter: () => ({}),
  onExport: () => ({}),
};

type SearchResultState<T> = Pick<SearchResult<T>, 'items'> &
  PickAndFlatten<SearchResult<string>, 'metadata'>;

export interface ListState<TItem, TFilter> extends SearchResultState<TItem> {
  isLoading: boolean;
  sortType: string;
  sortBy: string;
  isFilterOpened: boolean;
  filter: TFilter;
  appliedFilter: TFilter;
}

export const defaultListInitialState = {
  items: [],
  totalCount: 0,
  pageIndex: 1,
  pageSize: 10,
  isLoading: false,
  sortType: 'ASC',
  isFilterOpened: false,
};

export type ListMixinCriteriaType =
  | 'string'
  | 'list'
  | 'enum'
  | 'bool'
  | 'number';

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
  loadedExternalAction?: (...args: any[]) => any;
  deleteItem?: (id: number) => Rx.Observable<any>;
}

const paginationKeys = ['pageIndex', 'pageSize', 'sortType', 'sortBy'] as [
  'pageIndex',
  'pageSize',
  'sortType',
  'sortBy'
];

function _getSearchCriteria(state: any, searchCriteria: any) {
  const criteria: any = R.pick(state, paginationKeys);
  const search = parse(getRouterState().location!.search);

  if (typeof search.pageIndex === 'string') {
    criteria.pageIndex = Number(search.pageIndex);
  }
  if (typeof search.pageSize === 'string') {
    criteria.pageSize = Number(search.pageSize);
  }
  if (typeof search.sortBy === 'string') {
    criteria.sortBy = search.sortBy;
  }
  if (typeof search.sortType === 'string') {
    criteria.sortType = search.sortType;
  }

  Object.entries(searchCriteria).forEach(([key, type]) => {
    const value = search[key];
    switch (type as ListMixinCriteriaType) {
      case 'string':
        if (typeof value === 'string') {
          criteria[key] = value;
        }
        break;
      case 'number':
        if (typeof value === 'number') {
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
    loadedExternalAction,
    deleteItem,
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
          Rx.flatMap(result => {
            const actions = [Actions.loaded(result)];
            if (loadedExternalAction) {
              actions.push(loadedExternalAction());
            }
            return actions;
          }),
          catchErrorAndShowModal()
        ),
        Rx.of(Actions.setIsLoading(false))
      );
    })
    .on(Actions.$mounted, () => Actions.load())
    .on(RouterActions.locationChange, () => {
      const { location, prevLocation } = getRouterState();
      if (
        !location ||
        !prevLocation ||
        location.pathname === prevLocation.pathname
      ) {
        return Actions.load();
      }
      return Rx.empty();
    })
    .onMany([Actions.search, Actions.applyFilter, Actions.clearFilter], () => {
      const values: any = R.pick(getState(), [
        'pageIndex',
        'pageSize',
        'sortType',
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
          case 'number':
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
      const { items } = getState();
      exportItems(items);

      return Rx.empty();
    })
    .on(Actions.removeItem, ({ item }) => {
      return Rx.concatObs(
        deleteItem!(item.id).pipe(
          Rx.mergeMap(() => {
            return [
              loadedExternalAction && loadedExternalAction(),
              Actions.load(),
              GlobalActions.showNotification('success', 'Deleted successfully'),
            ];
          }),
          catchErrorAndShowModal()
        )
      );
    });

  reducer
    .replace(Actions.reset, (state, options) => {
      const base: any = R.pick(options, paginationKeys as any);
      const filterFields: any = {
        ...initialState.filter,
        ...R.omit(options, paginationKeys as any),
      };

      return {
        ...initialState,
        ...base,
        filter: filterFields,
        appliedFilter: filterFields,
      };
    })
    .on(Actions.loaded, (state, { items, metadata }) => {
      Object.assign(state, { items, ...metadata });
    })
    .on(Actions.setIsLoading, (state, { isLoading }) => {
      state.isLoading = isLoading;
    })
    .on(Actions.search, (state, options) => {
      Object.assign(state, {
        ...options,
        pageIndex: options.pageNumber + 1,
        sortType: options.sortDesc ? 'DESC' : 'ASC',
      });
    })
    .on(Actions.applyFilter, state => {
      state.appliedFilter = state.filter;
      state.pageIndex = 1;
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
