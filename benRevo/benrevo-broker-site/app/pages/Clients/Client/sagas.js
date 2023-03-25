import { call, put, takeLatest, takeEvery, select } from 'redux-saga/effects';
import { request } from '@benrevo/benrevo-react-core';
import { SAVE_CLIENT_SUCCEEDED, selectCurrentClient } from '@benrevo/benrevo-react-clients';
import { getOptions } from '@benrevo/benrevo-react-quote';
import { getAnotherOptions } from '../../Quote/actions';
import { BENREVO_API_PATH } from './../../../config';
import { makeSelectSelectedCattiers } from './selectors';

import {
  GET_MARKETING_STATUS_LIST,
  GET_MARKETING_STATUS_LIST_SUCCESS,
  GET_MARKETING_STATUS_LIST_ERROR,
  GET_PROGRAMS,
  GET_PROGRAMS_SUCCESS,
  GET_PROGRAMS_ERROR,
  GET_CLIENT_ATTRIBUTES,
  GET_CLIENT_ATTRIBUTES_SUCCESS,
  GET_CLIENT_ATTRIBUTES_ERROR,
  SET_CLIENT_ATTRIBUTES_SUCCESS,
  SET_CLIENT_ATTRIBUTES_ERROR,
  SET_CLIENT_ATTRIBUTES_CALL,
  SAVE_MARKETING_STATUS_LIST,
  SAVE_MARKETING_STATUS_LIST_SUCCESS,
  SAVE_MARKETING_STATUS_LIST_ERROR,
  SAVE_MARKETING_STATUS_LIST_ITEM,
  SAVE_MARKETING_STATUS_LIST_ITEM_SUCCESS,
  SAVE_MARKETING_STATUS_LIST_ITEM_ERROR,
  GET_VALIDATE,
  GET_VALIDATE_SUCCESS,
  GET_VALIDATE_ERROR,
  DELETE_CARRIE_ITEM,
  GET_CLSA_QUOTE,
  GET_CLSA_QUOTE_SUCCESS,
  GET_CLSA_QUOTE_ERROR,
  ZIP_ERROR,
  ZIP_SUCCESS_CALL,
  GET_NEXT_CLSA,
  CHECK_UHC,
  CHECK_UHC_SUCCESS,
  CHECK_UHC_ERROR,
} from './../constants';
import { zipSuccessCall, setClientAttributesCall } from './actions';

export function* getValidate(action) {
  const clientId = action.payload;
  try {
    const ops = {
      method: 'POST',
    };
    ops.headers = new Headers();
    ops.headers.append('content-type', 'application/json;charset=UTF-8');
    const data = yield call(request, `${BENREVO_API_PATH}/broker/validate?clientId=${clientId}`, ops);
    yield put({ type: GET_VALIDATE_SUCCESS, payload: data });
  } catch (error) {
    yield put({ type: GET_VALIDATE_ERROR, payload: error });
  }
}

export function* getMarketingStatusList(action) {
  const clientId = action.payload;
  try {
    const ops = {
      method: 'GET',
    };
    ops.headers = new Headers();
    ops.headers.append('content-type', 'application/json;charset=UTF-8');
    const data = yield call(request, `${BENREVO_API_PATH}/broker/clients/${clientId}/marketingStatusList`, ops);
    yield put({ type: GET_MARKETING_STATUS_LIST_SUCCESS, payload: data });
  } catch (error) {
    yield put({ type: GET_MARKETING_STATUS_LIST_ERROR, payload: error });
  }
}

export function* getPrograms(action) {
  const brokerId = action.payload;
  try {
    const ops = {
      method: 'GET',
    };
    ops.headers = new Headers();
    ops.headers.append('content-type', 'application/json;charset=UTF-8');
    const data = yield call(request, `${BENREVO_API_PATH}/v1/programs/${brokerId}`, ops);
    yield put({ type: GET_PROGRAMS_SUCCESS, payload: data });
  } catch (error) {
    yield put({ type: GET_PROGRAMS_ERROR, payload: error });
  }
}

