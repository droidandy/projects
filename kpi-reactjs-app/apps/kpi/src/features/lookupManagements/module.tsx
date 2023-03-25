import React from 'react';
import { LookupManagementView } from './components/LookupManagementView';
import {
  LookupManagementActions,
  LookupManagementState,
  handle,
  getLookupManagementState,
} from './interface';
import { defaultListInitialState, mixinList } from 'src/mixins/listMixin-next';
import { deleteLookup, searchLookup } from 'src/services/API-next';
// --- Reducer ---
const initialState: LookupManagementState = {
  ...defaultListInitialState,
  sortBy: 'id',
  filter: {
    name: '',
    category: '',
  },
  appliedFilter: {
    name: '',
    category: '',
  },
};
mixinList({
  handle,
  initialState,
  Actions: LookupManagementActions,
  searchCriteria: {
    name: 'string',
    category: 'string',
  },
  getState: getLookupManagementState,
  search: searchLookup,
  exportItems: () => {
    //
  },
  deleteItem: deleteLookup,
});
// --- Module ---
export default () => {
  handle();
  return <LookupManagementView />;
};
