import React from 'react';
import * as Rx from 'src/rx';
import * as R from 'remeda';
import { TaskView } from './components/TaskView';
import { TaskActions, TaskState, handle, getTaskState } from './interface';
import { useTaskForm, TaskFormActions, getTaskFormState } from './task-form';
import { getRouterState, RouterActions } from 'typeless-router';
import { catchErrorAndShowModal, focusFormErrorEpic } from 'src/common/utils';
import { GlobalActions } from '../global/interface';
import {
  getTask,
  cancelReportingCycle,
  startReportingCycle,
} from 'src/services/API-next';

// --- Epic ---
handle
  .epic()
  .on(TaskActions.$mounted, () => {
    const id = R.last(getRouterState().location!.pathname.split('/'));

    return getTask(Number(id)).pipe(
      Rx.mergeMap(task => [TaskFormActions.reset(), TaskActions.loaded(task)]),
      catchErrorAndShowModal()
    );
  })
  .on(TaskActions.save, (_, { action$ }) => {
    const { task, saveType } = getTaskState();
    const formValues = getTaskFormState().values;
    return Rx.concatObs(
      Rx.of(TaskFormActions.submit()),
      action$.pipe(
        Rx.waitForType(TaskFormActions.setSubmitSucceeded),
        Rx.mergeMap(() => {
          return Rx.concatObs(
            Rx.of(TaskActions.setSaving(true)),
            Rx.defer(() => {
              if (saveType === 'save') {
                return startReportingCycle(task!.reportingCycleId, {
                  startDate: formValues.startDate,
                  endDate: formValues.endDate,
                });
              } else {
                return cancelReportingCycle(task!.reportingCycleId, {
                  comment: formValues.comment,
                });
              }
            }).pipe(
              Rx.mergeMap(() => {
                return [
                  RouterActions.push(`/my-tasks`),
                  GlobalActions.showNotification(
                    'success',
                    saveType === 'save'
                      ? 'Saved successfully'
                      : 'Cancelled successfully'
                  ),
                ];
              }),
              catchErrorAndShowModal()
            ),
            Rx.of(TaskActions.setSaving(false))
          );
        }),
        Rx.takeUntil(
          action$.pipe(Rx.waitForType(TaskFormActions.setSubmitFailed))
        )
      )
    );
  })
  .on(TaskFormActions.setSubmitFailed, focusFormErrorEpic);

// --- Reducer ---
const initialState: TaskState = {
  isLoaded: true,
  isSaving: false,
  task: null,
  saveType: null,
};

handle
  .reducer(initialState)
  .replace(TaskActions.$init, () => initialState)
  .on(TaskActions.loaded, (state, { task }) => {
    state.task = task;
    state.isLoaded = false;
  })
  .on(TaskActions.setSaving, (state, { isSaving }) => {
    state.isSaving = isSaving;
  })
  .on(TaskActions.save, (state, { saveType }) => {
    state.saveType = saveType;
  });

// --- Module ---
export default () => {
  useTaskForm();
  handle();
  return <TaskView />;
};
