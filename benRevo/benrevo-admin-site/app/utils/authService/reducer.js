import { fromJS } from 'immutable';
import { SET_PROFILE, LOGOUT, ERROR_EXPIRED, ERROR_PERMISSION } from './constants';

export const FIRST_NAME = 'firstName';
export const LAST_NAME = 'lastName';
export const EMAIL = 'email';
export const NAME = 'name';
export const PICTURE = 'picture';
export const BROKERAGE = 'brokerage';
export const BROKERAGE_ROLE = 'brokerageRole';
export const USER_METADATA = 'userMetadata';
export const EXPIRED = 'expired';
export const PERMISSION = 'permission';

const initialState = fromJS({
  firstName: '',
  lastName: '',
  email: '',
  expired: null,
  permission: false,
  userMetadata: {},
  brokerageRole: ['user'],
});

function authReducer(state = initialState, action) {
  switch (action.type) {
    case SET_PROFILE: {
      let role = ['user'];

      if (action.profile.roles) role = action.profile.roles;
      return state
        .set(FIRST_NAME, action.profile.firstName)
        .set(LAST_NAME, action.profile.lastName)
        .set(NAME, action.profile.name)
        .set(EMAIL, action.profile.email)
        .set(PICTURE, action.profile.picture)
        .set(BROKERAGE, action.profile.brokerName)
        .set(BROKERAGE_ROLE, fromJS(role))
        .set(EXPIRED, false);
    }
    case LOGOUT:
      return state.clear();
    case ERROR_EXPIRED:
      return state
        .set(EXPIRED, action.payload);
    case ERROR_PERMISSION:
      return state
        .set(PERMISSION, action.payload);
    default:
      return state;
  }
}

export default authReducer;
