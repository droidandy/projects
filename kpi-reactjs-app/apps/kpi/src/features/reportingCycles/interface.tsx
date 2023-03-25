import React from 'react';
import { DashboardSuspense } from 'src/components/DashboardSuspense';
import { RouteConfig } from 'src/types';
import { createModule } from 'typeless';
import { ReportingCyclesSymbol } from './symbol';
import { BaseListActions, ListState } from 'src/mixins/listMixin-next';
import { ReportingCycle } from 'src/types-next';

// --- Actions ---
export const [
  handle,
  ReportingCyclesActions,
  getReportingCyclesState,
] = createModule(ReportingCyclesSymbol)
  .withActions({
    ...BaseListActions,
    initiativeNewCycle: null,
    setInitiativeNewCycleLoading: (isInitiativeNewCycleLoading: boolean) => ({
      payload: {
        isInitiativeNewCycleLoading,
      },
    }),
  })
  .withState<ReportingCyclesState>();

// --- Routing ---
const ModuleLoader = React.lazy(() => import('./module'));

const ReportingCyclesRoute = () => (
  <DashboardSuspense>
    <ModuleLoader />
  </DashboardSuspense>
);

export const routeConfig: RouteConfig = {
  type: 'route',
  auth: true,
  path: '/reporting-cycles',
  component: <ReportingCyclesRoute />,
};

// --- Types ---
export interface ReportingCyclesState extends ListState<ReportingCycle, any> {
  isInitiativeNewCycleLoading: boolean;
}
