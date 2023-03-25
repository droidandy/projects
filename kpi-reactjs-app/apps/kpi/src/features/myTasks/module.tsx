import React from 'react';
import { MyTasksView } from './components/MyTasksView';
import {
  MyTasksActions,
  MyTasksState,
  handle,
  getMyTasksState,
} from './interface';
import { defaultListInitialState, mixinList } from 'src/mixins/listMixin-next';
import { searchTask } from 'src/services/API-next';
import { getGlobalState } from '../global/interface';

const initialState: MyTasksState = {
  ...defaultListInitialState,
  sortBy: 'name',
  filter: {},
  appliedFilter: {},
};

mixinList({
  handle,
  initialState,
  Actions: MyTasksActions,
  searchCriteria: {},
  getState: getMyTasksState,
  search: criteria =>
    searchTask({ ...criteria, assignedUserId: getGlobalState().user!.id }),
  exportItems: () => {
    //
  },
});

// --- Module ---
export default () => {
  handle();
  return <MyTasksView />;
};
