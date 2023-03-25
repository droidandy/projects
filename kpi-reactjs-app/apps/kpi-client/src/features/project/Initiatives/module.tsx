import React from 'react';
import * as Rx from 'src/rx';
import { RouterActions } from 'typeless-router';
import { catchErrorAndShowModal } from 'src/common/utils';
import { getGlobalState } from 'src/features/global/interface';
import { searchOrganizationUnit } from 'shared/API';
import {
  clearStorage,
  login,
  setAccessToken,
  getInitiativeFilters,
  searchInitiative,
} from '../shared/API';
import { ListingProjectView } from './components/ListingProjectView';
import {
  ListingProjectActions,
  ListingProjectState,
  getListingProjectState,
  handle,
} from './interface';

// --- Epic ---
handle
  .epic()
  .on(ListingProjectActions.$mounted, () => {
    clearStorage();
    return login('admin', 'admin').pipe(
      Rx.map( (response) => {
        setAccessToken(response.token);
        return ListingProjectActions.load();
      })
    );
  })
  .on(ListingProjectActions.load, () => {
    const { user } = getGlobalState();
    return Rx.forkJoin(
      getInitiativeFilters(),
      searchOrganizationUnit({
        pageSize: 1e6
      })
    ).pipe(
      Rx.map( ([filters, items]) => {
        return ListingProjectActions.loaded(filters, items);
      })
    );
  })
  .onMany([ListingProjectActions.loaded, ListingProjectActions.clearFilter, ListingProjectActions.changePage, ListingProjectActions.applyFilter], () => {
    return ListingProjectActions.search();
  })
  .on(ListingProjectActions.search, (_, { action$ }) => {
    const { filter, currentPage, pageUnit } = getListingProjectState();
    return Rx.concatObs(
      Rx.of(ListingProjectActions.setIsLoading(true)),
      searchInitiative({
        from: (currentPage - 1) * pageUnit,
        limit: pageUnit,
        unit: filter.unit.value.toString(), 
        type: filter.type.value.toString(), 
        startDate: filter.date[0],
        endDate: filter.date[1],
        color: filter.status.value, 
      }).pipe(
        Rx.map( (response) => {
          return ListingProjectActions.searchResult(response);
        }),
        catchErrorAndShowModal()
      ),
      Rx.of(ListingProjectActions.setIsLoading(false))
    ).pipe(Rx.takeUntil(action$.pipe(Rx.ofType(ListingProjectActions.search))));
  })
  .on(ListingProjectActions.newProject, () => {
    return RouterActions.push(`/projects/new`);
  });

// --- Reducer ---
const initialState: ListingProjectState = {
  isLoading: true,
  projectCnt: 0,
  pageCnt: 1,
  pageUnit: 10,
  currentPage: 1,
  projects: [ ],
  filter: {
    unit: { label: 'All', value: -1 },
    type: { label: 'All', value: -1 },
    date: [ undefined, undefined ],
    status: { label: 'All', value: '*' },
  },
  options: {
    unit: [
      { label: 'All', value: -1 },
    ],
    type: [
      { label: 'All', value: -1 },
    ],
    status: [
      { label: 'All', value: '*' },
    ],
  },
  isFilterExpanded: false,
  units: [],
};

handle
  .reducer(initialState)
  .on(ListingProjectActions.loaded, ( state, { filters, items } ) => {
    state.units = items.items;
    state.options = {
      unit: [
        ...state.options.unit,
        ...items.items.map( (item: any) => { return {label: item.name.ar, value: item.id}}),
      ],
      type: [
        ...state.options.type,
        ...filters.type.map( (item: any) => { return {label: item.label.ar, value: item.value}}),
      ],
      status: [
        ...state.options.status,
        ...filters.status.map( (item: any) => { return {label: item.label, value: item.value}}),
      ],
    }
    const filter = getGlobalState().initiativeSearchFilter;
    if (filter === undefined) {
      state.filter.unit = state.options.unit[0];
      state.filter.type = state.options.type[0];
      state.filter.status = state.options.status[0];
    }
    else {
      state.filter = filter;
      state.filter.date = [ undefined, undefined ];
    }
  })
  .on(ListingProjectActions.setIsLoading, (state, { isLoading }) => {
    state.isLoading = isLoading;
  })
  .on(ListingProjectActions.setIsFilterExpanded, (state, { isFilterExpanded }) => {
    state.isFilterExpanded = isFilterExpanded;
  })
  .on(ListingProjectActions.applyFilter, ( state ) => {
    state.currentPage = 1;
  })
  .on(ListingProjectActions.changeFilter, ( state, { filter } ) => {
    state.filter = filter;
  })
  .on(ListingProjectActions.changePage, ( state, { page } ) => {
    state.currentPage = page;
  })
  .on(ListingProjectActions.searchResult, ( state, { result }) => {
    state.projectCnt = result.cnt;
    state.projects = result.values.map(item => {
      return {
        name: item.name.ar ? item.name.ar : '',
        unit: {
          type: (item.unit.ar ? item.unit.ar : ''),
          username: item.users ? item.users.map( item => { return item.ar ? item.ar : ''}) : [''],
        },
        budget: item.budget,
        startDate: item.startDate ? new Date(item.startDate) : undefined,
        endDate: item.endDate ? new Date(item.endDate) : undefined,
        color: item.color,
        progress: {
          title: item.progress,
          percent: item.progressPercentage,
        }
      }
    });

    if (state.projectCnt % state.pageUnit) {
      state.pageCnt = parseInt((state.projectCnt / state.pageUnit).toString()) + 1;
    }
    else {
      state.pageCnt = state.projectCnt / state.pageUnit;
    }

    if ((state.currentPage - 1) * state.pageUnit > state.projectCnt) {
      state.currentPage = state.pageCnt;
    }
  })
  .on(ListingProjectActions.clearFilter, state => {
    state.filter = {
      unit: { label: 'All', value: -1 },
      type: { label: 'All', value: -1 },
      date: [ undefined, undefined ],
      status: { label: 'All', value: '*' },
    };
  });


// --- Module ---
export default () => {
  handle();
  return <ListingProjectView />;
};
