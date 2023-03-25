import { namespace } from 'js/redux';
import { get } from 'utils';

export default namespace('bookings', (dispatcher, action) => {
  dispatcher('getCharts', (dispatch, withLinkedCompanies = false) => {
    return get('/charts', { withLinkedCompanies })
      .then(({ data }) => {
        dispatch(action('getChartsSuccess', data));
      });
  });
  dispatcher('setChartIndex', (dispatch, chart, data) => {
    dispatch(action('setChartIndex', chart, data));
  });
});
