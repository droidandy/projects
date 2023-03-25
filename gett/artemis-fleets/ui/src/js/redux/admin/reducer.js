import { combineReducers } from 'redux';
import app from './app.reducer';
import companies from './companies.reducer';
import notifications from './notifications.reducer';

export default combineReducers({
  app,
  companies,
  notifications
});
