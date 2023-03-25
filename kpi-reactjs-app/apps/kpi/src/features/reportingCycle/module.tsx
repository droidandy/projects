import React from 'react';
import * as Rx from 'src/rx';
import * as R from 'remeda';
import { ReportingCycleView } from './components/ReportingCycleView';
import {
  ReportingCycleActions,
  ReportingCycleState,
  handle,
  getReportingCycleState,
} from './interface';
import {
  useReportingCycleForm,
  getReportingCycleFormState,
  ReportingCycleFormActions,
} from './reportingCycle-form';
import { catchErrorAndShowModal } from 'src/common/utils';
import { getRouterState } from 'typeless-router';
import { getReportingCycle, submitReportingCycle } from 'src/services/API-next';
import { UnreachableCaseError } from 'src/common/helper';
import { GlobalActions } from '../global/interface';

// --- Epic ---
handle
  .epic()
  .on(ReportingCycleActions.$mounted, () => {
    const id = Number(R.last(getRouterState().location!.pathname.split('/')));

    return getReportingCycle(id).pipe(
      Rx.map(reportingCycle => ReportingCycleActions.loaded(reportingCycle)),
      catchErrorAndShowModal()
    );
  })
  .on(ReportingCycleActions.save, () => ReportingCycleFormActions.submit())
  .on(ReportingCycleFormActions.setSubmitSucceeded, () => {
    const { saveType, reportingCycle } = getReportingCycleState();
    if (!saveType) {
      return Rx.empty();
    }
    const { values } = getReportingCycleFormState();
    return Rx.concatObs(
      Rx.of(ReportingCycleActions.setSaving(true)),
      Rx.defer(() => {
        switch (saveType) {
          case 'hold':
            return submitReportingCycle(reportingCycle.id, {
              action: 'Hold',
              holdDate: values.date,
              // unitReportType: 'Excellence',
              comment: {
                text: values.notes,
              },
            }).pipe(
              Rx.map(() =>
                GlobalActions.showNotification(
                  'success',
                  'Put on hold successfully'
                )
              )
            );
          case 'submit':
            return submitReportingCycle(reportingCycle.id, {
              action: 'Submit',
              // unitReportType: 'Excellence',
              comment: {
                text: values.notes,
              },
            }).pipe(
              Rx.mergeMap(() => [
                ReportingCycleActions.setSubmitted(),
                GlobalActions.showNotification(
                  'success',
                  'Submitted successfully'
                ),
              ])
            );
          default:
            throw new UnreachableCaseError(saveType);
        }
      }).pipe(catchErrorAndShowModal()),
      Rx.of(ReportingCycleActions.setSaving(false))
    );
  });

// --- Reducer ---
const initialState: ReportingCycleState = {
  isLoaded: false,
  isSaving: false,
  reportingCycle: null!,
  saveType: null,
  isSubmitted: false,
};

handle
  .reducer(initialState)
  .replace(ReportingCycleActions.$init, () => initialState)
  .on(ReportingCycleActions.loaded, (state, { reportingCycle }) => {
    state.reportingCycle = reportingCycle;
    state.isLoaded = true;
  })
  .on(ReportingCycleActions.setSaving, (state, { isSaving }) => {
    state.isSaving = isSaving;
  })
  .on(ReportingCycleActions.setSubmitted, state => {
    state.isSubmitted = true;
  })
  .on(ReportingCycleActions.save, (state, { saveType }) => {
    state.saveType = saveType;
  });

// --- Module ---
export default () => {
  useReportingCycleForm();
  handle();
  return <ReportingCycleView />;
};
