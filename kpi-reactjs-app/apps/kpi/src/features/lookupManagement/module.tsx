import React from 'react';
import * as Rx from 'src/rx';
import * as R from 'remeda';
import { LookupManagementView } from './components/LookupManagementView';
import { createLookup, getLookup, updateLookup } from 'src/services/API-next';
import {
  LookupManagementActions,
  LookupManagementState,
  getLookupManagementState,
  handle,
} from './interface';
import {
  LookupManagementFormActions,
  getLookupManagementFormState,
  useLookupManagementForm,
} from './lookup-form';
import { getRouterState, RouterActions } from 'typeless-router';
import { Lookup } from 'src/types-next';
import { GlobalActions } from '../global/interface';
import { catchErrorAndShowModal } from '../../common/utils';
import { BreadcrumbsActions } from 'src/components/Breadcrumbs';

// --- Epic ---
handle
  .epic()
  .on(LookupManagementActions.$mounted, () => {
    const id = R.last(getRouterState().location!.pathname.split('/'));
    if (id === 'new') {
      return Rx.from([
        LookupManagementFormActions.reset(),
        LookupManagementActions.loaded(null),
      ]);
    }
    return getLookup(Number(id))
      .pipe(
        Rx.mergeMap(item => [
          BreadcrumbsActions.update({ en: item.en, ar: item.ar }),
          LookupManagementFormActions.replace({
            name_ar: item.en,
            name_en: item.en,
            category: item.category,
            slug: item.slug,
          }),
          LookupManagementActions.loaded(item),
        ])
      )
      .pipe(catchErrorAndShowModal());
  })
  .on(LookupManagementFormActions.setSubmitSucceeded, () => {
    const { lookup } = getLookupManagementState();
    const { values: formValues } = getLookupManagementFormState();
    const mapped: Omit<Lookup, 'id'> = {
      ar: formValues.name_ar,
      en: formValues.name_en,
      category: formValues.category,
      slug: formValues.slug,
    };
    return Rx.concatObs(
      Rx.of(LookupManagementActions.setSaving(true)),
      Rx.defer(() => {
        if (lookup) {
          return updateLookup(lookup.id, {
            id: lookup.id,
            ...mapped,
          });
        }
        return createLookup({ ...mapped });
      }).pipe(
        Rx.mergeMap(() => {
          return [
            GlobalActions.showNotification(
              'success',
              lookup
                ? 'Lookup updated successfully'
                : 'Lookup created successfully'
            ),
            RouterActions.push('/settings/lookup-management'),
          ];
        }),
        catchErrorAndShowModal()
      ),
      Rx.of(LookupManagementActions.setSaving(false))
    );
  });

// --- Reducer ---
const initialState: LookupManagementState = {
  isLoading: true,
  isSaving: false,
  lookup: null,
};

handle
  .reducer(initialState)
  .replace(LookupManagementActions.$init, () => initialState)
  .on(LookupManagementActions.loaded, (state, { lookup }) => {
    state.lookup = lookup;
    state.isLoading = false;
  })
  .on(LookupManagementActions.setSaving, (state, { isSaving }) => {
    state.isSaving = isSaving;
  });

// --- Module ---
export default () => {
  useLookupManagementForm();
  handle();
  return <LookupManagementView />;
};
