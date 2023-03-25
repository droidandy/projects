import React from 'react';
import * as Rx from 'src/rx';
import { OrgUsersView } from './components/OrgUsersView';
import {
  OrgUsersActions,
  OrgUsersState,
  handle,
  getOrgUsersState,
} from './interface';
import { searchOrgUsers, deleteOrgUser } from 'src/services/API-next';
import { mixinList, defaultListInitialState } from 'src/mixins/listMixin-next';
import { catchErrorAndShowModal } from 'src/common/utils';
import { getGlobalState } from '../global/interface';

const initialState: OrgUsersState = {
  ...defaultListInitialState,
  sortBy: 'id',
  filter: {
    name: '',
    email: '',
    unitId: 0,
  },
  appliedFilter: {
    name: '',
    email: '',
    unitId: 0,
  },
};

const { epic } = mixinList({
  handle,
  initialState,
  Actions: OrgUsersActions,
  searchCriteria: {
    name: 'string',
    email: 'string',
    unitId: 'number',
  },
  getState: getOrgUsersState,
  search: criteria => {
    return searchOrgUsers({
      ...criteria,
      orgId: getGlobalState().organizationId,
      unitId: getOrgUsersState().filter.unitId,
    });
  },
  exportItems: () => {
    //
  },
});

epic.on(OrgUsersActions.onDelete, ({ user }) => {
  return Rx.concatObs(
    deleteOrgUser(user.id).pipe(Rx.ignoreElements(), catchErrorAndShowModal()),
    Rx.of(OrgUsersActions.applyFilter())
  );
});

// --- Module ---
export default () => {
  handle();
  return <OrgUsersView />;
};
