import React from 'react';
import * as Rx from 'src/rx';
import { SubmitTaskView } from './components/SubmitTaskView';
import {
  SubmitTaskActions,
  SubmitTaskState,
  handle,
  getSubmitTaskState,
} from './interface';
import {
  useSubmitTaskForm,
  SubmitTaskFormActions,
  getSubmitTaskFormState,
} from './submitTask-form';
import { getRouterState, RouterActions } from 'typeless-router';
import { catchErrorAndShowModal, focusFormErrorEpic } from 'src/common/utils';
import { GlobalActions } from '../global/interface';
import {
  getTask,
  getDataSeriesById,
  getKpi,
  updateDataSeries,
} from 'src/services/API-next';
import { Task, DataSeries, Kpi } from 'src/types-next';

// --- Epic ---
handle
  .epic()
  .on(SubmitTaskActions.$mounted, () => {
    const id = getRouterState()
      .location!.pathname.split('/')
      .reverse()[1];

    let task: Task = null!;
    let dataSeries: DataSeries = null!;
    let kpi: Kpi = null!;

    return getTask(Number(id)).pipe(
      Rx.mergeMap(result => {
        task = result;
        return getDataSeriesById(task.kpiDataSeriesId);
      }),
      Rx.mergeMap(result => {
        dataSeries = result;
        return getKpi(dataSeries.kpiId!);
      }),
      Rx.mergeMap(result => {
        kpi = result;
        return [
          SubmitTaskFormActions.reset(),
          SubmitTaskActions.loaded(task, dataSeries, kpi),
        ];
      }),
      catchErrorAndShowModal()
    );
  })
  .on(SubmitTaskActions.save, (_, { action$ }) => {
    const { dataSeries } = getSubmitTaskState();
    const formValues = getSubmitTaskFormState().values;
    return Rx.concatObs(
      Rx.of(SubmitTaskFormActions.submit()),
      action$.pipe(
        Rx.waitForType(SubmitTaskFormActions.setSubmitSucceeded),
        Rx.mergeMap(() => {
          return Rx.concatObs(
            Rx.of(SubmitTaskActions.setSaving(true)),
            updateDataSeries(dataSeries.id, {
              KPIDataSeries: {
                ...dataSeries!,
                assignedUser: undefined,
                value: Number(formValues.value),
              },
              GetPerformance: true,
            }).pipe(
              Rx.mergeMap(() => {
                return [
                  RouterActions.push(`/my-tasks`),
                  GlobalActions.showNotification(
                    'success',
                    'Saved successfully'
                  ),
                ];
              }),
              catchErrorAndShowModal()
            ),
            Rx.of(SubmitTaskActions.setSaving(false))
          );
        }),
        Rx.takeUntil(
          action$.pipe(Rx.waitForType(SubmitTaskFormActions.setSubmitFailed))
        )
      )
    );
  })
  .on(SubmitTaskFormActions.setSubmitFailed, focusFormErrorEpic);

// --- Reducer ---
const initialState: SubmitTaskState = {
  isLoaded: true,
  isSaving: false,
  task: null!,
  kpi: null!,
  dataSeries: null!,
};

handle
  .reducer(initialState)
  .replace(SubmitTaskActions.$init, () => initialState)
  .on(SubmitTaskActions.loaded, (state, { task, dataSeries, kpi }) => {
    state.task = task;
    state.kpi = kpi;
    state.dataSeries = dataSeries;
    state.isLoaded = false;
  })
  .on(SubmitTaskActions.setSaving, (state, { isSaving }) => {
    state.isSaving = isSaving;
  });

// --- Module ---
export default () => {
  useSubmitTaskForm();
  handle();
  return <SubmitTaskView />;
};
