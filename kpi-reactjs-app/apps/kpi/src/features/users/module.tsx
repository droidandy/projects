import React from 'react';
import * as Rx from 'src/rx';
import { UsersView } from './components/UsersView';
import { UsersActions, UsersState, handle, getUsersState } from './interface';
import { searchUsers, deleteUser } from 'src/services/API-next';
import { mixinList, defaultListInitialState } from 'src/mixins/listMixin-next';
import { catchErrorAndShowModal } from 'src/common/utils';

const initialState: UsersState = {
  ...defaultListInitialState,
  sortBy: 'name',
  filter: {
    name: '',
    email: '',
  },
  appliedFilter: {
    name: '',
    email: '',
  },
};

const { epic } = mixinList({
  handle,
  initialState,
  Actions: UsersActions,
  searchCriteria: {
    name: 'string',
    email: 'string',
  },
  getState: getUsersState,
  search: searchUsers,
  exportItems: () => {
    //
  },
});

epic.on(UsersActions.onDelete, ({ user }) => {
  return Rx.concatObs(
    deleteUser(user.id).pipe(Rx.ignoreElements(), catchErrorAndShowModal()),
    Rx.of(UsersActions.applyFilter())
  );
});

// --- Module ---
export default () => {
  handle();
  return <UsersView />;
};
