import React from 'react';
import { DashboardSuspense } from 'src/components/DashboardSuspense';
import { RouteConfig } from 'src/types';
import { createModule } from 'typeless';
import { OrgUsersSymbol } from './symbol';
import { BaseListActions, ListState } from 'src/mixins/listMixin-next';
import { OrgUser } from 'src/types-next';

// --- Actions ---
export const [handle, OrgUsersActions, getOrgUsersState] = createModule(
  OrgUsersSymbol
)
  .withActions({
    ...BaseListActions,
    onDelete: (user: OrgUser) => ({ payload: { user } }),
  })
  .withState<OrgUsersState>();

// --- Routing ---
const ModuleLoader = React.lazy(() => import('./module'));

const OrgUsersRoute = () => (
  <DashboardSuspense>
    <ModuleLoader />
  </DashboardSuspense>
);

export const routeConfig: RouteConfig = {
  type: 'route',
  auth: true,
  path: '/settings/org-users',
  component: <OrgUsersRoute />,
};

// --- Types ---
export interface OrgUsersState extends ListState<OrgUser, OrgUserFilter> {}

export interface OrgUserFilter {
  name: string;
  email: string;
  unitId: number;
}
