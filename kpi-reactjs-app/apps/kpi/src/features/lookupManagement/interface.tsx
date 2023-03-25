import React from 'react';
import { DashboardSuspense } from 'src/components/DashboardSuspense';
import { RouteConfig } from 'src/types';
import { createModule } from 'typeless';
import { LookupManagementSymbol } from './symbol';
import { Lookup } from 'src/types-next';

// --- Actions ---
export const [
  handle,
  LookupManagementActions,
  getLookupManagementState,
] = createModule(LookupManagementSymbol)
  .withActions({
    $mounted: null,
    $init: null,
    loaded: (lookup: Lookup | null) => ({
      payload: { lookup },
    }),
    setSaving: (isSaving: boolean) => ({ payload: { isSaving } }),
  })
  .withState<LookupManagementState>();

// --- Routing ---
const ModuleLoader = React.lazy(() => import('./module'));

const LookupManagementRoute = () => (
  <DashboardSuspense>
    <ModuleLoader />
  </DashboardSuspense>
);

export const routeConfig: RouteConfig = {
  type: 'route',
  auth: true,
  path: '/settings/lookup-management/:id',
  component: <LookupManagementRoute />,
};

// --- Types ---
export interface LookupManagementState {
  lookup: Lookup | null;
  isLoading: boolean;
  isSaving: boolean;
}
