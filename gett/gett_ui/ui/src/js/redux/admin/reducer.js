import { combineReducers } from 'redux';
import app from './app.reducer';
import companies from './companies.reducer';
import bookings from './bookings.reducer';
import notifications from './notifications.reducer';
import statistics from './statistics.reducer';
import users from './users.reducer';
import members from './members.reducer';
import settings from './settings.reducer';

export default combineReducers({
  app,
  companies,
  bookings,
  notifications,
  statistics,
  users,
  members,
  settings
});
