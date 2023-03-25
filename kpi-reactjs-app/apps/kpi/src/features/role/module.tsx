import React from 'react';
import * as Rx from 'src/rx';
import * as R from 'remeda';
import { RoleView } from './components/RoleView';
import { RoleActions, RoleState, handle, getRoleState } from './interface';
import { getRouterState, RouterActions } from 'typeless-router';
import { RoleFormActions, useRoleForm, getRoleFormState } from './role-form';
import { catchErrorAndShowModal } from 'src/common/utils';
import { GlobalActions, getGlobalState } from '../global/interface';
import {
  getAllPermissions,
  getRole,
  createRole,
  updateRole,
  deleteRole,
} from 'src/services/API-next';
import { BreadcrumbsActions } from 'src/components/Breadcrumbs';

// --- Epic ---
handle
  .epic()
  .on(RoleActions.$mounted, () => {
    const id = R.last(getRouterState().location!.pathname.split('/'));

    return getAllPermissions()
      .pipe(
        Rx.mergeMap(permissions => {
          if (id === 'new') {
            return [
              RoleFormActions.reset(),
              RoleActions.loaded(permissions, null),
            ];
          } else {
            return getRole(Number(id)).pipe(
              Rx.mergeMap(ret => [
                BreadcrumbsActions.getIupdatetemName({
                  en: ret.name.en,
                  ar: ret.name.ar,
                }),
                RoleFormActions.replace({
                  name_en: ret.name.en,
                  name_ar: ret.name.ar,
                  slug: ret.slug,
                  description: ret.description,
                  permissionMap: R.pipe(
                    ret.rolePermissions,
                    R.map(x => x.permission),
                    R.indexBy(x => x!.name)
                  ),
                }),
                RoleActions.loaded(permissions, ret),
              ])
            );
          }
        })
      )
      .pipe(catchErrorAndShowModal());
  })
  .on(RoleFormActions.setSubmitSucceeded, () => {
    const { role } = getRoleState();
    const { values } = getRoleFormState();
    const mapped = {
      name: {
        ar: values.name_ar,
        en: values.name_en,
      },
      organizationId: getGlobalState().organizationId,
      description: values.description,
      slug: values.slug,
      rolePermissions: Object.values(values.permissionMap).map(item => ({
        permissionId: item!.id,
      })),
    };
    return Rx.concatObs(
      Rx.of(RoleActions.setSaving(true)),
      Rx.defer(() => {
        if (role) {
          return updateRole(role.id, {
            id: role.id,
            ...mapped,
          });
        }
        return createRole(mapped);
      }).pipe(
        Rx.mergeMap(() => {
          return [
            GlobalActions.showNotification(
              'success',
              role ? 'Role updated successfully' : 'Role created successfully'
            ),
            RouterActions.push('/settings/roles'),
          ];
        }),
        catchErrorAndShowModal()
      ),
      Rx.of(RoleActions.setSaving(false))
    );
  })
  .on(RoleActions.remove, () => {
    return Rx.concatObs(
      Rx.of(RoleActions.setDeleting(true)),
      deleteRole(getRoleState().role!.id).pipe(
        Rx.mergeMap(() => {
          return [
            GlobalActions.showNotification(
              'success',
              'Role deleted successfully'
            ),
            RouterActions.push('/settings/roles'),
          ];
        }),
        catchErrorAndShowModal()
      ),
      Rx.of(RoleActions.setDeleting(false))
    );
  });

// --- Reducer ---
const initialState: RoleState = {
  id: '',
  isLoading: true,
  isSaving: false,
  isDeleting: false,
  role: null,
  permissions: [],
};

handle
  .reducer(initialState)
  .replace(RoleActions.$init, () => initialState)
  .on(RoleActions.loaded, (state, { permissions, role }) => {
    state.role = role;
    state.permissions = permissions;
    state.isLoading = false;
  })
  .on(RoleActions.setSaving, (state, { isSaving }) => {
    state.isSaving = isSaving;
  })
  .on(RoleActions.setDeleting, (state, { isDeleting }) => {
    state.isDeleting = isDeleting;
  });

// --- Module ---
export default () => {
  useRoleForm();
  handle();
  return <RoleView />;
};
