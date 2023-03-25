import { call, put, takeLatest, select } from 'redux-saga/effects';
import * as types from './constants';
import { BENREVO_API_PATH } from '../../../config';
import request from '../../../utils/request';
import * as appTypes from '../../App/constants';
import { selectActivity, selectClient, selectProduct, selectHistoryEdits } from './selectors';
import { getActivities, getClient } from './actions';
import { getClients } from '../actions';

export function* fetchClient(action) {
  const clientId = action.payload.clientId;
  const product = action.payload.product || appTypes.MEDICAL_SECTION.toUpperCase();
  const ops = {
    method: 'GET',
  };
  try {
    const url = `${BENREVO_API_PATH}/dashboard/client/${clientId}/details/${product}`;
    const data = yield call(request, url, ops);

    yield put({ type: types.CLIENT_GET_SUCCESS, payload: data });
  } catch (error) {
    yield put({ type: types.CLIENT_GET_ERROR, payload: error });
  }
}

export function* getOption(action) {
  const id = action.payload.id;
  try {
    const option = yield call(request, `${BENREVO_API_PATH}/v1/quotes/options/${id}`);
    const riders = yield call(request, `${BENREVO_API_PATH}/v1/quotes/options/${id}/riders`);

    yield put({ type: types.OPTION_GET_SUCCESS, payload: { option, riders } });
  } catch (error) {
    yield put({ type: types.OPTION_GET_ERROR, payload: error });
  }
}

export function* getActivity(action) {
  const id = action.payload.id;
  try {
    const data = yield call(request, `${BENREVO_API_PATH}/dashboard/activities/${id}`);

    yield put({ type: types.ACTIVITY_GET_SUCCESS, payload: data });
  } catch (error) {
    yield put({ type: types.ACTIVITY_GET_ERROR, payload: error });
  }
}

export function* getActivityByType(action) {
  const type = action.payload.type;
  try {
    const client = yield select(selectClient);
    const data = yield call(request, `${BENREVO_API_PATH}/dashboard/client/${client.clientId}/activities/${type}`);

    yield put({ type: types.ACTIVITY_BY_TYPE_GET_SUCCESS, payload: data });
  } catch (error) {
    yield put({ type: types.ACTIVITY_BY_TYPE_GET_ERROR, payload: error });
  }
}

export function* fetchActivities(action) {
  const clientId = action.payload.clientId;
  const ops = {
    method: 'GET',
  };
  try {
    const url = `${BENREVO_API_PATH}/dashboard/client/${clientId}/activities`;
    const data = yield call(request, url, ops);

    yield put({ type: types.ACTIVITIES_GET_SUCCESS, payload: data });
  } catch (error) {
    yield put({ type: types.ACTIVITIES_GET_ERROR, payload: error });
  }
}

export function* updateActivity() {
  const ops = {
    method: 'PUT',
  };
  try {
    const currentActivity = yield select(selectActivity);
    const client = yield select(selectClient);
    const product = yield select(selectProduct);
    delete currentActivity.options;
    ops.body = JSON.stringify(currentActivity);
    const url = `${BENREVO_API_PATH}/dashboard/activities/${currentActivity.activityId}/update`;
    const data = yield call(request, url, ops);
    yield put(getActivities(client.clientId));
    yield put(getClient(client.clientId, product, true));
    yield put(getClients());
    yield put({ type: types.ACTIVITY_UPDATE_SUCCESS, payload: data });
  } catch (error) {
    yield put({ type: types.ACTIVITY_UPDATE_ERROR, payload: error });
  }
}

export function* createActivity() {
  const ops = {
    method: 'PUT',
  };
  try {
    const client = yield select(selectClient);
    const product = yield select(selectProduct);
    const currentActivity = yield select(selectActivity);
    delete currentActivity.options;
    delete currentActivity.clientTeams;
    ops.body = JSON.stringify(currentActivity);
    const url = `${BENREVO_API_PATH}/dashboard/client/${client.clientId}/activities/create`;
    const data = yield call(request, url, ops);
    yield put(getActivities(client.clientId));
    yield put(getClient(client.clientId, product, true));
    yield put(getClients());
    yield put({ type: types.ACTIVITY_CREATE_SUCCESS, payload: data });
  } catch (error) {
    yield put({ type: types.ACTIVITY_CREATE_ERROR, payload: error });
  }
}

export function* removeActivity(action) {
  const activityId = action.payload.id;
  const ops = {
    method: 'DELETE',
  };
  try {
    const client = yield select(selectClient);
    const product = yield select(selectProduct);
    const url = `${BENREVO_API_PATH}/dashboard/activities/${activityId}`;
    const data = yield call(request, url, ops);
    yield put(getActivities(client.clientId));
    yield put(getClient(client.clientId, product, true));
    yield put(getClients());
    yield put({ type: types.ACTIVITY_REMOVE_SUCCESS, payload: data });
  } catch (error) {
    yield put({ type: types.ACTIVITY_REMOVE_ERROR, payload: error });
  }
}

export function* saveHistoryUpdates() {
  const client = yield select(selectClient);
  const historyNotes = yield select(selectHistoryEdits);
  const url = `${BENREVO_API_PATH}/dashboard/clients/${client.clientId}/clientNotes`;
  const ops = {
    method: 'POST',
  };
  ops.body = JSON.stringify({ notes: historyNotes });
  try {
    yield call(request, url, ops);
    yield put({ type: types.SAVE_HISTORY_UPDATES_SUCCESS });
  } catch (error) {
    yield put({ type: types.SAVE_HISTORY_UPDATES_ERROR, payload: error });
  }
}

export function* getHistoryNotes(action) {
  const url = `${BENREVO_API_PATH}/dashboard/clients/${action.payload}/clientNotes`;
  const ops = {
    method: 'GET',
  };
  try {
    const data = yield call(request, url, ops);
    yield put({ type: types.GET_HISTORY_NOTES_SUCCESS, payload: data });
  } catch (error) {
    yield put({ type: types.GET_HISTORY_NOTES_ERROR, payload: error });
  }
}

export function* watchFetchData() {
  yield takeLatest(types.CHANGE_OPTIONS_PRODUCT, fetchClient);
  yield takeLatest(types.CLIENT_GET, fetchClient);
  yield takeLatest(types.ACTIVITIES_GET, fetchActivities);
  yield takeLatest(types.OPTION_GET, getOption);
  yield takeLatest(types.ACTIVITY_GET, getActivity);
  yield takeLatest(types.ACTIVITY_BY_TYPE_GET, getActivityByType);
  yield takeLatest(types.ACTIVITY_UPDATE, updateActivity);
  yield takeLatest(types.ACTIVITY_CREATE, createActivity);
  yield takeLatest(types.ACTIVITY_REMOVE, removeActivity);
  yield takeLatest(types.SAVE_HISTORY_UPDATES, saveHistoryUpdates);
  yield takeLatest(types.GET_HISTORY_NOTES, getHistoryNotes);
}

export default [
  watchFetchData,
];
