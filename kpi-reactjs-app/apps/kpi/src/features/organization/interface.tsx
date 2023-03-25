import React from 'react';
import { DashboardSuspense } from 'src/components/DashboardSuspense';
import { RouteConfig } from 'src/types';
import { Organization } from 'src/types-next';
import { createModule } from 'typeless';
import { OrganizationSymbol } from './symbol';

// --- Actions ---
export const [handle, OrganizationActions, getOrganizationState] = createModule(
  OrganizationSymbol
)
  .withActions({
    $mounted: null,
    $unmounted: null,
    $init: null,
    loaded: (organization: Organization | null) => ({
      payload: { organization },
    }),
    setSaving: (isSaving: boolean) => ({ payload: { isSaving } }),
    setDeleting: (isDeleting: boolean) => ({ payload: { isDeleting } }),
    remove: null,
    initMap: null,
  })
  .withState<OrganizationState>();

// --- Routing ---
const ModuleLoader = React.lazy(() => import('./module'));

const OrganizationRoute = () => (
  <DashboardSuspense>
    <ModuleLoader />
  </DashboardSuspense>
);

export const routeConfig: RouteConfig = {
  type: 'route',
  auth: true,
  path: '/settings/organizations/:id',
  component: <OrganizationRoute />,
};

// --- Types ---
export interface OrganizationState {
  id: string;
  organization: Organization | null;
  isLoading: boolean;
  isDeleting: boolean;
  isSaving: boolean;
}
