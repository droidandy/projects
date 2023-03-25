import { namespace } from 'js/redux';
import { get } from 'utils';

export default namespace('reports', (dispatcher, action) => {
  dispatcher('getReports', (dispatch, week) => {
    dispatch(action('getReports'));
    return get('/driver_reports', { week })
      .then(res => dispatch(action('getReportsSuccess', res.data)));
  });

  dispatcher('getFleetReports', (dispatch) => {
    dispatch(action('getFleetReports'));
    return get('/fleet_reports')
      .then(res => dispatch(action('getFleetReportsSuccess', res.data)));
  });
});
