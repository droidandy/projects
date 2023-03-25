import { reduce } from 'js/redux';
import update from 'update-js';

const initialState = {
  reports: [],
  loadingReports: false,
  fleetReports: [],
  loadingFleetReports: false
};

export default reduce('reports', initialState, (reducer) => {
  reducer('getReports', (state) => {
    return update(state, 'loadingReports', true);
  });

  reducer('getReportsSuccess', (state, data) => {
    return update(state, { 'reports': data, 'loadingReports': false });
  });

  reducer('getFleetReports', (state) => {
    return update(state, 'loadingFleetReports', true);
  });

  reducer('getFleetReportsSuccess', (state, data) => {
    return update(state, { 'fleetReports': data, 'loadingFleetReports': false });
  });
});
