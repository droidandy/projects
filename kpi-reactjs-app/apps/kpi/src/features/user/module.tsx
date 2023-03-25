import React from 'react';
import * as Rx from 'src/rx';
import * as R from 'remeda';
import { UserView } from './components/UserView';
import {
  getUser,
  createUser,
  updateUser,
  deleteUser,
} from 'src/services/API-next';
import { UserActions, UserState, handle, getUserState } from './interface';
import { useUserForm, UserFormActions, getUserFormState } from './user-form';
import { getRouterState, RouterActions } from 'typeless-router';
import { catchErrorAndShowModal } from 'src/common/utils';
import { GlobalActions } from '../global/interface';
import { BreadcrumbsActions } from 'src/components/Breadcrumbs';

// --- Epic ---
handle
  .epic()
  .on(UserActions.$mounted, () => {
    return Rx.defer(() => {
      const id = R.last(getRouterState().location!.pathname.split('/'));
      if (id === 'new') {
        return Rx.from([UserFormActions.reset(), UserActions.loaded(null)]);
      }
      return getUser(Number(id)).pipe(
        Rx.mergeMap(ret => [
          BreadcrumbsActions.update({
            en: ret.name.en,
            ar: ret.name.ar,
          }),
          UserFormActions.replace({
            ...R.pick(ret, ['email', 'username']),
            name_en: ret.name.en,
            name_ar: ret.name.ar,
          }),
          UserActions.loaded(ret),
        ])
      );
    }).pipe(catchErrorAndShowModal());
  })

  .on(UserFormActions.setSubmitSucceeded, () => {
    const { user } = getUserState();
    const { values } = getUserFormState();
    const mapped = {
      ...R.pick(values, ['email', 'username', 'password']),
      name: {
        ar: values.name_ar,
        en: values.name_en,
      },
    };
    return Rx.concatObs(
      Rx.of(UserActions.setSaving(true)),
      Rx.defer(() => {
        if (user) {
          if (values.newPassword) {
            mapped.password = values.newPassword;
          } else {
            delete mapped.password;
          }
          return updateUser(user.id, {
            id: user.id,
            ...mapped,
          });
        }
        return createUser(mapped);
      }).pipe(
        Rx.mergeMap(() => {
          return [
            GlobalActions.showNotification(
              'success',
              user ? 'User updated successfully' : 'User created successfully'
            ),
            RouterActions.push('/settings/users'),
          ];
        }),
        catchErrorAndShowModal()
      ),
      Rx.of(UserActions.setSaving(false))
    );
  })
  .on(UserActions.remove, () => {
    return Rx.concatObs(
      Rx.of(UserActions.setDeleting(true)),
      deleteUser(getUserState().user!.id).pipe(
        Rx.mergeMap(() => {
          return [
            GlobalActions.showNotification(
              'success',
              'User deleted successfully'
            ),
            RouterActions.push('/settings/users'),
          ];
        }),
        catchErrorAndShowModal()
      ),
      Rx.of(UserActions.setDeleting(false))
    );
  });

// --- Reducer ---
const initialState: UserState = {
  id: '',
  isLoading: true,
  isSaving: false,
  isDeleting: false,
  user: null,
};

handle
  .reducer(initialState)
  .replace(UserActions.$init, () => initialState)
  .on(UserActions.loaded, (state, { user }) => {
    state.user = user;
    state.isLoading = false;
  })
  .on(UserActions.setSaving, (state, { isSaving }) => {
    state.isSaving = isSaving;
  })
  .on(UserActions.setDeleting, (state, { isDeleting }) => {
    state.isDeleting = isDeleting;
  });

// --- Module ---
export default () => {
  useUserForm();
  handle();
  return <UserView />;
};
