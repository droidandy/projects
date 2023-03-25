import React from 'react';
import * as Rx from 'src/rx';
import * as R from 'remeda';
import { ExcellenceThemeView } from './components/ExcellenceThemeView';
import {
  getExcellenceTheme,
  createExcellenceTheme,
  updateExcellenceTheme,
} from 'src/services/API-next';
import {
  ExcellenceThemeActions,
  ExcellenceThemeState,
  handle,
  getExcellenceThemeState,
} from './interface';
import {
  useExcellenceThemeForm,
  ExcellenceThemeFormActions,
  getExcellenceThemeFormState,
} from './excellenceTheme-form';
import { getRouterState, RouterActions } from 'typeless-router';
import { catchErrorAndShowModal } from 'src/common/utils';
import { ExcellenceTheme } from 'src/types-next';
import { GlobalActions } from '../global/interface';
import { BreadcrumbsActions } from 'src/components/Breadcrumbs';

// --- Epic ---
handle
  .epic()
  .on(ExcellenceThemeActions.$mounted, () => {
    const id = R.last(getRouterState().location!.pathname.split('/'));
    if (id === 'new') {
      return Rx.from([
        ExcellenceThemeFormActions.reset(),
        ExcellenceThemeActions.loaded(null),
      ]);
    }
    return getExcellenceTheme(Number(id)).pipe(
      Rx.mergeMap(ret => [
        BreadcrumbsActions.update({
          en: ret.name.en,
          ar: ret.name.ar,
        }),
        ExcellenceThemeFormActions.replace({
          name_ar: ret.name.ar,
          name_en: ret.name.en,
          description_ar: ret.description.ar,
          description_en: ret.description.en,
        }),
        ExcellenceThemeActions.loaded(ret),
      ]),
      catchErrorAndShowModal()
    );
  })

  .on(ExcellenceThemeFormActions.setSubmitSucceeded, () => {
    const { excellenceTheme } = getExcellenceThemeState();
    const { values } = getExcellenceThemeFormState();
    const mapped: Omit<ExcellenceTheme, 'id'> = {
      name: {
        ar: values.name_ar,
        en: values.name_en,
      },
      description: {
        ar: values.description_ar,
        en: values.description_en,
      },
    };
    return Rx.concatObs(
      Rx.of(ExcellenceThemeActions.setSaving(true)),
      Rx.defer(() => {
        if (excellenceTheme) {
          return updateExcellenceTheme(excellenceTheme.id, {
            id: excellenceTheme.id,
            ...mapped,
          });
        }
        return createExcellenceTheme(mapped);
      }).pipe(
        Rx.mergeMap(() => {
          return [
            GlobalActions.showNotification(
              'success',
              excellenceTheme
                ? 'Excellence Theme updated successfully'
                : 'Excellence Theme created successfully'
            ),
            RouterActions.push('/settings/excellence-themes'),
          ];
        }),
        catchErrorAndShowModal()
      ),
      Rx.of(ExcellenceThemeActions.setSaving(false))
    );
  });

// --- Reducer ---
const initialState: ExcellenceThemeState = {
  id: 0,
  isLoading: true,
  isSaving: false,
  excellenceTheme: null,
};

handle
  .reducer(initialState)
  .replace(ExcellenceThemeActions.$init, () => initialState)
  .on(ExcellenceThemeActions.loaded, (state, { excellenceTheme }) => {
    state.excellenceTheme = excellenceTheme;
    state.isLoading = false;
  })
  .on(ExcellenceThemeActions.setSaving, (state, { isSaving }) => {
    state.isSaving = isSaving;
  });

// --- Module ---
export default () => {
  useExcellenceThemeForm();
  handle();
  return <ExcellenceThemeView />;
};
