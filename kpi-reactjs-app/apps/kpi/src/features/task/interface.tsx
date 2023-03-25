import React from 'react';
import { DashboardSuspense } from 'src/components/DashboardSuspense';
import { RouteConfig } from 'src/types';
import { createModule } from 'typeless';
import { TaskSymbol } from './symbol';
import { Task } from 'src/types-next';

// --- Actions ---
export const [handle, TaskActions, getTaskState] = createModule(TaskSymbol)
  .withActions({
    $mounted: null,
    $init: null,
    loaded: (task: Task) => ({ payload: { task } }),
    setSaving: (isSaving: boolean) => ({ payload: { isSaving } }),
    save: (saveType: TaskSaveType) => ({
      payload: { saveType },
    }),
  })
  .withState<TaskState>();

// --- Routing ---
const ModuleLoader = React.lazy(() => import('./module'));

const TaskRoute = () => (
  <DashboardSuspense>
    <ModuleLoader />
  </DashboardSuspense>
);

export const routeConfig: RouteConfig = {
  type: 'route',
  auth: true,
  path: '/my-tasks/:id',
  component: <TaskRoute />,
};

// --- Types ---
export interface TaskState {
  task: Task | null;
  isLoaded: boolean;
  isSaving: boolean;
  saveType: TaskSaveType | null;
}

export type TaskSaveType = 'save' | 'cancel';
