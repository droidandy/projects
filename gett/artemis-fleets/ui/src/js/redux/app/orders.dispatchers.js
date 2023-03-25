import { namespace } from 'js/redux';
import { get } from 'utils';

export default namespace('orders', (dispatcher, action) => {
  dispatcher('getOrders', (dispatch, { type, spinner, ...rest }) => {
    if (spinner) {
      dispatch(action('getOrders'));
    }
    return get(`/${type}_orders`, rest)
      .then(res => dispatch(action('getOrdersSuccess', type, res.data)));
  });

  dispatcher('getOrderPathPoints', (dispatch, id) => {
    return get(`/completed_orders/${id}`)
      .then(res => dispatch(action('getOrderPathPointsSuccess', res.data)));
  });

  dispatcher('getDrivers', (dispatch) => {
    return get('/driver_locations')
      .then(res => dispatch(action('getDriversSuccess', res.data)));
  });

  dispatcher('changeDriversFilter', (dispatch, value) => {
    dispatch(action('changeDriversFilter', value));
  });
});
