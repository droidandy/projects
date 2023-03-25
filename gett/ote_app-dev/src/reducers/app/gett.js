import { composeReducer } from 'redux-compose-reducer';
import update from 'update-js';

const initialState = {
  oAuth: {}
};

const getAccessTokenSuccess = (state, { payload }) => (
  update(state, 'oAuth', payload)
);

export default composeReducer(
  'app/gett',
  {
    getAccessTokenSuccess
  },
  initialState
);
