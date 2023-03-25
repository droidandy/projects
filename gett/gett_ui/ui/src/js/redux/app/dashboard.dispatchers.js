import { namespace } from 'js/redux';
import { get } from 'utils';
import { flightstatsDispatchers } from 'utils/flightstats';

export default namespace('dashboard', (dispatcher, action) => {
  dispatcher('getDashboard', (dispatch) => {
    return get('/company')
      .then(res => dispatch(action('getDashboardSuccess', res.data)));
  });

  dispatcher('updateDashboard', (dispatch, data) => {
    dispatch(action('getDashboardSuccess', data));
  });

  dispatcher('updateBookingCounts', (dispatch, liveModifier, futureModifier) => {
    dispatch(action('updateBookingCounts', liveModifier, futureModifier));
  });

  dispatcher('addInternalMessage', (dispatch, newMessage) => {
    dispatch(action('addInternalMessage', newMessage));
  });

  dispatcher('addExternalMessage', (dispatch, newMessage) => {
    dispatch(action('addExternalMessage', newMessage));
  });

  flightstatsDispatchers(dispatcher, action);
});
