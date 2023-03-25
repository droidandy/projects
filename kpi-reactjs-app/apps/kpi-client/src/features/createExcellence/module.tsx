import React from 'react';
import { CreateExcellenceView } from './components/CreateExcellenceView';
import * as Rx from 'src/rx';
import {
  CreateExcellenceActions,
  CreateExcellenceState,
  handle,
} from './interface';
import {
  ExcellenceFormActions,
  getExcellenceFormState,
  useExcellenceForm,
} from './excellence-form';
import {
  getAllOrganizationUnit,
  createExcellenceRequirement,
  searchExcellenceCriteria,
  getAllExcellenceTheme,
} from 'shared/API';
import { getGlobalState } from '../global/interface';
import { RouterActions } from 'typeless-router';
import { catchErrorAndShowModal } from 'src/common/utils';

// --- Epic ---
handle
  .epic()
  .on(CreateExcellenceActions.$mounted, () => {
    return [ExcellenceFormActions.reset()];
  })
  .on(CreateExcellenceActions.$mounted, () => {
    return Rx.mergeObs(
      getAllOrganizationUnit(getGlobalState().user!.orgId).pipe(
        Rx.map(ret => CreateExcellenceActions.unitsLoaded(ret))
      ),
      getAllExcellenceTheme().pipe(
        Rx.map(themes => CreateExcellenceActions.themesLoaded(themes))
      ),
      searchExcellenceCriteria({
        pageSize: 1e5,
        hasParent: true,
      }).pipe(Rx.map(x => CreateExcellenceActions.criteriasLoaded(x.items)))
    );
  })
  .on(ExcellenceFormActions.setSubmitSucceeded, () => {
    const { values: formValues } = getExcellenceFormState();

    const basicInfo = {
      name: {
        en: formValues.name_en,
        ar: formValues.name_ar,
      },
      description: {
        en: formValues.description_en,
        ar: formValues.description_ar,
      },
      status: 'Active',
      isCompleted: formValues.isCompleted.value,
      requirementStatus: formValues.requirementStatus.value,
      startDate: formValues.startDate,
      endDate: formValues.endDate,
      responsibleUnitId: formValues.responsibleUnit.value,
      ownerUnitId: formValues.ownerUnit.value,
      isEnabled: formValues.isActive.value,
      excellenceCriteriaId: formValues.criteria.value,
      excellenceThemeId: formValues.theme.value,
    } as const;

    return Rx.concatObs(
      Rx.of(CreateExcellenceActions.setSaving(true)),
      createExcellenceRequirement(basicInfo).pipe(
        Rx.map(item =>
          RouterActions.push({
            pathname: '/excellence',
          })
        ),
        catchErrorAndShowModal()
      ),
      Rx.of(CreateExcellenceActions.setSaving(false))
    );
  });

// --- Reducer ---
const initialState: CreateExcellenceState = {
  isSaving: false,
  units: null,
  criteria: null,
  themes: null,
};

handle
  .reducer(initialState)
  .on(CreateExcellenceActions.$init, state => {
    Object.assign(state, initialState);
  })
  .on(CreateExcellenceActions.setSaving, (state, { isSaving }) => {
    state.isSaving = isSaving;
  })
  .on(CreateExcellenceActions.unitsLoaded, (state, { units }) => {
    state.units = units;
  })
  .on(CreateExcellenceActions.criteriasLoaded, (state, { criteria }) => {
    state.criteria = criteria;
  })
  .on(CreateExcellenceActions.themesLoaded, (state, { themes }) => {
    state.themes = themes;
  });

// --- Module ---
export default () => {
  useExcellenceForm();
  handle();
  return <CreateExcellenceView />;
};
