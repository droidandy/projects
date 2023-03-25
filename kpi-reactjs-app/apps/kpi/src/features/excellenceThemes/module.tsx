import React from 'react';
import { ExcellenceThemesView } from './components/ExcellenceThemesView';
import {
  ExcellenceThemesActions,
  ExcellenceThemesState,
  handle,
  getExcellenceThemesState,
} from './interface';
import { defaultListInitialState, mixinList } from 'src/mixins/listMixin-next';
import {
  searchExcellenceTheme,
  deleteExcellenceTheme,
} from 'src/services/API-next';

// --- Reducer ---
const initialState: ExcellenceThemesState = {
  ...defaultListInitialState,
  sortBy: 'id',
  filter: {
    name: '',
  },
  appliedFilter: {
    name: '',
  },
};

mixinList({
  handle,
  initialState,
  Actions: ExcellenceThemesActions,
  searchCriteria: {
    name: 'string',
  },
  getState: getExcellenceThemesState,
  search: searchExcellenceTheme,
  exportItems: () => {
    //
  },
  deleteItem: deleteExcellenceTheme,
});

// --- Module ---
export default () => {
  handle();
  return <ExcellenceThemesView />;
};
