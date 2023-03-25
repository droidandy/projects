import React from 'react';
import * as Rx from 'src/rx';
import { DashboardsView } from './components/DashboardsView';
import { DashboardsActions, DashboardsState, handle } from './interface';
import { getAllDashboards } from 'src/services/API/dashboard';
import { catchErrorAndShowModal } from 'src/common/utils';

// --- Epic ---
handle.epic().on(DashboardsActions.$mounted, () => {
  return Rx.forkJoin(getAllDashboards()).pipe(
    Rx.map(([dashboards]) => DashboardsActions.loaded(dashboards)),
    catchErrorAndShowModal()
  );
});

// --- Reducer ---
const initialState: DashboardsState = {
  isLoaded: false,
  dashboards: [],
  selected: null!,
};

handle
  .reducer(initialState)
  .replace(DashboardsActions.$init, () => initialState)
  .on(DashboardsActions.loaded, (state, { dashboards }) => {
    state.isLoaded = true;
    state.dashboards = dashboards;
    state.selected = dashboards[0];
  });

// --- Module ---
export default () => {
  handle();
  return <DashboardsView />;
};
