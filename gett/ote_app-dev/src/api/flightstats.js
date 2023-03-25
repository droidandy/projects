import { get } from 'utils';

const getFlights = params => get('/flightstats/flights', params);

const getFlightSchedule = params => get('flightstats/schedule_states', params);

const getFlightTrack = params => get('flightstats/track', params);

export default {
  getFlights,
  getFlightSchedule,
  getFlightTrack
};
