/**
 * Created by developercomputer on 06.10.16.
 */
import { takeLatest } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import { AsyncStorage } from 'react-native';
import DeviceInfo from 'react-native-device-info';

import API from '../../API';
import {
  USER_SIGN_OUT,
  USER_SIGN_OUT_REQUEST
} from '../User';

function* signOut() {
  API.GET('logout', { device_id: DeviceInfo.getUniqueID() });
  API.AuthToken = null;
  AsyncStorage.removeItem('Token');
  yield put({
    type: 'NAV',
    payload: { pageName: 'LoginPage' }
  });
  yield put({ type: USER_SIGN_OUT });
}

function* rootSaga() {
  yield* takeLatest(USER_SIGN_OUT_REQUEST, signOut);
}

export default rootSaga;
