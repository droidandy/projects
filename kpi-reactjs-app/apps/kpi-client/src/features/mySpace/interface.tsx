import React from 'react';
import { RouteConfig } from 'src/types';
import { createModule } from 'typeless';
import { MySpaceSymbol } from './symbol';
import { DashboardSuspense } from 'src/components/DashboardSuspense';

// --- Actions ---
export const [handle, MySpaceActions, getMySpaceState] = createModule(
  MySpaceSymbol
)
  .withActions({})
  .withState<MySpaceState>();

// --- Routing ---
const ModuleLoader = React.lazy(() => import('./module'));

const MySpaceRoute = () => (
  <DashboardSuspense>
    <ModuleLoader />
  </DashboardSuspense>
);

export const routeConfig: RouteConfig = {
  type: 'route',
  auth: true,
  path: '/my-space',
  component: <MySpaceRoute />,
};

// --- Types ---
export interface MySpaceState {
  foo: string;
}
