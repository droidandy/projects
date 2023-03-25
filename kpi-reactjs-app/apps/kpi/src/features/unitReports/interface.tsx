import React from 'react';
import { RouteConfig } from 'src/types';
import { createModule } from 'typeless';
import { UnitReportsSymbol } from './symbol';
import { ListState, BaseListActions } from 'src/mixins/listMixin-next';
import { UnitReport } from 'src/types-next';
import { DashboardSuspense } from 'src/components/DashboardSuspense';

// --- Actions ---
export const [handle, UnitReportsActions, getUnitReportsState] = createModule(
  UnitReportsSymbol
)
  .withActions({
    ...BaseListActions,
  })
  .withState<UnitReportsState>();

// --- Routing ---
const ModuleLoader = React.lazy(() => import('./module'));

const UnitReportsRoute = () => (
  <DashboardSuspense>
    <ModuleLoader />
  </DashboardSuspense>
);

export const routeConfig: RouteConfig = {
  type: 'route',
  auth: true,
  path: '/unit-reports',
  component: <UnitReportsRoute />,
};

// --- Types ---
export interface UnitReportsState extends ListState<UnitReport, any> {}
