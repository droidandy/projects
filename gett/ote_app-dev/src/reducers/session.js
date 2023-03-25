import { composeReducer } from 'redux-compose-reducer';
import update from 'update-js';

const initialState = {
  token: null,
  user: {},
  loading: false,
  errors: null
};

const loginSuccess = (state, { payload }) => update(state, 'token', payload);

const getCurrentUserStart = state => update(state, { loading: true, errors: null });

const getCurrentUserSuccess = (state, { payload }) => update(state, { user: payload, loading: false, errors: null });

const getCurrentUserFailure = (state, { payload }) => update(state, { loading: false, errors: payload });

const passGuide = state => update(state, 'user.guidePassed', true);

const resetGuide = (state, { payload }) => (
  update(state, {
    'user.guidePassed': false,
    'user.guideType': payload
  })
);

const logout = () => initialState;

const setFutureOrdersUpdates = (state, { payload }) => update.assign(state, 'user', payload);

export default composeReducer(
  'session',
  {
    loginSuccess,
    getCurrentUserSuccess,
    getCurrentUserStart,
    getCurrentUserFailure,
    passGuide,
    resetGuide,
    logout,
    setFutureOrdersUpdates
  },
  initialState
);
