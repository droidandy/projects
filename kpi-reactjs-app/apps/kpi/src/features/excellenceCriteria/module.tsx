import React from 'react';
import * as Rx from 'src/rx';
import * as R from 'remeda';
import { ExcellenceCriteriaView } from './components/ExcellenceCriteriaView';
import {
  createExcellenceCriteria,
  getExcellenceCriteria,
  searchExcellenceCriteria,
  updateExcellenceCriteria,
} from 'src/services/API-next';
import {
  ExcellenceCriteriaActions,
  ExcellenceCriteriaState,
  getExcellenceCriteriaState,
  handle,
} from './interface';
import {
  ExcellenceCriteriaFormActions,
  getExcellenceCriteriaFormState,
  useExcellenceCriteriaForm,
} from './excellenceCriteria-form';
import { getRouterState, RouterActions } from 'typeless-router';
import { ExcellenceCriteria } from 'src/types-next';
import { GlobalActions } from '../global/interface';
import { convertToOption } from '../../common/utils';
import { BreadcrumbsActions } from 'src/components/Breadcrumbs';

// --- Epic ---
handle
  .epic()
  .on(ExcellenceCriteriaActions.$mounted, () => {
    const id = R.last(getRouterState().location!.pathname.split('/'));
    return searchExcellenceCriteria({
      pageSize: 1e5,
      hasParent: false,
    })
      .pipe(Rx.map(x => x.items))
      .pipe(
        Rx.mergeMap(excellenceCriterias => {
          if (id === 'new') {
            return [
              ExcellenceCriteriaFormActions.reset(),
              ExcellenceCriteriaActions.loaded(excellenceCriterias, null),
            ];
          } else {
            return getExcellenceCriteria(Number(id)).pipe(
              Rx.mergeMap(ret => {
                return [
                  BreadcrumbsActions.update({
                    en: ret.name.en,
                    ar: ret.name.ar,
                  }),
                  ExcellenceCriteriaFormActions.replace({
                    name_ar: ret.name.ar,
                    name_en: ret.name.en,
                    parentId: ret.parentCriteria
                      ? convertToOption(ret.parentCriteria)
                      : null,
                  }),
                  ExcellenceCriteriaActions.loaded(excellenceCriterias, ret),
                ];
              })
            );
          }
        })
      );
  })

  .on(ExcellenceCriteriaFormActions.setSubmitSucceeded, () => {
    const { excellenceCriteria } = getExcellenceCriteriaState();
    const { values } = getExcellenceCriteriaFormState();
    const mapped: Omit<ExcellenceCriteria, 'id'> = {
      name: {
        ar: values.name_ar,
        en: values.name_en,
      },
      parentId: values.parentId ? values.parentId.value : null,
    };
    return Rx.concatObs(
      Rx.of(ExcellenceCriteriaActions.setSaving(true)),
      Rx.defer(() => {
        if (excellenceCriteria) {
          return updateExcellenceCriteria(excellenceCriteria.id, {
            id: excellenceCriteria.id,
            ...mapped,
          });
        }
        return createExcellenceCriteria(mapped);
      }).pipe(
        Rx.mergeMap(() => {
          return [
            GlobalActions.showNotification(
              'success',
              excellenceCriteria
                ? 'Excellence Criteria updated successfully'
                : 'Excellence Criteria created successfully'
            ),
            RouterActions.push('/settings/excellence-criterias'),
          ];
        })
      ),
      Rx.of(ExcellenceCriteriaActions.setSaving(false))
    );
  });

// --- Reducer ---
const initialState: ExcellenceCriteriaState = {
  id: 0,
  isLoading: true,
  isSaving: false,
  excellenceCriteria: null,
  excellenceCriterias: null,
};

handle
  .reducer(initialState)
  .replace(ExcellenceCriteriaActions.$init, () => initialState)
  .on(
    ExcellenceCriteriaActions.loaded,
    (state, { criterias, excellenceCriteria }) => {
      state.excellenceCriterias = criterias;
      state.excellenceCriteria = excellenceCriteria;
      state.isLoading = false;
    }
  )
  .on(ExcellenceCriteriaActions.setSaving, (state, { isSaving }) => {
    state.isSaving = isSaving;
  });

// --- Module ---
export default () => {
  useExcellenceCriteriaForm();
  handle();
  return <ExcellenceCriteriaView />;
};
