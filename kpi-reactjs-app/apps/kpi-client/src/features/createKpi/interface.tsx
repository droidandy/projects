import React from 'react';
import { RouteConfig, OrganizationUnit, BalancedScorecard } from 'src/types';
import { createModule } from 'typeless';
import { CreateKpiSymbol } from './symbol';
import { DashboardSuspense } from 'src/components/DashboardSuspense';

// --- Actions ---
export const [handle, CreateKpiActions, getCreateKpiState] = createModule(
  CreateKpiSymbol
)
  .withActions({
    $init: null,
    $mounted: null,
    save: null,
    setSaving: (isSaving: boolean) => ({ payload: { isSaving } }),
    unitsLoaded: (units: OrganizationUnit[]) => ({ payload: { units } }),
    scorecardsLoaded: (scorecards: BalancedScorecard[]) => ({
      payload: { scorecards },
    }),
  })
  .withState<CreateKpiState>();

// --- Routing ---
const ModuleLoader = React.lazy(() => import('./module'));

const CreateKpiRoute = () => (
  <DashboardSuspense>
    <ModuleLoader />
  </DashboardSuspense>
);

export const routeConfig: RouteConfig = {
  type: 'route',
  auth: true,
  path: '/create-kpi',
  component: <CreateKpiRoute />,
};

// --- Types ---
export interface CreateKpiState {
  isSaving: boolean;
  units: OrganizationUnit[] | null;
  scorecards: BalancedScorecard[] | null;
}
