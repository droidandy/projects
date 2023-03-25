import React from 'react';
import { DashboardSuspense } from 'src/components/DashboardSuspense';
import { RouteConfig } from 'src/types';
import { createModule } from 'typeless';
import { RoleSymbol } from './symbol';
import { Permission, Role } from 'src/types-next';

// --- Actions ---
export const [handle, RoleActions, getRoleState] = createModule(RoleSymbol)
  .withActions({
    $mounted: null,
    $init: null,
    loaded: (permissions: Permission[], role: Role | null) => ({
      payload: { permissions, role },
    }),
    setSaving: (isSaving: boolean) => ({ payload: { isSaving } }),
    setDeleting: (isDeleting: boolean) => ({ payload: { isDeleting } }),
    remove: null,
  })
  .withState<RoleState>();

// --- Routing ---
const ModuleLoader = React.lazy(() => import('./module'));

const RoleRoute = () => (
  <DashboardSuspense>
    <ModuleLoader />
  </DashboardSuspense>
);

export const routeConfig: RouteConfig = {
  type: 'route',
  auth: true,
  path: '/settings/roles/:id',
  component: <RoleRoute />,
};

// --- Types ---
export interface RoleState {
  id: string;
  role: Role | null;
  permissions: Permission[];
  isLoading: boolean;
  isDeleting: boolean;
  isSaving: boolean;
}
