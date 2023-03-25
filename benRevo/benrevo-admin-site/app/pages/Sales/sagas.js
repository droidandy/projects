import { call, put, takeLatest, select } from 'redux-saga/effects';
import request from 'utils/request';
import { BENREVO_API_PATH } from '../../config';
import * as types from './constants';
import { fetchBrokerages } from './actions';
import { selectChanges, selectBrokerage, selectAdditions, selectPersonOfInterest } from './selectors';

export function* getPersons() {
  try {
    yield call(getBrokerage);
    const sales = yield call(request, `${BENREVO_API_PATH}/v1/persons/find/?type=SALES`);
    const presales = yield call(request, `${BENREVO_API_PATH}/v1/persons/find/?type=PRESALES`);
    const managers = yield call(request, `${BENREVO_API_PATH}/v1/persons/find/?type=CARRIER_MANAGER`);
    const renewalManagers = yield call(request, `${BENREVO_API_PATH}/v1/persons/find/?type=CARRIER_MANAGER_RENEWAL`);
    const renewalSales = yield call(request, `${BENREVO_API_PATH}/v1/persons/find/?type=SALES_RENEWAL`);
    yield put({ type: types.PERSONS_GET_SUCCESS, payload: { sales, presales, managers, renewalManagers, renewalSales } });
  } catch (err) {
    yield put({ type: types.PERSONS_GET_ERROR, payload: err });
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

export function* savePersons() {
  try {
    const changes = yield select(selectChanges);

    if (changes.updated.length) {
      const ops = {
        method: 'PUT',
      };
      for (let i = 0; i < changes.updated.length; i += 1) {
        const item = changes.updated[i];
        ops.body = JSON.stringify(item);
        yield call(request, `${BENREVO_API_PATH}/v1/persons/update`, ops, false, 'Personnel information successfully saved.');
      }
    } else if (changes.deleted.length) {
      const ops = {
        method: 'DELETE',
      };
      for (let i = 0; i < changes.deleted.length; i += 1) {
        const item = changes.deleted[i];
        ops.body = JSON.stringify(item);
        yield call(request, `${BENREVO_API_PATH}/v1/persons/delete`, ops, false, 'Personnel successfully deleted.');
      }
    }
    if (changes.reassignList.length) {
      const ops = {
        method: 'PUT',
      };
      for (let i = 0; i < changes.reassignList.length; i += 1) {
        if (changes.reassignList[i]) {
          const item = changes.reassignList[i];
          ops.body = JSON.stringify(item);
          yield call(request, `${BENREVO_API_PATH}/admin/brokers/update`, ops, false, 'Brokerage successfully updated.');
          yield put(fetchBrokerages());
        }
      }
    }
    if (changes.addedChildren.length) {
      const ops = {
        method: 'POST',
      };
      for (let i = 0; i < changes.addedChildren.length; i += 1) {
        const item = changes.addedChildren[i];
        ops.body = JSON.stringify(item);
        yield call(request, `${BENREVO_API_PATH}/v1/persons/addChild`, ops, false, 'Successfully added new personnel to management list.');
        yield put(getChildren());
      }
    }
    if (changes.removedChildren.length) {
      const ops = {
        method: 'DELETE',
      };
      for (let i = 0; i < changes.removedChildren.length; i += 1) {
        const item = changes.removedChildren[i];
        ops.body = JSON.stringify(item);
        yield call(request, `${BENREVO_API_PATH}/v1/persons/deleteChild`, ops, false, 'Successfully removed personnel from management list.');
        yield put(getChildren());
      }
    }
    yield call(getPersons);
  } catch (err) {
    yield put({ type: types.PERSONS_SAVE_ERROR, payload: err });
  }
}

export function* addPersons() {
  try {
    const changes = yield select(selectAdditions);
    if (changes.added.length) {
      const ops = {
        method: 'POST',
      };
      ops.headers = new Headers();
      ops.headers.append('Accept', 'application/json');
      ops.body = JSON.stringify(changes.added);
      yield call(request, `${BENREVO_API_PATH}/v1/persons/createList`, ops, false, 'Personnel successfully added.');
    }
    yield put({ type: types.PERSONS_ADD_SUCCESS });
    yield call(getPersons);
  } catch (err) {
    yield put({ type: types.PERSONS_SAVE_ERROR, payload: err });
  }
}

export function* saveBrokerage() {
  try {
    const brokerage = yield select(selectBrokerage);
    delete brokerage.presalesEmail;
    delete brokerage.presalesFirstName;
    delete brokerage.presalesLastName;
    delete brokerage.salesEmail;
    delete brokerage.salesFirstName;
    delete brokerage.salesLastName;
    const ops = {
      method: 'PUT',
    };
    ops.body = JSON.stringify(brokerage);
    yield call(request, `${BENREVO_API_PATH}/admin/brokers/update`, ops, false, 'Brokerage successfully updated.');
    yield put(fetchBrokerages());
    yield put({ type: types.BROKERAGE_SAVE_SUCCESS });
  } catch (err) {
    yield put({ type: types.BROKERAGE_SAVE_ERROR, payload: err });
  }
}

export function* getChildren() {
  try {
    const poi = yield select(selectPersonOfInterest);
    if (poi.type === types.PERSON_MANAGER || poi.type === types.PERSON_RENEWAL_MANAGER) {
      const children = yield call(request, `${BENREVO_API_PATH}/v1/persons/children?parentPersonId=${poi.personId}`);
      yield put({ type: types.CHILDREN_GET_SUCCESS, payload: children });
    }
  } catch (err) {
    yield put({ type: types.CHILDREN_GET_ERROR, payload: err });
  }
}

export function* watchFetchData() {
  yield takeLatest(types.BROKERAGE_GET, getBrokerage);
  yield takeLatest(types.PERSONS_GET, getPersons);
  yield takeLatest(types.PERSONS_SAVE, savePersons);
  yield takeLatest(types.PERSONS_SAVE_NEW, addPersons);
  yield takeLatest(types.BROKERAGE_SAVE, saveBrokerage);
  yield takeLatest(types.NEW_POI, getChildren);
}

// All sagas to be loaded
export default [
  watchFetchData,
];
