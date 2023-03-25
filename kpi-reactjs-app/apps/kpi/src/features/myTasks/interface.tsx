import React from 'react';
import { DashboardSuspense } from 'src/components/DashboardSuspense';
import { RouteConfig } from 'src/types';
import { createModule } from 'typeless';
import { MyTasksSymbol } from './symbol';
import { ListState, BaseListActions } from 'src/mixins/listMixin-next';
import { Task } from 'src/types-next';

// --- Actions ---
export const [handle, MyTasksActions, getMyTasksState] = createModule(
  MyTasksSymbol
)
  .withActions({
    ...BaseListActions,
  })
  .withState<MyTasksState>();

// --- Routing ---
const ModuleLoader = React.lazy(() => import('./module'));

const MyTasksRoute = () => (
  <DashboardSuspense>
    <ModuleLoader />
  </DashboardSuspense>
);

export const routeConfig: RouteConfig = {
  type: 'route',
  auth: true,
  path: '/my-tasks',
  component: <MyTasksRoute />,
};

// --- Types ---
export interface MyTasksState extends ListState<Task, any> {}
