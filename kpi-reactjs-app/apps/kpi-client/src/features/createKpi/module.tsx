import React from 'react';
import { CreateKpiView } from './components/CreateKpiView';
import * as Rx from 'src/rx';
import { CreateKpiActions, CreateKpiState, handle } from './interface';
import { useKpiForm, KpiFormActions, getKpiFormState } from './kpi-form';
import { getAllOrganizationUnit, getAllScorecards } from 'shared/API';
import { getGlobalState } from '../global/interface';
import { saveKpi } from 'src/common/kpi';
import { catchErrorAndShowModal } from 'src/common/utils';
import { RouterActions } from 'typeless-router';

// --- Epic ---
handle
  .epic()
  .on(CreateKpiActions.$mounted, () => {
    return [KpiFormActions.reset()];
  })
  .on(CreateKpiActions.$mounted, () => {
    return Rx.mergeObs(
      getAllOrganizationUnit(getGlobalState().user!.orgId).pipe(
        Rx.map(ret => CreateKpiActions.unitsLoaded(ret))
      ),
      getAllScorecards(undefined!).pipe(
        Rx.map(scorecards => CreateKpiActions.scorecardsLoaded(scorecards))
      )
    );
  })
  .on(KpiFormActions.setSubmitSucceeded, () => {
    return Rx.concatObs(
      Rx.of(CreateKpiActions.setSaving(true)),
      saveKpi(getKpiFormState().values, null).pipe(
        Rx.map(kpi =>
          RouterActions.push({
            pathname: '/my-kpis',
            search: `id=${kpi.id}`,
          })
        ),
        catchErrorAndShowModal()
      ),
      Rx.of(CreateKpiActions.setSaving(false))
    );
  });

// --- Reducer ---
const initialState: CreateKpiState = {
  isSaving: false,
  units: null,
  scorecards: null,
};

handle
  .reducer(initialState)
  .on(CreateKpiActions.$init, state => {
    Object.assign(state, initialState);
  })
  .on(CreateKpiActions.setSaving, (state, { isSaving }) => {
    state.isSaving = isSaving;
  })
  .on(CreateKpiActions.unitsLoaded, (state, { units }) => {
    state.units = units;
  })
  .on(CreateKpiActions.scorecardsLoaded, (state, { scorecards }) => {
    state.scorecards = scorecards;
  });

// --- Module ---
export default () => {
  useKpiForm();
  handle();
  return <CreateKpiView />;
};
