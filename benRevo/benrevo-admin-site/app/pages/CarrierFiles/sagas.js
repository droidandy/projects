import { call, put, select, takeLatest, takeEvery } from 'redux-saga/effects';
import request from 'utils/request';
import { success } from 'react-notification-system-redux';
import { BENREVO_API_PATH } from '../../config';
import * as types from './constants';
import { selectSearch, selectInfo, selectBlobs, selectTags } from './selectors';
import * as actions from './actions';

export function* getCarriers() {
  const url = `${BENREVO_API_PATH}/admin/carriers/all/`;
  try {
    const data = yield call(request, url);
    yield put({ type: types.LOAD_CARRIERS_SUCCESS, payload: data });
  } catch (err) {
    yield put({ type: types.LOAD_CARRIERS_ERROR, payload: err });
  }
}

export function* getFiles(action) {
  const showLoading = action.payload.showLoading;
  try {
    const search = yield select(selectSearch);
    const info = yield select(selectInfo);
    const url = `${BENREVO_API_PATH}/admin/documents/search?fileName=${search.fileName}&tag=${search.tag === 'All' ? '' : search.tag}&carrierId=${info.carrier.carrierId}`;

    const data = yield call(request, url);
    yield put({ type: types.FILES_GET_SUCCESS, payload: { data, showLoading } });
  } catch (err) {
    yield put({ type: types.FILES_GET_ERROR, payload: err });
  }
}

export function* getTags() {
  try {
    const url = `${BENREVO_API_PATH}/admin/documents/tags`;
    const data = yield call(request, url);
    yield put({ type: types.TAGS_GET_SUCCESS, payload: data });
  } catch (err) {
    yield put({ type: types.TAGS_GET_ERROR, payload: err });
  }
}

export function* uploadFiles() {
  try {
    const files = yield select(selectBlobs);
    const tags = yield select(selectTags);
    for (let i = 0; i < files.length; i += 1) {
      yield uploadFile({ file: files[i], tags: tags[i], index: i });
    }
    yield put({ type: types.UPLOAD_FILES_SUCCESS });
  } catch (err) {
    yield put({ type: types.UPLOAD_FILES_ERROR, payload: err });
  }
}

export function* uploadFile(action) {
  const file = action.file;
  const tags = action.tags;
  const index = action.index;
  try {
    const info = yield select(selectInfo);
    let ops = {
      method: 'POST',
    };
    const form = new FormData();
    form.append('file', file);
    ops.body = form;

    const data = yield call(request, `${BENREVO_API_PATH}/admin/documents/upload/${info.carrier.carrierId}`, ops, true);

    if (tags && tags.length) {
      ops = {
        method: 'POST',
      };
      yield call(request, `${BENREVO_API_PATH}/admin/documents/tags/create?documentId=${data.documentId}&tags=${tags.join(',')}`, ops);
    }
    const notificationOpts = {
      message: `File ${data.fileName} uploaded successfully`,
      position: 'tc',
      autoDismiss: 5,
    };
    yield put(success(notificationOpts));
    yield put(actions.getFiles(false));
    yield put({ type: types.UPLOAD_FILE_SUCCESS, payload: { index } });
  } catch (err) {
    yield put({ type: types.UPLOAD_FILE_ERROR, payload: { error: err, index } });
  }
}

export function* deleteFile(action) {
  const fileId = action.payload.fileId;
  try {
    const url = `${BENREVO_API_PATH}/admin/documents/${fileId}`;
    const ops = {
      method: 'DELETE',
    };
    const data = yield call(request, url, ops);
    yield put({ type: types.DELETE_FILE_SUCCESS, payload: data });
  } catch (err) {
    yield put({ type: types.DELETE_FILE_ERROR, payload: err });
  }
}

export function* downloadFile(action) {
  const file = action.payload;
  try {
    const url = `${BENREVO_API_PATH}/admin/documents/${file.documentId}/download`;
    const data = yield call(request, url, null, true);
    const blob = new Blob([data], {
      type: file.mimeType,
    });
    const link = document.createElement('a');
    link.setAttribute('href', window.URL.createObjectURL(blob));
    link.setAttribute('download', `${file.fileName}.${file.fileExtension}`);
    if (document.createEvent) {
      const event = document.createEvent('MouseEvents');
      event.initEvent('click', true, true);
      link.dispatchEvent(event);
    } else {
      link.click();
    }
    yield put({ type: types.DOWNLOAD_FILE_SUCCESS, payload: file });
  } catch (err) {
    yield put({ type: types.DOWNLOAD_FILE_ERROR, payload: file });
  }
}

export function* watchFetchData() {
  yield takeLatest(types.LOAD_CARRIERS, getCarriers);
  yield takeLatest(types.FILES_GET, getFiles);
  yield takeLatest(types.UPLOAD_FILES, uploadFiles);
  yield takeEvery(types.UPLOAD_FILE, uploadFile);
  yield takeLatest(types.DELETE_FILE, deleteFile);
  yield takeLatest(types.DOWNLOAD_FILE, downloadFile);
  yield takeLatest(types.TAGS_GET, getTags);
}

// All sagas to be loaded
export default [
  watchFetchData,
];

