import { combineReducers } from 'redux';
import dashboard from '../app/dashboard.reducer';
import bookings from './bookings.reducer';
import settings from '../app/settings.reducer';
import session from '../app/session.reducer';
import bookers from '../app/bookers.reducer';
import drivers from '../app/drivers.reducer';

export default combineReducers({
  dashboard,
  bookings,
  settings,
  session,
  bookers,
  drivers
});
