import React from 'react';
import { DashboardSuspense } from 'src/components/DashboardSuspense';
import { RouteConfig } from 'src/types';
import { createModule } from 'typeless';
import { OrgUserSymbol } from './symbol';
import { OrgUser, Role } from 'src/types-next';

// --- Actions ---
export const [handle, OrgUserActions, getOrgUserState] = createModule(
  OrgUserSymbol
)
  .withActions({
    $mounted: null,
    $init: null,
    loaded: (roles: Role[], orgUser: OrgUser | null) => ({
      payload: { roles, orgUser },
    }),
    setSaving: (isSaving: boolean) => ({ payload: { isSaving } }),
    setDeleting: (isDeleting: boolean) => ({ payload: { isDeleting } }),
    remove: null,
  })
  .withState<OrgUserState>();

// --- Routing ---
const ModuleLoader = React.lazy(() => import('./module'));

const OrgUserRoute = () => (
  <DashboardSuspense>
    <ModuleLoader />
  </DashboardSuspense>
);

export const routeConfig: RouteConfig = {
  type: 'route',
  auth: true,
  path: '/settings/org-users/:id',
  component: <OrgUserRoute />,
};

// --- Types ---
export interface OrgUserState {
  id: string;
  orgUser: OrgUser | null;
  roles: Role[];
  isLoading: boolean;
  isDeleting: boolean;
  isSaving: boolean;
}
