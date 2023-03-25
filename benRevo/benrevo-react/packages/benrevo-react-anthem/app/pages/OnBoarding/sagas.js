import { call, put, takeEvery, select } from 'redux-saga/effects';
import { request, BENREVO_API_PATH } from '@benrevo/benrevo-react-core';
import {
  MainSagas,
  saveAnswers,
  answersSendMail,
  selectClient,
  selectAnswers,
  selectDefaultAnswers,
  ANSWERS_GET,
  ANSWERS_GET_SUCCESS,
  ANSWERS_GET_ERROR,
  ANSWERS_SAVE,
  ANSWERS_SAVE_SUCCESS,
  ANSWERS_SAVE_ERROR,
  FILE_QUESTIONNAIRE,
  FILE_QUESTIONNAIRE_SUCCESS,
  FILE_QUESTIONNAIRE_ERROR,
  ANSWERS_SEND_MAIL,
  GET_FILE,
} from '@benrevo/benrevo-react-onboarding';
import Questions from './questions';

export function* getAnswers() {
  const ops = {
    method: 'GET',
  };
  try {
    const final = {};
    const client = yield select(selectClient());
    const url = `${BENREVO_API_PATH}/v1/answers/${client.id}`;
    const data = yield call(request, url, ops);

    final.submittedDate = data.submittedDate;
    final.answers = yield select(selectDefaultAnswers(data, Questions));

    yield put({ type: ANSWERS_GET_SUCCESS, payload: final });
  } catch (error) {
    yield put({ type: ANSWERS_GET_ERROR, payload: error });
  }
}

export function* fileQuestionnaire() {
  const ops = {
    method: 'GET',
    headers: new Headers(),
  };
  const contentType = 'application/pdf';
  const name = 'questionnaire.pdf';
  ops.headers.append('content-type', contentType);
  try {
    const client = yield select(selectClient());
    const url = `${BENREVO_API_PATH}/v1/files/anthem-blue-cross-questionnaire?clientId=${client.id}`;

    yield put(saveAnswers());

    const data = yield call(request, url, ops, true);

    const blob = new Blob([data], {
      type: contentType,
    });
    const link = document.createElement('a');
    if (window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(blob, name);
    } else {
      link.setAttribute('href', window.URL.createObjectURL(blob));
      link.setAttribute('download', name);
      if (document.createEvent) {
        const event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        link.dispatchEvent(event);
      } else {
        link.click();
      }
    }
    yield put({ type: FILE_QUESTIONNAIRE_SUCCESS });
  } catch (error) {
    yield put({ type: FILE_QUESTIONNAIRE_ERROR, payload: error });
  }
}

export function* sendAnswers(action) {
  const page = action.page;
  const ops = {
    method: 'PUT',
  };
  try {
    const client = yield select(selectClient());
    const url = `${BENREVO_API_PATH}/v1/answers`;
    const data = yield select(selectAnswers(Questions));
    ops.body = JSON.stringify({
      answers: data.answers,
      multiAnswers: data.multiAnswers,
      clientId: client.id,
    });
    const result = yield call(request, url, ops);

    yield put({ type: ANSWERS_SAVE_SUCCESS, payload: { result, loading: false, sent: page !== undefined } });

    if (page) {
      yield put(answersSendMail());
    }
  } catch (error) {
    yield put({ type: ANSWERS_SAVE_ERROR, payload: error });
  }
}

export function* watchFetchData() {
  yield takeEvery(FILE_QUESTIONNAIRE, fileQuestionnaire);
  yield takeEvery(ANSWERS_GET, getAnswers);
  yield takeEvery(ANSWERS_SAVE, sendAnswers);
  yield takeEvery(ANSWERS_SEND_MAIL, MainSagas.sendMail);
  yield takeEvery(GET_FILE, MainSagas.getFile);
}

// All sagas to be loaded
export default [
  watchFetchData,
];
