import { call, put, select, takeLatest } from 'redux-saga/effects';
import request from 'utils/request';
import * as types from './constants';
import { BENREVO_API_PATH } from '../../config';
import { selectYear } from './selectors';

export function* getChanges(action) {
  const carrier = action.payload.carrier;
  const file = action.payload.file;
  const fileName = action.payload.file.name;
  const year = yield select(selectYear);
  const url = `${BENREVO_API_PATH}/admin/plans/changes/${carrier}`;
  try {
    const ops = {
      method: 'POST',
    };
    const form = new FormData();
    form.append('file', file);
    form.append('planYear', year);
    ops.body = form;
    const data = yield call(request, url, ops, true);
    yield put({ type: types.GET_CHANGES_SUCCESS, payload: { data, fileName } });
  } catch (err) {
    yield put({ type: types.GET_CHANGES_ERROR, payload: err });
  }
}

export function* uploadPlan(action) {
  const carrier = action.payload.carrier;
  const file = action.payload.file;
  const year = yield select(selectYear);
  const url = `${BENREVO_API_PATH}/admin/plans/${carrier}`;
  try {
    const ops = {
      method: 'POST',
    };

    const form = new FormData();
    form.append('file', file);
    form.append('planYear', year);
    ops.body = form;
    yield call(request, url, ops, true, `Plan for carrier=${carrier} uploaded successfully`);
    yield put({ type: types.UPLOAD_PLAN_SUCCESS });
  } catch (err) {
    yield put({ type: types.UPLOAD_PLAN_ERROR, payload: err });
  }
}

export function* getPlanTypes(action) {
  const url = `${BENREVO_API_PATH}/admin/plans/${action.payload}/types`;
  try {
    const ops = {
      method: 'GET',
    };
    const data = yield call(request, url, ops);
    yield put({ type: types.GET_PLAN_TYPES_SUCCESS, payload: data });
  } catch (err) {
    yield put({ type: types.GET_PLAN_TYPES_ERROR, payload: err });
  }
}

export function* getPlanDesign(action) {
  const { carrier, year, planType } = action.payload;
  let counter = 1;
  let url = `${BENREVO_API_PATH}/admin/plans/${carrier.name}/${counter}?s=30&planYear=${year}&planType=${planType}`;
  try {
    const ops = {
      method: 'GET',
    };

    // Initial call to get page count
    let response = yield call(request, url, ops);
    const data = response.plans;
    let progress = (counter / response.totalPages) * 100;
    yield put({ type: types.UPDATE_PROGRESS, payload: progress });
    counter += 1;

    // keep calling next api until we get all data
    while (response.totalPages >= counter) {
      progress = (counter / response.totalPages) * 100;
      yield put({ type: types.UPDATE_PROGRESS, payload: progress });
      url = `${BENREVO_API_PATH}/admin/plans/${carrier.name}/${counter}?s=30&planYear=${year}&planType=${planType}`;
      response = yield call(request, url, ops);
      data.concat(response.plans);
      counter += 1;
    }

    yield put({ type: types.GET_PLAN_DESIGN_SUCCESS, payload: data });
  } catch (err) {
    yield put({ type: types.GET_PLAN_DESIGN_ERROR, payload: err });
  }
}

export function* watchFetchData() {
  yield takeLatest(types.GET_CHANGES, getChanges);
  yield takeLatest(types.UPLOAD_PLAN, uploadPlan);
  yield takeLatest(types.GET_PLAN_DESIGN, getPlanDesign);
  yield takeLatest(types.GET_PLAN_TYPES, getPlanTypes);
}

// All sagas to be loaded
export default [
  watchFetchData,
];
