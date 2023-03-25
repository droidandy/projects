import React from 'react';
import { DashboardSuspense } from 'src/components/DashboardSuspense';
import { RouteConfig } from 'src/types';
import { createModule } from 'typeless';
import { UsersSymbol } from './symbol';
import { BaseListActions, ListState } from 'src/mixins/listMixin-next';
import { User } from 'src/types-next';

// --- Actions ---
export const [handle, UsersActions, getUsersState] = createModule(UsersSymbol)
  .withActions({
    ...BaseListActions,
    onDelete: (user: User) => ({ payload: { user } }),
  })
  .withState<UsersState>();

// --- Routing ---
const ModuleLoader = React.lazy(() => import('./module'));

const UsersRoute = () => (
  <DashboardSuspense>
    <ModuleLoader />
  </DashboardSuspense>
);

export const routeConfig: RouteConfig = {
  type: 'route',
  auth: true,
  path: '/settings/users',
  component: <UsersRoute />,
};

// --- Types ---
export interface UsersState extends ListState<User, UserFilter> {}

export interface UserFilter {
  name: string;
  email: string;
}
