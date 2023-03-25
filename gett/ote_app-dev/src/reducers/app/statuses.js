import { composeReducer } from 'redux-compose-reducer';
import { merge, isEmpty } from 'lodash/fp';
import { omit } from 'lodash';
import update from 'update-js';

const initialState = {
  params: {
    connectBar: {}
  },
  guideEnableNext: true,
  permissions: {
    location: 'undetermined'
  },
  // 0 - disabled, not supported; 1 - enabled; 2 - faceId supported; 4 - touchId supported; 8 - suggested
  touchIdStatus: 0
};

const guideEnableNext = (state, { payload: { value } }) => (
  update(state, 'guideEnableNext', value)
);

const clearPermissions = state => update.assign(state, omit(initialState, 'touchIdStatus'));

const changeParamsField = (state, { payload: { field, value } }) => update(state, { [`params.${field}`]: value });

const changePermissions = (state, { payload }) => (
  { ...state, permissions: isEmpty(state.permissions) ? payload : merge(state.permissions, payload) }
);

const changeTouchIdStatus = (state, { payload }) => update(state, 'touchIdStatus', payload);

export default composeReducer(
  'app/statuses',
  {
    changeParamsField,
    changePermissions,
    clearPermissions,
    guideEnableNext,
    changeTouchIdStatus
  },
  initialState
);
