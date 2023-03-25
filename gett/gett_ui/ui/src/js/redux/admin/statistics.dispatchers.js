import { namespace } from 'js/redux';
import { get } from 'utils';

export default namespace('bookings', (dispatcher, action) => {
  dispatcher('getStatistics', (dispatch) => {
    return get('/admin/statistics')
      .then(({ data }) => {
        dispatch(action('getStatisticsSuccess', data));
      });
  });
});
