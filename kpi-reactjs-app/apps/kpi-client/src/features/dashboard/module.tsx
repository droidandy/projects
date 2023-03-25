import React from 'react';
import * as R from 'remeda';
import * as Rx from 'src/rx';
import { DashboardView } from './components/DashboardView';
import { DashboardActions, DashboardState, handle } from './interface';
import { RouterActions, getRouterState } from 'typeless-router';
import { getGlobalState, GlobalActions } from '../global/interface';
import { getDashboard, getStrategicPlanById } from 'shared/API';
import { catchErrorAndShowModal } from 'src/common/utils';

// --- Epic ---
handle
  .epic()
  .on(RouterActions.locationChange, () => {
    const { pathname } = getRouterState().location!;
    if (pathname === '/' || pathname.startsWith('/dashboard/')) {
      return DashboardActions.load();
    } else {
      return Rx.empty();
    }
  })
  .on(DashboardActions.$mounted, () => DashboardActions.load())
  .on(DashboardActions.load, () => {
    const { pathname } = getRouterState().location!;
    const { dashboards } = getGlobalState();
    if (pathname === '/') {
      if (!dashboards.length) {
        return GlobalActions.showNotification(
          'error',
          'no dashboards configured'
        );
      }
      return RouterActions.push(`/dashboard/${dashboards[0].id}`);
    }
    const id = Number(R.last(getRouterState().location!.pathname.split('/')));

    return getDashboard(id).pipe(
      Rx.mergeMap(dashboard => {
        return Rx.forkJoin([
          getStrategicPlanById(dashboard.strategicPlanId),
        ]).pipe(
          Rx.map(([strategicPlan]) =>
            DashboardActions.loaded(dashboard, strategicPlan)
          )
        );
      }),
      catchErrorAndShowModal()
    );
  });

// --- Reducer ---

const initialState: DashboardState = {
  isLoaded: false,
  dashboard: null!,
  strategicPlan: null!,
};

handle
  .reducer(initialState)
  .on(DashboardActions.load, state => {
    Object.assign(state, initialState);
  })
  .on(DashboardActions.loaded, (state, { dashboard, strategicPlan }) => {
    state.isLoaded = true;
    state.dashboard = dashboard;
    state.strategicPlan = strategicPlan;
  });

// --- Module ---
export default () => {
  handle();
  return <DashboardView />;
};
