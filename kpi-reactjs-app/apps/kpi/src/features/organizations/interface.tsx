import React from 'react';
import { DashboardSuspense } from 'src/components/DashboardSuspense';
import { RouteConfig } from 'src/types';
import { createModule } from 'typeless';
import { OrganizationsSymbol } from './symbol';
import { Organization } from 'src/types-next';
import { BaseListActions, ListState } from 'src/mixins/listMixin-next';

// --- Actions ---
export const [
  handle,
  OrganizationsActions,
  getOrganizationsState,
] = createModule(OrganizationsSymbol)
  .withActions({
    ...BaseListActions,
  })
  .withState<OrganizationsState>();

// --- Routing ---
const ModuleLoader = React.lazy(() => import('./module'));

const OrganizationsRoute = () => (
  <DashboardSuspense>
    <ModuleLoader />
  </DashboardSuspense>
);

export const routeConfig: RouteConfig = {
  type: 'route',
  auth: true,
  path: '/settings/organizations',
  component: <OrganizationsRoute />,
};

// --- Types ---
export interface OrganizationsState
  extends ListState<Organization, OrganizationFilter> {}

export interface OrganizationFilter {
  name: string;
}
