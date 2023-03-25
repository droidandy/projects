import React from 'react';
import { ReportsPage } from './components/ReportsPage';
import {
  ReportsPageActions,
  ReportsPageState,
  handle,
  getReportsPageState,
} from './interface';
import { defaultListInitialState, mixinList } from 'src/mixins/listMixin-next';
import { searchLookup } from 'src/services/API-next';

// --- Reducer ---
const initialState: ReportsPageState = {
  ...defaultListInitialState,
  sortBy: 'id',
  filter: {},
  appliedFilter: {},
};
mixinList({
  handle,
  initialState,
  Actions: ReportsPageActions,
  searchCriteria: {},
  getState: getReportsPageState,
  search: searchLookup,
  exportItems: () => {},
  deleteItem: () => {},
});
// --- Module ---
export default () => {
  handle();
  return <ReportsPage />;
};
