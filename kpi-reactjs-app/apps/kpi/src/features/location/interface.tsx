import React from 'react';
import { DashboardSuspense } from 'src/components/DashboardSuspense';
import { RouteConfig, Location } from 'src/types';
import { createModule } from 'typeless';
import { LocationSymbol } from './symbol';
import { OnPermission } from 'src/components/OnPermission';

// --- Actions ---
export const [handle, LocationActions, getLocationState] = createModule(
  LocationSymbol
)
  .withActions({
    $mounted: null,
    $unmounted: null,
    $init: null,
    loaded: (location: Location | null) => ({ payload: { location } }),
    setSaving: (isSaving: boolean) => ({ payload: { isSaving } }),
    setDeleting: (isDeleting: boolean) => ({ payload: { isDeleting } }),
    remove: null,
    initMap: null,
  })
  .withState<LocationState>();

// --- Routing ---
const ModuleLoader = React.lazy(() => import('./module'));

const LocationRoute = () => (
  <DashboardSuspense>
    <OnPermission permission="location:view" showError>
      <ModuleLoader />
    </OnPermission>
  </DashboardSuspense>
);

export const routeConfig: RouteConfig = {
  type: 'route',
  auth: true,
  path: '/settings/locations/:id',
  component: <LocationRoute />,
};

// --- Types ---
export interface LocationState {
  id: string;
  location: Location | null;
  isLoading: boolean;
  isDeleting: boolean;
  isSaving: boolean;
}
