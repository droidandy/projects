import React from 'react';
import * as Rx from 'src/rx';
import * as R from 'remeda';
import { OrganizationView } from './components/OrganizationView';
import {
  getOrganizationById,
  createOrganization,
  updateOrganization,
  deleteOrganization,
} from 'src/services/API-next';
import {
  OrganizationActions,
  OrganizationState,
  handle,
  getOrganizationState,
} from './interface';
import {
  useOrganizationForm,
  OrganizationFormActions,
  getOrganizationFormState,
} from './organization-form';
import { getRouterState, RouterActions } from 'typeless-router';
import { catchErrorAndShowModal } from 'src/common/utils';
import { Organization } from 'src/types-next';
import { GlobalActions } from '../global/interface';
import { BreadcrumbsActions } from 'src/components/Breadcrumbs';

// --- Epic ---
handle
  .epic()
  .on(OrganizationActions.$mounted, () => {
    return Rx.concatObs(
      Rx.defer(() => {
        const id = R.last(getRouterState().location!.pathname.split('/'));
        if (id === 'new') {
          return Rx.from([
            OrganizationFormActions.reset(),
            OrganizationActions.loaded(null),
          ]);
        }
        return getOrganizationById(id).pipe(
          Rx.mergeMap(ret => [
            BreadcrumbsActions.update({
              en: ret.name.en,
              ar: ret.name.ar,
            }),
            OrganizationFormActions.replace({
              name_en: ret.name.en,
              name_ar: ret.name.ar,
            }),
            OrganizationActions.loaded(ret),
          ])
        );
      })
    ).pipe(catchErrorAndShowModal());
  })

  .on(OrganizationFormActions.setSubmitSucceeded, () => {
    const { organization } = getOrganizationState();
    const { values } = getOrganizationFormState();
    const mapped: Omit<Organization, 'id'> = {
      name: {
        ar: values.name_ar,
        en: values.name_en,
      },
    };
    return Rx.concatObs(
      Rx.of(OrganizationActions.setSaving(true)),
      Rx.defer(() => {
        if (organization) {
          return updateOrganization(organization.id, {
            id: organization.id,
            ...mapped,
          });
        }
        return createOrganization(mapped);
      }).pipe(
        Rx.mergeMap(() => {
          return [
            GlobalActions.showNotification(
              'success',
              organization
                ? 'Organization updated successfully'
                : 'Organization created successfully'
            ),
            RouterActions.push('/settings/organizations'),
          ];
        }),
        catchErrorAndShowModal()
      ),
      Rx.of(OrganizationActions.setSaving(false))
    );
  })

  .on(OrganizationActions.remove, () => {
    return Rx.concatObs(
      Rx.of(OrganizationActions.setDeleting(true)),
      deleteOrganization(getOrganizationState().organization!.id).pipe(
        Rx.mergeMap(() => {
          return [
            GlobalActions.showNotification(
              'success',
              'Organization deleted successfully'
            ),
            RouterActions.push('/settings/organizations'),
          ];
        }),
        catchErrorAndShowModal()
      ),
      Rx.of(OrganizationActions.setDeleting(false))
    );
  });

// --- Reducer ---
const initialState: OrganizationState = {
  id: '',
  isLoading: true,
  isSaving: false,
  isDeleting: false,
  organization: null,
};

handle
  .reducer(initialState)
  .replace(OrganizationActions.$init, () => initialState)
  .on(OrganizationActions.loaded, (state, { organization }) => {
    state.organization = organization;
    state.isLoading = false;
  })
  .on(OrganizationActions.setSaving, (state, { isSaving }) => {
    state.isSaving = isSaving;
  })
  .on(OrganizationActions.setDeleting, (state, { isDeleting }) => {
    state.isDeleting = isDeleting;
  });

// --- Module ---
export default () => {
  useOrganizationForm();
  handle();
  return <OrganizationView />;
};
