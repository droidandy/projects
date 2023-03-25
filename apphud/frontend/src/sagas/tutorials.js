import { call, put, takeEvery } from 'redux-saga/effects'
import { getRequest } from './api'
import { getTutorial, getTutorialSuccess } from "../actions/tutorials"

function fetchTutorial(platform) {
  return getRequest(`/tutorials/${platform}`)
}

function* gettutorialWatcher({ payload }) {
  try {
    const result = yield call(fetchTutorial, payload[0]);
    yield put(getTutorialSuccess(result.data.data.results));
    yield payload[1](result.data.data.results);
  } catch (e) {
    console.error('Getting tutorial error - ', e);
  }
}

export default function* tutorialWatcher() {
  yield takeEvery(getTutorial, gettutorialWatcher)
}
