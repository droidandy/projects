import React from 'react';
import { ColorThemesView } from './components/ColorThemesView';
import {
  ColorThemesActions,
  ColorThemesState,
  handle,
  getColorThemesState,
} from './interface';
import { defaultListInitialState, mixinList } from 'src/mixins/listMixin-next';
import { searchColorThemes, deleteColorTheme } from 'src/services/API';

// --- Reducer ---
const initialState: ColorThemesState = {
  ...defaultListInitialState,
  sortBy: 'id',
  filter: {},
  appliedFilter: {},
};

mixinList({
  handle,
  initialState,
  Actions: ColorThemesActions,
  searchCriteria: {},
  getState: getColorThemesState,
  search: searchColorThemes,
  exportItems: () => {
    //
  },
  deleteItem: deleteColorTheme,
});

// --- Module ---
export default () => {
  handle();
  return <ColorThemesView />;
};
