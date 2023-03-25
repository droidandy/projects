import React from 'react';
import * as Rx from 'src/rx';
import * as R from 'remeda';
import { OrgUserView } from './components/OrgUserView';
import {
  getOrgUser,
  createOrgUser,
  updateOrgUser,
  deleteOrgUser,
  searchRoles,
} from 'src/services/API-next';
import {
  OrgUserActions,
  OrgUserState,
  handle,
  getOrgUserState,
} from './interface';
import {
  useOrgUserForm,
  OrgUserFormActions,
  getOrgUserFormState,
} from './orgUser-form';
import { getRouterState, RouterActions } from 'typeless-router';
import { catchErrorAndShowModal, convertToOption } from 'src/common/utils';
import { GlobalActions, getGlobalState } from '../global/interface';
import { BreadcrumbsActions } from 'src/components/Breadcrumbs';

// --- Epic ---
handle
  .epic()
  .on(OrgUserActions.$mounted, () => {
    const { organizationUnits, organizationId } = getGlobalState();
    return searchRoles({
      pageSize: 10000,
      organizationId,
    }).pipe(
      Rx.mergeMap(({ items: roles }) => {
        const id = R.last(getRouterState().location!.pathname.split('/'));
        if (id === 'new') {
          return Rx.from([
            OrgUserFormActions.reset(),
            OrgUserActions.loaded(roles, null),
          ]);
        }
        return getOrgUser(Number(id)).pipe(
          Rx.mergeMap(ret => [
            BreadcrumbsActions.update({
              en: ret.user.name.en,
              ar: ret.user.name.ar,
            }),
            OrgUserFormActions.replace({
              user: convertToOption(ret.user)!,
              unit: convertToOption(
                organizationUnits!.find(x => x.id === ret.unitId)!
              )!,
              rolesMap: ret.orgUserRoles.reduce((map, orgRole) => {
                map[orgRole.roleId] = orgRole.roleId;
                return map;
              }, {} as { [x: number]: number }),
            }),
            OrgUserActions.loaded(roles, ret),
          ])
        );
      }),
      catchErrorAndShowModal()
    );
  })

  .on(OrgUserFormActions.setSubmitSucceeded, () => {
    const { orgUser } = getOrgUserState();
    const { values } = getOrgUserFormState();
    const mapped = {
      orgId: getGlobalState().organizationId,
      unitId: values.unit.value,
      userId: values.user.value,
      orgUserRoles: Object.values(values.rolesMap).map(id => ({
        roleId: id,
      })),
    };
    return Rx.concatObs(
      Rx.of(OrgUserActions.setSaving(true)),
      Rx.defer(() => {
        if (orgUser) {
          return updateOrgUser(orgUser.id, {
            id: orgUser.id,
            ...mapped,
          });
        }
        return createOrgUser(mapped);
      }).pipe(
        Rx.mergeMap(() => {
          return [
            GlobalActions.showNotification(
              'success',
              orgUser
                ? 'Org User updated successfully'
                : 'Org User created successfully'
            ),
            RouterActions.push('/settings/org-users'),
          ];
        }),
        catchErrorAndShowModal()
      ),
      Rx.of(OrgUserActions.setSaving(false))
    );
  })
  .on(OrgUserActions.remove, () => {
    return Rx.concatObs(
      Rx.of(OrgUserActions.setDeleting(true)),
      deleteOrgUser(getOrgUserState().orgUser!.id).pipe(
        Rx.mergeMap(() => {
          return [
            GlobalActions.showNotification(
              'success',
              'OrgUser deleted successfully'
            ),
            RouterActions.push('/settings/org-users'),
          ];
        }),
        catchErrorAndShowModal()
      ),
      Rx.of(OrgUserActions.setDeleting(false))
    );
  });

// --- Reducer ---
const initialState: OrgUserState = {
  id: '',
  isLoading: true,
  isSaving: false,
  isDeleting: false,
  orgUser: null,
  roles: [],
};

handle
  .reducer(initialState)
  .replace(OrgUserActions.$init, () => initialState)
  .on(OrgUserActions.loaded, (state, { orgUser, roles }) => {
    state.orgUser = orgUser;
    state.roles = roles;
    state.isLoading = false;
  })
  .on(OrgUserActions.setSaving, (state, { isSaving }) => {
    state.isSaving = isSaving;
  })
  .on(OrgUserActions.setDeleting, (state, { isDeleting }) => {
    state.isDeleting = isDeleting;
  });

// --- Module ---
export default () => {
  useOrgUserForm();
  handle();
  return <OrgUserView />;
};
