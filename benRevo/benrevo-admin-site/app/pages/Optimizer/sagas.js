import { call, put, takeLatest, select } from 'redux-saga/effects';
import request from 'utils/request';
import { success } from 'react-notification-system-redux';
import { BENREVO_API_PATH } from '../../config';
import * as types from './constants';
import { selectInfo, selectOptimizerInfo, selectProducts } from './selectors';
import { brokerageGets } from './actions';
import { getClients } from '../Client/actions';

export function* loadOptimizer(action) {
  const file = action.payload.file;
  const add = action.payload.add;
  try {
    const ops = {
      method: 'POST',
    };
    const products = yield select(selectProducts);
    const optimizerInfo = yield select(selectOptimizerInfo);
    ops.headers = new Headers();
    ops.headers.append('Accept', 'application/json');
    const form = new FormData();
    form.append('file', file);
    if (!add) form.append('dto', JSON.stringify({ products, ...optimizerInfo.data }));
    else if (optimizerInfo.client.id) form.append('dto', JSON.stringify({ products, client: { id: optimizerInfo.client.id } }));

    // before upload we should delete client if override === true
    const info = yield select(selectInfo());
    if (optimizerInfo.data.overrideClient && !add) {
      const url = `${BENREVO_API_PATH}/admin/clients/${optimizerInfo.data.clientId}`;
      const options = {
        method: 'DELETE',
      };
      yield call(request, url, options, true);
    }

    ops.body = form;

    const result = yield call(request, `${BENREVO_API_PATH}/admin/optimizer/v2/upload/`, ops, true);

    if (optimizerInfo.addressInfo.address && !add) {
      const url = `${BENREVO_API_PATH}/admin/brokers/update`;
      const options = {
        method: 'PUT',
      };
      optimizerInfo.addressInfo.id = result.brokerage.id;
      optimizerInfo.addressInfo.name = result.brokerage.name;
      optimizerInfo.addressInfo.generalAgent = result.brokerage.generalAgent;
      options.body = JSON.stringify(optimizerInfo.addressInfo);
      yield call(request, url, options);
      yield put(brokerageGets());
    }

    const notificationOpts = {
      message: 'Optimizer is uploaded successfully',
      position: 'tc',
      autoDismiss: 5,
    };
    yield put(success(notificationOpts));
    yield put({ type: types.LOAD_OPTIMIZER_SUCCESS, payload: result });
    if (info.broker.id) yield put(getClients(info.broker.id));
  } catch (err) {
    yield put({ type: types.LOAD_OPTIMIZER_ERROR });
  }
}

export function* validateOptimizer(action) {
  const file = action.payload.file;
  try {
    const products = yield select(selectProducts);
    const ops = {
      method: 'POST',
    };
    ops.headers = new Headers();
    ops.headers.append('Accept', 'application/json');
    const form = new FormData();
    form.append('file', file);
    form.append('dto', JSON.stringify({ products }));
    ops.body = form;
    const result = yield call(request, `${BENREVO_API_PATH}/admin/optimizer/validator/`, ops, true);
    yield put({ type: types.VALIDATE_OPTIMIZER_SUCCESS, payload: result });
  } catch (err) {
    yield put({ type: types.VALIDATE_OPTIMIZER_ERROR });
  }
}

export function* getGA() {
  try {
    const url = `${BENREVO_API_PATH}/v1/brokers/generalAgents`;
    const data = yield call(request, url);
    yield put({ type: types.GA_GETS_SUCCESS, payload: data });
  } catch (err) {
    yield put({ type: types.GA_GETS_ERROR, payload: err });
  }
}

export function* getBrokerage() {
  try {
    const url = `${BENREVO_API_PATH}/v1/brokers/brokerages`;
    const data = yield call(request, url);
    yield put({ type: types.BROKERAGE_GETS_SUCCESS, payload: data });
  } catch (err) {
    yield put({ type: types.BROKERAGE_GETS_ERROR, payload: err });
  }
}

export function* watchFetchData() {
  yield takeLatest(types.LOAD_OPTIMIZER, loadOptimizer);
  yield takeLatest(types.VALIDATE_OPTIMIZER, validateOptimizer);
  yield takeLatest(types.GA_GET, getGA);
  yield takeLatest(types.BROKERAGE_GET, getBrokerage);
}

// All sagas to be loaded
export default [
  watchFetchData,
];
