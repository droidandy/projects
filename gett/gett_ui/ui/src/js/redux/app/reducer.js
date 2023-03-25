import { combineReducers } from 'redux';
import session from './session.reducer';
import dashboard from './dashboard.reducer';
import bookings from './bookings.reducer';
import bookers from './bookers.reducer';
import passengers from './passengers.reducer';
import settings from './settings.reducer';
import drivers from './drivers.reducer';
import charts from './charts.reducer';

export default combineReducers({
  session,
  dashboard,
  bookings,
  bookers,
  passengers,
  settings,
  drivers,
  charts
});
