import { get } from 'utils';
import update from 'update-js';

export function flightstatsDispatchers(dispatcher, action) {
  dispatcher('getFlights', (dispatch, params) => {
    dispatch(action('getFlights'));

    return get('/flightstats/schedule', params)
      .then((res) => {
        dispatch(action('getFlightsSuccess', res.data));
      }).catch((err) => {
        dispatch(action('dropFlight'));
        throw err;
      });
  });

  dispatcher('dropFlight', (dispatch) => {
    dispatch(action('dropFlight'));
  });
}

export function flightstatsReducers(reducer, pathPrefix) {
  reducer('getFlights', (state) => {
    return update(state, path('flight.loading'), true);
  });

  reducer('getFlightsSuccess', (state, schedule) => {
    return update(state, path('flight'), { loading: false, schedule });
  });

  reducer('dropFlight', (state) => {
    return update(state, path('flight'), { schedule: false });
  });

  function path(key) {
    return pathPrefix ? `${pathPrefix}.${key}` : key;
  }
}
