import React from 'react';
import * as Rx from 'src/rx';
import { RolesView } from './components/RolesView';
import { RolesActions, RolesState, handle, getRolesState } from './interface';
import { searchRoles, deleteRole } from 'src/services/API-next';
import { defaultListInitialState, mixinList } from 'src/mixins/listMixin-next';
import { catchErrorAndShowModal } from 'src/common/utils';

const initialState: RolesState = {
  ...defaultListInitialState,
  sortBy: 'name',
  filter: {
    name: '',
    roles: [],
  },
  appliedFilter: {
    name: '',
    roles: [],
  },
};

const { epic } = mixinList({
  handle,
  initialState,
  Actions: RolesActions,
  searchCriteria: {
    name: 'string',
    roles: 'list',
  },
  getState: getRolesState,
  search: searchRoles,
  exportItems: () => {
    //
  },
});

epic.on(RolesActions.onDelete, ({ role }) => {
  return Rx.concatObs(
    deleteRole(role.id).pipe(Rx.ignoreElements(), catchErrorAndShowModal()),
    Rx.of(RolesActions.applyFilter())
  );
});
// --- Module ---
export default () => {
  handle();
  return <RolesView />;
};
