import React from 'react';
import { DashboardSuspense } from 'src/components/DashboardSuspense';
import { RouteConfig } from 'src/types';
import { createModule } from 'typeless';
import { BaseListActions, ListState } from 'src/mixins/listMixin-next';
import { LookupManagement } from './symbol';
import { Lookup } from 'src/types-next';

// --- Actions ---
export const [
  handle,
  LookupManagementActions,
  getLookupManagementState,
] = createModule(LookupManagement)
  .withActions({
    ...BaseListActions,
  })
  .withState<LookupManagementState>();
// --- Routing ---
const ModuleLoader = React.lazy(() => import('./module'));
const LookupManagementsRoute = () => (
  <DashboardSuspense>
    <ModuleLoader />
  </DashboardSuspense>
);
export const routeConfig: RouteConfig = {
  type: 'route',
  auth: true,
  path: '/settings/lookup-management',
  component: <LookupManagementsRoute />,
};
// --- Types ---
export interface LookupManagementState extends ListState<Lookup, any> {}