export function* saveMarketingStatusList(action) {
  const { clientId, carrierItem } = action.payload;
  const { section } = action.meta;
  try {
    const selectedList = yield select(makeSelectSelectedCattiers());
    const list = [];
    Object.values(selectedList.medical).forEach((item) => {
      if (!section || (section !== 'medical') || !carrierItem || carrierItem.carrierId !== item.carrierId) {
        list.push({ carrierId: item.carrierId, product: 'MEDICAL' });
      }
    });
    Object.values(selectedList.dental).forEach((item) => {
      if (!section || (section !== 'dental') || !carrierItem || carrierItem.carrierId !== item.carrierId) {
        list.push({ carrierId: item.carrierId, product: 'DENTAL' });
      }
    });
    Object.values(selectedList.vision).forEach((item) => {
      if (!section || (section !== 'vision') || !carrierItem || carrierItem.carrierId !== item.carrierId) {
        list.push({ carrierId: item.carrierId, product: 'VISION' });
      }
    });
    Object.values(selectedList.life).forEach((item) => {
      if (!section || (section !== 'life') || !carrierItem || carrierItem.carrierId !== item.carrierId) {
        list.push({ carrierId: item.carrierId, product: 'LIFE' });
      }
    });
    Object.values(selectedList.std).forEach((item) => {
      if (!section || (section !== 'std') || !carrierItem || carrierItem.carrierId !== item.carrierId) {
        list.push({ carrierId: item.carrierId, product: 'STD' });
      }
    });
    Object.values(selectedList.ltd).forEach((item) => {
      if (!section || (section !== 'ltd') || !carrierItem || carrierItem.carrierId !== item.carrierId) {
        list.push({ carrierId: item.carrierId, product: 'LTD' });
      }
    });

    const ops = {
      method: 'PUT',
    };
    ops.headers = new Headers();
    ops.headers.append('content-type', 'application/json;charset=UTF-8');
    ops.body = JSON.stringify(list);
    const data = yield call(request, `${BENREVO_API_PATH}/broker/clients/${clientId}/marketingStatusList`, ops);
    yield put({ type: SAVE_MARKETING_STATUS_LIST_SUCCESS, payload: { data } });
    yield put({ type: GET_MARKETING_STATUS_LIST, payload: clientId });
  } catch (error) {
    yield put({ type: SAVE_MARKETING_STATUS_LIST_ERROR, payload: error });
  }
}

export function* updateMarketingStatusListItem(action) {
  const { itemId, marketingStatus, clientId } = action.payload;
  try {
    const ops = {
      method: 'PUT',
    };
    ops.headers = new Headers();
    ops.headers.append('content-type', 'application/json;charset=UTF-8');
    ops.body = JSON.stringify({ status: marketingStatus });
    const data = yield call(request, `${BENREVO_API_PATH}/broker/clients/marketingStatusList/${itemId}/changeStatus`, ops);
    yield put({ type: SAVE_MARKETING_STATUS_LIST_ITEM_SUCCESS, payload: { data } });
    yield put({ type: GET_MARKETING_STATUS_LIST, payload: clientId });
  } catch (error) {
    yield put({ type: SAVE_MARKETING_STATUS_LIST_ITEM_ERROR, payload: error });
  }
}

export function* updateList() {
  try {
    const client = yield select(selectCurrentClient());
    yield put({ type: GET_MARKETING_STATUS_LIST, payload: client.id });
    yield put({ type: GET_VALIDATE, payload: client.id });
  } catch (error) {
    yield put({ type: GET_MARKETING_STATUS_LIST_ERROR, payload: error });
  }
}

export function* zipSuccess(action) {
  const {
    zip,
    programId,
    age,
    number,
    section,
    clientId,
  } = action.payload;
  const ops = { method: 'POST' };
  const url = `${BENREVO_API_PATH}/v1/instantQuote/client/${clientId}/program/generate`;
  ops.body = JSON.stringify({
    programId,
    clientId,
    zipCode: zip,
    averageAge: age,
    numEligibleEmployees: number,
  });
  try {
    yield call(request, url, ops);
    yield put({ type: GET_CLSA_QUOTE_SUCCESS });
    if (section !== 'medical' && section !== 'dental' && section !== 'vision') {
      yield put(getAnotherOptions(section));
    } else if (section === 'medical' || section === 'dental' || section === 'vision') {
      yield put(getOptions(section));
    }
    yield put(setClientAttributesCall(action.payload));
  } catch (err) {
    yield put({ type: GET_CLSA_QUOTE_ERROR, payload: err });
  }
}

