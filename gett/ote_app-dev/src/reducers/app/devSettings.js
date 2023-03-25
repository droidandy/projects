import { composeReducer } from 'redux-compose-reducer';
import update from 'update-js';
import { isDevMode } from 'utils';

const initialState = {
  showCarAnimations: !isDevMode,
  showLocatingCarAnimation: !isDevMode,
  showSplashScreenAnimation: !isDevMode
};

const changeField = (state, { payload: { field, value } }) => update(state, field, value);

export default composeReducer(
  'app/devSettings',
  {
    changeField
  },
  initialState
);
