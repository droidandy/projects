import { call, put, takeLatest, select } from 'redux-saga/effects';
import mixpanel from 'mixpanel-browser';
import { success, error } from 'react-notification-system-redux';
import { request, BENREVO_API_PATH, ROLE_IMPLEMENTATION_MANAGER, Logger } from '@benrevo/benrevo-react-core';
import {
  FETCH_CLIENTS,
  FETCH_CLIENTS_SUCCEEDED,
  FETCH_CLIENTS_FAILED,
  FETCH_CLIENT,
  FETCH_CLIENT_SUCCEEDED,
  FETCH_CLIENT_FAILED,
  SAVE_CLIENT_SUCCEEDED,
  SAVE_CLIENT_FAILED,
  SAVE_CLIENT,
  EXPORT_CLIENT,
  EXPORT_CLIENT_SUCCEEDED,
  EXPORT_CLIENT_FAILED,
  IMPORT_CLIENT,
  IMPORT_CLIENT_SUCCEEDED,
  IMPORT_CLIENT_FAILED,
} from './constants';
import { selectCurrentClient, selectClientToResponse, selectUserRole } from './selectors';

export function* getClients() {
  let url = '';
  const ops = {
    method: 'GET',
  };
  try {
    const role = yield select(selectUserRole);
    if (role !== ROLE_IMPLEMENTATION_MANAGER) url = `${BENREVO_API_PATH}/v1/clients`;
    else url = `${BENREVO_API_PATH}/v1/clients/onboarding`;
    const data = yield call(request, url, ops);
    if (!data || (data && !data.length)) {
      Logger.info('The client list is empty');
      mixpanel.track('The client list is empty');
      // console.log('The client list is empty');
    }
    yield put({ type: FETCH_CLIENTS_SUCCEEDED, payload: data });
  } catch (err) {
    const errorMini = { message: err.message, stack: err.stack };
    Logger.info('Error loading clients', errorMini);
    mixpanel.track('Error loading clients', errorMini);
    yield put({ type: FETCH_CLIENTS_FAILED, payload: err });
    // console.error('Error loading clients', errorMini);
  }
}

export function* getClient(action) {
  const url = `${BENREVO_API_PATH}/v1/clients/${action.payload.clientId}`;
  const ops = {
    method: 'GET',
  };
  try {
    const data = yield call(request, url, ops);
    yield put({ type: FETCH_CLIENT_SUCCEEDED, payload: data });
  } catch (err) {
    if (err.message.indexOf('404') !== -1) {
      const notificationOpts = {
        message: 'You specified an invalid client ID',
        position: 'tc',
        autoDismiss: 15,
      };
      yield put(error(notificationOpts));
    }
    yield put({ type: FETCH_CLIENT_FAILED, payload: err });
  }
}

export function* saveClient() {
  let url = `${BENREVO_API_PATH}/v1/clients`;
  const ops = {
    method: 'POST',
  };
  try {
    const currentClient = yield select(selectClientToResponse());

    if (currentClient.id) {
      ops.method = 'PUT';
      url = `${url}/${currentClient.id}`;
    }
    ops.body = JSON.stringify(currentClient);
    ops.headers = new Headers();
    ops.headers.append('content-type', 'application/json;charset=UTF-8');

    const data = yield call(request, url, ops);
    yield put({ type: SAVE_CLIENT_SUCCEEDED, payload: data });
    yield* getClients();
  } catch (err) {
    yield put({ type: SAVE_CLIENT_FAILED, payload: err });
  }
}

export function* exportClient() {
  const ops = {
    method: 'GET',
    headers: new Headers(),
  };
  ops.headers.append('content-type', 'application/xml');

  try {
    const client = yield select(selectCurrentClient());

    if (client.id) {
      const url = `${BENREVO_API_PATH}/v1/clients/${client.id}/file`;

      const data = yield call(request, url, ops);
      const blob = new Blob([data], {
        type: 'application/xml',
      });
      const link = document.createElement('a');

      if (window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(blob, `${client.clientName || 'benrevo'}.xml`);
      } else {
        link.setAttribute('href', window.URL.createObjectURL(blob));
        link.setAttribute('download', `${client.clientName || 'benrevo'}.xml`);
        if (document.createEvent) {
          const event = document.createEvent('MouseEvents');
          event.initEvent('click', true, true);
          link.dispatchEvent(event);
        } else {
          link.click();
        }
      }

      yield put({ type: EXPORT_CLIENT_SUCCEEDED });
    }
  } catch (err) {
    yield put({ type: EXPORT_CLIENT_FAILED, payload: err });
  }
}

export function* importClient(action) {
  const file = action.payload.file;
  const name = action.payload.name;
  const override = action.payload.override;
  const brokerId = action.payload.brokerId;
  const ops = {
    method: 'POST',
    headers: new Headers(),
  };
  ops.headers.append('Accept', 'application/json');

  try {
    let url = `${BENREVO_API_PATH}/v1/clients/upload`;
    const form = new FormData();
    form.append('file', file);
    ops.body = form;

    if (name) url += `?clientName=${encodeURIComponent(name)}`;
    if (override) url += `?override=${override}`;
    if (brokerId) url += `${(name || override) ? '&' : '?'}brokerId=${brokerId}`;

    const data = yield call(request, url, ops, true);

    if (data.id) {
      const notificationOpts = {
        message: 'The RFP was successfully imported.',
        position: 'tc',
        autoDismiss: 5,
        uid: 1112,
      };
      yield put(success(notificationOpts));
    }

    yield put({ type: IMPORT_CLIENT_SUCCEEDED, payload: data });
  } catch (err) {
    if (err.toString().indexOf('409') === -1) {
      yield put({ type: IMPORT_CLIENT_FAILED, payload: err });
    }
  }
}

export function* watchFetchData() {
  yield takeLatest(FETCH_CLIENT, getClient);
  yield takeLatest(FETCH_CLIENTS, getClients);
  yield takeLatest(EXPORT_CLIENT, exportClient);
  yield takeLatest(IMPORT_CLIENT, importClient);
}

export function* watchSaveClient() {
  yield takeLatest(SAVE_CLIENT, saveClient);
}

export default [
  watchFetchData,
  watchSaveClient,
];
