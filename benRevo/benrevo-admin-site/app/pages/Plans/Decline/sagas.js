import { call, put, takeLatest, select } from 'redux-saga/effects';
import request from 'utils/request';
import { success } from 'react-notification-system-redux';
import { BENREVO_API_PATH } from '../../../config';
import * as types from '../constants';
import { selectInfoForQuote } from '../selectors';
import { updateClient } from '../../Client/actions';

export function* declineQuote(action) {
  const fileInfo = action.payload;
  try {
    const infoData = yield select(selectInfoForQuote());
    const ops = {
      method: 'POST',
    };

    ops.headers = new Headers();
    ops.headers.append('Accept', 'application/json');
    const form = new FormData();

    ops.body = form;
    const url = `${BENREVO_API_PATH}/admin/quotes/${infoData.broker.id}/${infoData.client.id}/${infoData.carrier.name}/${fileInfo.category.toUpperCase()}/DECLINED/`;
    yield call(request, url, ops, true);
    yield put({ type: types.DECLINE_SUCCESS, payload: fileInfo });
    const notificationOpts = {
      message: 'Product declined successfully',
      position: 'tc',
      autoDismiss: 5,
    };
    yield put(success(notificationOpts));
  } catch (err) {
    yield put({ type: types.DECLINE_ERROR, payload: fileInfo });
  }
}

export function* declineApprove() {
  const ops = {
    method: 'POST',
  };
  try {
    const infoData = yield select(selectInfoForQuote());
    const url = `${BENREVO_API_PATH}/admin/clients/${infoData.client.id}`;
    ops.body = JSON.stringify({
      clientState: 'QUOTED',
    });
    const data = yield call(request, url, ops);
    yield put({ type: types.DECLINE_APPROVE_SUCCESS, payload: data });
    const notificationOpts = {
      message: 'Request declined successfully',
      position: 'tc',
      autoDismiss: 5,
    };
    yield put(success(notificationOpts));
    yield put(updateClient('clientState', 'QUOTED'));
  } catch (err) {
    yield put({ type: types.DECLINE_APPROVE_ERROR, payload: err });
  }
}

export function* watchFetchData() {
  yield takeLatest(types.DECLINE, declineQuote);
  yield takeLatest(types.DECLINE_APPROVE, declineApprove);
}

// All sagas to be loaded
export default [
  watchFetchData,
];
