import { combineReducers } from 'redux';

import accountReducer from './accountReducer';
import { auth } from './auth';
import profileReducer from './profileReducer';

export default combineReducers({
  account: accountReducer,
  profile: profileReducer,
  auth,
});
