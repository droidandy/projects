import React from 'react';
import { DashboardSuspense } from 'src/components/DashboardSuspense';
import { RouteConfig, Location, SelectOption } from 'src/types';
import { createModule } from 'typeless';
import { LocationsSymbol } from './symbol';
import { OnPermission } from 'src/components/OnPermission';
import { BaseListActions, ListState } from 'src/mixins/listMixin';

// --- Actions ---
export const [handle, LocationsActions, getLocationsState] = createModule(
  LocationsSymbol
)
  .withActions({
    ...BaseListActions,
  })
  .withState<LocationsState>();

// --- Routing ---
const ModuleLoader = React.lazy(() => import('./module'));

const LocationsRoute = () => (
  <DashboardSuspense>
    <OnPermission permission="locations:view" showError>
      <ModuleLoader />
    </OnPermission>
  </DashboardSuspense>
);

export const routeConfig: RouteConfig = {
  type: 'route',
  auth: true,
  path: '/settings/locations',
  component: <LocationsRoute />,
};

// --- Types ---
export interface LocationsState extends ListState<Location, LocationFilter> {}

export interface LocationFilter {
  name: string;
  address: string;
  poBox: string;
  city: string;
  country: string;
  isHeadquarter: SelectOption | null;
}
