import React from 'react';
import { DashboardSuspense } from 'src/components/DashboardSuspense';
import { RouteConfig } from 'src/types';
import { createModule } from 'typeless';
import { UserSymbol } from './symbol';
import { User } from 'src/types-next';

// --- Actions ---
export const [handle, UserActions, getUserState] = createModule(UserSymbol)
  .withActions({
    $mounted: null,
    $init: null,
    loaded: (user: User | null) => ({ payload: { user } }),
    setSaving: (isSaving: boolean) => ({ payload: { isSaving } }),
    setDeleting: (isDeleting: boolean) => ({ payload: { isDeleting } }),
    remove: null,
  })
  .withState<UserState>();

// --- Routing ---
const ModuleLoader = React.lazy(() => import('./module'));

const UserRoute = () => (
  <DashboardSuspense>
    <ModuleLoader />
  </DashboardSuspense>
);

export const routeConfig: RouteConfig = {
  type: 'route',
  auth: true,
  path: '/settings/users/:id',
  component: <UserRoute />,
};

// --- Types ---
export interface UserState {
  id: string;
  user: User | null;
  isLoading: boolean;
  isDeleting: boolean;
  isSaving: boolean;
}
