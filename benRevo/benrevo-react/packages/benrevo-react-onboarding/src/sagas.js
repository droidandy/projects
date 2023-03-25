import { call, put, takeEvery, select } from 'redux-saga/effects';
import { request, BENREVO_API_PATH } from '@benrevo/benrevo-react-core';
import {
  ANSWERS_SEND_MAIL,
  ANSWERS_SEND_MAIL_SUCCESS,
  ANSWERS_SEND_MAIL_ERROR,
  GET_FILE,
  GET_FILE_SUCCESS,
  GET_FILE_ERROR,
} from './constants';
import { selectClient } from './selectors';

export function* getFile(action) {
  const fileName = action.payload;
  const ops = {
    method: 'GET',
  };
  try {
    const url = `${BENREVO_API_PATH}/v1/documents/download?fileName=${fileName}`;
    const data = yield call(request, url, ops, true);
    let filename = data.filename;
    if (!filename) filename = `${fileName}.pdf`;

    const blob = new Blob([data], {
      type: 'application/pdf',
    });
    const link = document.createElement('a');

    if (window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(blob, filename);
    } else {
      link.setAttribute('href', window.URL.createObjectURL(blob));
      link.setAttribute('download', filename);
      if (document.createEvent) {
        const event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        link.dispatchEvent(event);
      } else {
        link.click();
      }
    }

    yield put({ type: GET_FILE_SUCCESS, payload: data });
  } catch (error) {
    yield put({ type: GET_FILE_ERROR, payload: error });
  }
}

export function* sendMail() {
  const ops = {
    method: 'POST',
  };
  try {
    const client = yield select(selectClient());
    const url = `${BENREVO_API_PATH}/v1/clients/${client.id}/postsales`;

    const data = yield call(request, url, ops);

    yield put({ type: ANSWERS_SEND_MAIL_SUCCESS, payload: data });
  } catch (error) {
    yield put({ type: ANSWERS_SEND_MAIL_ERROR, payload: error });
  }
}

export function* watchFetchData() {
  yield takeEvery(ANSWERS_SEND_MAIL, sendMail);
  yield takeEvery(GET_FILE, getFile);
}

// All sagas to be loaded
export default [
  watchFetchData,
];
