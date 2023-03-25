import { combineReducers } from 'redux';
import orders from './orders.reducer';
import reports from './reports.reducer';
import users from './users.reducer';
import settings from './settings.reducer';
import dashboard from './dashboard.reducer';
import session from './session.reducer';
import billing from './billing.reducer';

export default combineReducers({
  orders,
  settings,
  users,
  reports,
  dashboard,
  session,
  billing
});
