import React from 'react';
import { ExcellenceCriteriasView } from './components/ExcellenceCriteriasView';
import {
  ExcellenceCriteriasActions,
  ExcellenceCriteriasState,
  handle,
  getExcellenceCriteriasState,
} from './interface';
import { defaultListInitialState, mixinList } from 'src/mixins/listMixin-next';
import {
  searchExcellenceCriteria,
  deleteExcellenceCriteria,
} from 'src/services/API-next';

// --- Reducer ---
const initialState: ExcellenceCriteriasState = {
  ...defaultListInitialState,
  sortBy: 'id',
  filter: {
    name: '',
    parentId: null,
  },
  appliedFilter: {
    name: '',
    parentId: null,
  },
};

mixinList({
  handle,
  initialState,
  Actions: ExcellenceCriteriasActions,
  searchCriteria: {
    name: 'string',
    parentId: 'string' || 'number',
  },
  getState: getExcellenceCriteriasState,
  search: searchExcellenceCriteria,
  exportItems: () => {
    //
  },
  deleteItem: deleteExcellenceCriteria,
});

// --- Module ---
export default () => {
  handle();
  return <ExcellenceCriteriasView />;
};