export function* setClientAttributes(action) {
  const {
    zip,
    age,
    number,
    clientId,
  } = action.payload;
  const ops = {
    method: 'POST',
  };
  try {
    ops.body = JSON.stringify([
      { attributeName: 'CLSA_AVG_AGE', value: age },
      { attributeName: 'CLSA_ZIP_CODE', value: zip },
      { attributeName: 'CLSA_NUM_ELIGIBLE', value: number },
    ]);
    const url = `${BENREVO_API_PATH}/v1/clients/${clientId}/saveAttributes`;
    yield call(request, url, ops);
    yield put({ type: SET_CLIENT_ATTRIBUTES_SUCCESS });
  } catch (error) {
    yield put({ type: SET_CLIENT_ATTRIBUTES_ERROR });
  }
}

export function* getClientAttributes() {
  try {
    const client = yield select(selectCurrentClient());
    const ops = {
      method: 'GET',
    };
    ops.headers = new Headers();
    ops.headers.append('content-type', 'application/json;charset=UTF-8');
    const data = yield call(request, `${BENREVO_API_PATH}/v1/clients/${client.id}/attributes`, ops);
    yield put({ type: GET_CLIENT_ATTRIBUTES_SUCCESS, payload: data });
  } catch (error) {
    yield put({ type: GET_CLIENT_ATTRIBUTES_ERROR, payload: error });
  }
}

export function* getCLSAQuote(action) {
  const { zip, programId } = action.payload;
  try {
    const ops = { method: 'POST' };
    const client = yield select(selectCurrentClient());
    const zipUrl = `${BENREVO_API_PATH}/v1/instantQuote/client/${client.id}/program/validate`;
    ops.body = JSON.stringify({
      programId,
      clientId: client.id,
      zipCode: zip,
    });
    const data = yield call(request, zipUrl, ops);
    if (data.errors.length) {
      yield put({ type: ZIP_ERROR, payload: data.errors[0] });
    } else {
      const successPayload = action.payload;
      successPayload.clientId = client.id;
      yield put(zipSuccessCall(action.payload, client.id));
    }
  } catch (err) {
    yield put({ type: GET_CLSA_QUOTE_ERROR, payload: err });
  }
}

export function* getNextCLSA(action) {
  const { programId, section } = action.payload;
  const ops = { method: 'POST' };
  try {
    const client = yield select(selectCurrentClient());
    ops.body = JSON.stringify({
      section,
      programId,
      clientId: client.id,
    });
    const url = `${BENREVO_API_PATH}/v1/instantQuote/client/${client.id}/program/generate`;
    yield call(request, url, ops);
    yield put({ type: GET_CLSA_QUOTE_SUCCESS });
    if (section !== 'medical' && section !== 'dental' && section !== 'vision') {
      yield put(getAnotherOptions(section));
    } else if (section === 'medical' || section === 'dental' || section === 'vision') {
      yield put(getOptions(section));
    }
  } catch (err) {
    yield put({ type: GET_CLSA_QUOTE_ERROR, payload: err });
  }
}

export function* uhcCheck(action) {
  const { section, id } = action.payload;
  try {
    const client = yield select(selectCurrentClient());
    const url = `${BENREVO_API_PATH}/v1/clients/${client.id}/quotes?rfpCarrierId=${id}&category=${section.toUpperCase()}`;
    const data = yield call(request, url);
    yield put({ type: CHECK_UHC_SUCCESS, payload: data });
  } catch (err) {
    yield put({ type: CHECK_UHC_ERROR, payload: err });
  }
}

export function* watchFetchData() {
  yield takeEvery(GET_MARKETING_STATUS_LIST, getMarketingStatusList);
  yield takeEvery(GET_PROGRAMS, getPrograms);
  yield takeLatest(GET_VALIDATE, getValidate);
  yield takeLatest(SAVE_MARKETING_STATUS_LIST, saveMarketingStatusList);
  yield takeLatest(SAVE_MARKETING_STATUS_LIST_ITEM, updateMarketingStatusListItem);
  yield takeEvery(DELETE_CARRIE_ITEM, saveMarketingStatusList);
  yield takeEvery(SAVE_CLIENT_SUCCEEDED, updateList);
  yield takeLatest(GET_CLSA_QUOTE, getCLSAQuote);
  yield takeLatest(ZIP_SUCCESS_CALL, zipSuccess);
  yield takeLatest(GET_NEXT_CLSA, getNextCLSA);
  yield takeLatest(CHECK_UHC, uhcCheck);
  yield takeEvery(GET_CLIENT_ATTRIBUTES, getClientAttributes);
  yield takeLatest(SET_CLIENT_ATTRIBUTES_CALL, setClientAttributes);
}

export default [
  watchFetchData,
];
