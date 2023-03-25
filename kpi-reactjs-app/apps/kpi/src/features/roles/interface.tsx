import React from 'react';
import { DashboardSuspense } from 'src/components/DashboardSuspense';
import { RouteConfig, SelectOption } from 'src/types';
import { createModule } from 'typeless';
import { RolesSymbol } from './symbol';
import { BaseListActions, ListState } from 'src/mixins/listMixin-next';
import { Role } from 'src/types-next';

// --- Actions ---
export const [handle, RolesActions, getRolesState] = createModule(RolesSymbol)
  .withActions({
    ...BaseListActions,
    onDelete: (role: Role) => ({ payload: { role } }),
  })
  .withState<RolesState>();

// --- Routing ---
const ModuleLoader = React.lazy(() => import('./module'));

const RolesRoute = () => (
  <DashboardSuspense>
    <ModuleLoader />
  </DashboardSuspense>
);

export const routeConfig: RouteConfig = {
  type: 'route',
  auth: true,
  path: '/settings/roles',
  component: <RolesRoute />,
};

// --- Types ---
export interface RolesState extends ListState<Role, RolesFilter> {}

export interface RolesFilter {
  name: string;
  roles: SelectOption[];
}
