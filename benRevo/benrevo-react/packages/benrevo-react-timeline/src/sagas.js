import { call, put, takeEvery, select } from 'redux-saga/effects';
import { BENREVO_API_PATH, request } from '@benrevo/benrevo-react-core';
import { updateClient } from '@benrevo/benrevo-react-clients';
import {
  FETCH_TIMELINE,
  FETCH_TIMELINE_SUCCEEDED,
  FETCH_TIMELINE_FAILED,
  INIT_TIMELINE,
  INIT_TIMELINE_SUCCEEDED,
  INIT_TIMELINE_FAILED,
  UPDATE_PROJECT_TIME,
  UPDATE_PROJECT_TIME_SUCCEEDED,
  UPDATE_PROJECT_TIME_FAILED,
  UPDATE_COMPLETED,
  UPDATE_COMPLETED_SUCCEEDED,
  UPDATE_COMPLETED_FAILED,
} from './constants';
import { selectClient } from './selectors';
export function* getTimeline() {
  try {
    const client = yield select(selectClient());
    const data = yield call(request, `${BENREVO_API_PATH}/v1/timelines?clientId=${client.id}`);
    yield put({ type: FETCH_TIMELINE_SUCCEEDED, payload: data });
  } catch (error) {
    yield put({ type: FETCH_TIMELINE_FAILED, payload: error });
  }
}

export function* initTimeline() {
  try {
    const client = yield select(selectClient());
    const ops = {
      method: 'POST',
    };
    ops.body = JSON.stringify({
      clientId: client.id,
      shouldSendNotification: true,
    });
    const data = yield call(request, `${BENREVO_API_PATH}/v1/timelines/init`, ops);

    if (client.timelineEnabled === false) yield put(updateClient('timelineEnabled', true));

    yield put({ type: INIT_TIMELINE_SUCCEEDED, payload: data });
  } catch (error) {
    yield put({ type: INIT_TIMELINE_FAILED, payload: error });
  }
}

export function* updateProjectTime(action) {
  const timeLineId = action.payload.timeLineId;
  const timeLine = action.payload.timeLine;
  const url = `${BENREVO_API_PATH}/v1/timelines/${timeLineId}/updateProjectedTime`;
  const ops = {
    method: 'PUT',
    body: JSON.stringify(timeLine),
    headers: new Headers(),
  };
  ops.headers.append('content-type', 'application/json;charset=UTF-8');
  try {
    const data = yield call(request, url, ops);
    yield put({ type: UPDATE_PROJECT_TIME_SUCCEEDED, payload: data });
  } catch (error) {
    yield put({ type: UPDATE_PROJECT_TIME_FAILED, payload: error });
  }
}

export function* updateCompleted(action) {
  const timeLine = action.payload.timeLine;
  timeLine.completed = true;
  timeLine.shouldSendNotification = true;
  const timeLineId = timeLine.timelineId;
  const url = `${BENREVO_API_PATH}/v1/timelines/${timeLineId}/updateCompleted`;
  const ops = {
    method: 'PUT',
    body: JSON.stringify(timeLine),
    headers: new Headers(),
  };
  ops.headers.append('content-type', 'application/json;charset=UTF-8');
  try {
    const data = yield call(request, url, ops);
    yield put({ type: UPDATE_COMPLETED_SUCCEEDED, payload: data });
  } catch (error) {
    yield put({ type: UPDATE_COMPLETED_FAILED, payload: error });
  }
}

export function* watchFetchData() {
  yield takeEvery(FETCH_TIMELINE, getTimeline);
  yield takeEvery(UPDATE_PROJECT_TIME, updateProjectTime);
  yield takeEvery(UPDATE_COMPLETED, updateCompleted);
  yield takeEvery(INIT_TIMELINE, initTimeline);
}

export default [
  watchFetchData,
];
