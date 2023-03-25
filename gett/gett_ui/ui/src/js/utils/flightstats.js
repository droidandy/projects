import { get } from 'utils';
import update from 'update-js';

export function flightstatsDispatchers(dispatcher, action) {
  dispatcher('getFlights', (dispatch, params) => {
    dispatch(action('getFlights'));

    return get('/flightstats/flights', params)
      .then((res) => {
        dispatch(action('getFlightsSuccess', res.data));
      }).catch((err) => {
        dispatch(action('dropFlight'));
        throw err;
      });
  });

  dispatcher('getSchedule', (dispatch, params) => {
    dispatch(action('getFlights'));

    return get('/flightstats/schedule', params)
      .then((res) => {
        dispatch(action('getScheduleSuccess', res.data));
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

  reducer('getFlightsSuccess', (state, flights) => {
    return update(state, path('flight'), { loading: false, flights, schedule: [] });
  });

  reducer('getScheduleSuccess', (state, schedule) => {
    return update(state, path('flight'), { loading: false, schedule, flights: [] });
  });

  reducer('dropFlight', (state) => {
    return update(state, path('flight'), { loading: false, flights: [], schedule: [] });
  });

  function path(key) {
    return pathPrefix ? `${pathPrefix}.${key}` : key;
  }
}

export const initialState = {
  loading: false,
  flights: [],
  schedule: []
};
