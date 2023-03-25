import React from 'react';
import { DashboardSuspense } from 'src/components/DashboardSuspense';
import { RouteConfig } from 'src/types';
import { createModule } from 'typeless';
import { DataSourceListSymbol } from './symbol';
import { BaseListActions, ListState } from 'src/mixins/listMixin-next';
import { Resource } from 'src/types-next';

// --- Actions ---
export const [
  handle,
  DataSourceListActions,
  getDataSourceListState,
] = createModule(DataSourceListSymbol)
  .withActions({
    ...BaseListActions,
    onDelete: (resource: Resource) => ({ payload: { resource } }),
  })
  .withState<DataSourceListState>();

// --- Routing ---
const ModuleLoader = React.lazy(() => import('./module'));

const DataSourceListRoute = () => (
  <DashboardSuspense>
    <ModuleLoader />
  </DashboardSuspense>
);

export const routeConfig: RouteConfig = {
  type: 'route',
  auth: true,
  exact: true,
  path: '/settings/strategy-items/:name',
  component: <DataSourceListRoute />,
};

// --- Types ---
export interface DataSourceListState extends ListState<Resource, any> {}
