import React from 'react';
import { DashboardSuspense } from 'src/components/DashboardSuspense';
import { RouteConfig } from 'src/types';
import { createModule } from 'typeless';
import { DataSourceSymbol } from './symbol';
import { Resource, BalancedScorecardItemType } from 'src/types-next';

// --- Actions ---
export const [handle, DataSourceActions, getDataSourceState] = createModule(
  DataSourceSymbol
)
  .withActions({
    $mounted: null,
    $init: null,
    loaded: (type: BalancedScorecardItemType, resource: Resource | null) => ({
      payload: { type, resource },
    }),
    setSaving: (isSaving: boolean) => ({ payload: { isSaving } }),
    setDeleting: (isDeleting: boolean) => ({ payload: { isDeleting } }),
    remove: null,
    save: (draft: boolean) => ({ payload: { draft } }),
  })
  .withState<DataSourceState>();

// --- Routing ---
const ModuleLoader = React.lazy(() => import('./module'));

const DataSourceRoute = () => (
  <DashboardSuspense>
    <ModuleLoader />
  </DashboardSuspense>
);

export const routeConfig: RouteConfig = {
  type: 'route',
  auth: true,
  exact: true,
  path: '/settings/strategy-items/:name/:id',
  component: <DataSourceRoute />,
};

// --- Types ---
export interface DataSourceState {
  type: BalancedScorecardItemType;
  resource: Resource | null;
  isLoaded: boolean;
  isDeleting: boolean;
  isSaving: boolean;
}
