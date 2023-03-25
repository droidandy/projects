import React from 'react';
import * as Rx from 'src/rx';
import { Reports } from './components/Reports';
import {
  ReportsActions,
  ReportsState,
  handle,
  getReportsState,
} from './interface';
import { searchReports, downloadDocument, API_BASE_URL } from 'shared/API';
import { catchErrorAndShowModal } from 'src/common/utils';
import { GlobalActions } from '../global/interface';

export function _getCriteria() {
  const { filter, pagination } = getReportsState();
  const criteria: any = {
    pageSize: pagination.pageSize,
    pageIndex: pagination.pageIndex,
    sortBy: 'name',
    sortType: 'ASC',
  };

  if (filter.searchText) {
    criteria.searchText = filter.searchText;
  }
  if (filter.type) {
    criteria.type = filter.type.value;
  }

  return criteria;
}

// --- Reducer ---
handle
  .epic()
  .on(ReportsActions.$mounted, () => ReportsActions.search())
  .on(ReportsActions.search, (_, { action$ }) => {
    return Rx.concatObs(
      Rx.of(ReportsActions.setIsLoading(true)),
      searchReports(_getCriteria()).pipe(
        Rx.map((ret: any) => ReportsActions.loaded(ret)),
        catchErrorAndShowModal()
      ),
      Rx.of(ReportsActions.setIsLoading(false))
    ).pipe(Rx.takeUntil(action$.pipe(Rx.ofType(ReportsActions.search))));
  })
  .on(ReportsActions.clearFilter, () => {
    return ReportsActions.search();
  })
  .on(ReportsActions.changePage, () => {
    return ReportsActions.search();
  })
  .on(ReportsActions.downloadDocument, ({ type, lang, id }) => {
    return Rx.concatObs(
      Rx.of(ReportsActions.loadingDocument(true)),
      downloadDocument(type, lang, id).pipe(
        Rx.map((ret: any) =>
          ret.downloadToken
            ? ReportsActions.getDocument(ret.downloadToken)
            : ReportsActions.getDocument(null)
        ),
        catchErrorAndShowModal()
      ),
      Rx.of(ReportsActions.loadingDocument(false))
    );
  })
  .on(ReportsActions.getDocument, (token): any => {
    return token
      ? window.open(`${API_BASE_URL}/api/documents/files?token=${token}`)
      : Rx.of(GlobalActions.showNotification('error', 'Something went wrong'));
  });

const initialState: ReportsState = {
  filter: {
    searchText: '',
    type: [],
  },
  items: [],
  isLoading: false,
  isLoadingDocument: false,
  isFilterExpanded: false,
  sortType: 'ASC',
  sortBy: 'name',
  pagination: {
    pageIndex: 1,
    pageSize: 10,
    totalCount: 1,
  },
};

handle
  .reducer(initialState)
  .on(ReportsActions.$mounted, () => initialState)
  .on(ReportsActions.setIsLoading, (state, { isLoading }) => {
    state.isLoading = isLoading;
  })
  .on(ReportsActions.loaded, (state, { items }) => {
    state.items = items.items;
    state.pagination = items.metadata;
  })
  .on(ReportsActions.setFilter, (state, { name, value }) => {
    if (name === 'searchText') state.filter.searchText = value;
    if (name === 'type') state.filter.type = value;
  })
  .on(ReportsActions.changePage, (state, { pageIndex, pageSize }) => {
    state.pagination.pageIndex = pageIndex;
    if (pageSize) {
      state.pagination.pageSize = pageSize;
    }
  })
  .on(ReportsActions.loadingDocument, (state, { isLoading }) => {
    state.isLoadingDocument = isLoading;
  })
  .on(ReportsActions.clearFilter, state => {
    state.filter = {
      searchText: '',
      type: [],
    };
  })
  .on(ReportsActions.setIsFilterExpanded, (state, { isFilterExpanded }) => {
    state.isFilterExpanded = isFilterExpanded;
  });

// --- Module ---
export default () => {
  handle();
  return <Reports />;
};
