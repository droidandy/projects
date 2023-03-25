import React from 'react';
import { UnitReportsView } from './components/UnitReportsView';
import {
  UnitReportsActions,
  UnitReportsState,
  handle,
  getUnitReportsState,
} from './interface';
import { defaultListInitialState, mixinList } from 'src/mixins/listMixin-next';
import { searchUnitReport } from 'src/services/API-next';
import { getGlobalState } from '../global/interface';

// --- Epic ---
handle.epic();

// --- Reducer ---
const initialState: UnitReportsState = {
  ...defaultListInitialState,
  sortBy: 'id',
  filter: {},
  appliedFilter: {},
};

mixinList({
  handle,
  initialState,
  Actions: UnitReportsActions,
  searchCriteria: {},
  getState: getUnitReportsState,
  search: criteria =>
    searchUnitReport({ ...criteria, unitId: getGlobalState().currentUnitId }),
  exportItems: () => {
    //
  },
});

// --- Module ---
export default () => {
  handle();
  return <UnitReportsView />;
};
