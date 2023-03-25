import { call, put, takeEvery, takeLatest, select } from 'redux-saga/effects';
import { replace } from 'react-router-redux';
import {
  selectClientRequest,
  getAllCarriers,
  saveRfp,
  getRfp,
  uploadFile,
  removeFile,
  getPdf,
  checkCensusType,
  getPlanNetworks,
  SEND_RFP,
  FETCH_RFP,
  SEND_RFP_FILE,
  FETCH_RFP_PDF, CHANGE_CURRENT_CARRIER,
  CHECK_CENSUS_TYPE,
  REMOVE_FILE, REMOVE_PLAN_FILE,
  FETCH_CARRIERS,
  RFP_PLANS_SAVE,
  RFP_PLANS_SAVE_SUCCESS,
  RFP_PLANS_SAVE_ERROR,
} from '@benrevo/benrevo-react-rfp';
import { downloadFile } from '@benrevo/benrevo-react-core';
import {
  selectClientToResponse,
  SAVE_CLIENT_SUCCEEDED,
  SAVE_CLIENT_FAILED,
  updateClient,
} from '@benrevo/benrevo-react-clients';
import { BENREVO_API_PATH } from '../../config';
import request from '../../utils/request';
import * as types from './constants';
import { getPreQuoted } from './ClientsList/actions';
import {
  selectCarrierById,
  selectBenefitsFromSection,
  selectSelectedBenefits,
  selectNewBrokerFields,
  selectProducerValue,
  selectDefaultBroker,
  selectCurrentClientId,
  selectClientChanges,
  selectCurrentBroker,
} from './selectors';

export function* saveClient() {
  let url = `${BENREVO_API_PATH}/v1/clients`;
  let isNew = false;
  const ops = {
    method: 'POST',
  };
  yield call(createBroker);

  const state = yield select();
  const broker = selectNewBrokerFields(state);
  const producer = selectProducerValue(state);

  if (!broker.readyToSave && producer.name) {
    const currBroker = selectCurrentBroker(state);
    currBroker.producer = producer.name;
    const brokerOps = {
      method: 'PUT',
    };
    brokerOps.body = JSON.stringify(currBroker);
    const brokerUrl = `${BENREVO_API_PATH}/admin/brokers/update`;
    try {
      yield call(request, brokerUrl, brokerOps);
    } catch (e) {
      console.warn(e);
    }
  }

  yield put({ type: types.SET_READY_TO_SAVE, payload: { condition: false } });
  try {
    const currentClient = yield select(selectClientToResponse());
    if (currentClient.id) {
      ops.method = 'PUT';
      url = `${url}/${currentClient.id}`;
    } else {
      currentClient.clientState = 'OPPORTUNITY_IN_PROGRESS';
      isNew = true;
    }
    ops.body = JSON.stringify(currentClient);
    ops.headers = new Headers();
    ops.headers.append('content-type', 'application/json;charset=UTF-8');

    const data = yield call(request, url, ops);
    yield put({ type: SAVE_CLIENT_SUCCEEDED, payload: data });
    if (isNew) {
      yield put(replace(`/prequote/clients/${data.id}`));
      yield call(saveRfp);
      yield call(getRfp);
      yield call(getPreQuoted());
    }
  } catch (err) {
    yield put({ type: SAVE_CLIENT_FAILED, payload: err });
  }
  yield put({ type: types.SAVE_CLIENT_TEAM });
}

export function* getBrokerage() {
  const ops = {
    method: 'GET',
  };

  try {
    const url = `${BENREVO_API_PATH}/v1/brokers/brokerages`;
    const data = yield call(request, url, ops);
    const state = yield select();
    const defaultIds = selectDefaultBroker(state);
    yield put({ type: types.BROKERAGE_GET_SUCCESS, payload: data });
    const defaultBroker = data.filter((broker) => broker.id === defaultIds.broker);
    yield put({
      type: types.SET_SELECTED_BROKER,
      payload: {
        broker: defaultBroker[0],
        brokerType: 'selectedBroker',
      },
    });
    yield put({
      type: types.BROKER_TEAM_GET,
      payload: {
        brokerId: defaultBroker[0].id,
        contactsType: 'brokerContacts',
      },
    });
  } catch (error) {
    yield put({ type: types.BROKERAGE_GET_ERROR, payload: error });
  }
}

export function* getGA() {
  const ops = {
    method: 'GET',
  };

  try {
    const url = `${BENREVO_API_PATH}/v1/brokers/generalAgents`;
    const data = yield call(request, url, ops);
    const state = yield select();
    const defaultIds = selectDefaultBroker(state);
    const defaultGA = data.filter((ga) => ga.id === defaultIds.GA);
    yield put({ type: types.GA_GET_SUCCESS, payload: data });

    yield put({
      type: types.SET_SELECTED_BROKER,
      payload: {
        broker: defaultGA[0],
        brokerType: 'selectedGA',
      },
    });
    yield put({
      type: types.BROKER_TEAM_GET,
      payload: {
        brokerId: defaultGA[0].id,
        contactsType: 'GAContacts',
      },
    });
  } catch (error) {
    yield put({ type: types.GA_GET_ERROR, payload: error });
  }
}

export function* getBrokerTeam(action) {
  const { contactsType, brokerId } = action.payload;
  const ops = {
    method: 'GET',
  };
  try {
    const url = `${BENREVO_API_PATH}/v1/brokers/${brokerId}/users`;
    const data = yield call(request, url, ops);

    yield put({ type: types.BROKER_TEAM_GET_SUCCESS, payload: data, contactsType });
  } catch (error) {
    yield put({ type: types.BROKER_TEAM_GET_ERROR, payload: error });
  }
}

export function* saveClientTeam() {
  const state = yield select();
  const changes = selectClientChanges(state);
  const clientId = selectCurrentClientId(state);
  const opsDel = {
    method: 'DELETE',
  };
  const opsAdd = {
    method: 'POST',
  };
  try {
    let url = `${BENREVO_API_PATH}/admin/clients/${clientId}/members`;
    if (changes.deletedMembers.length > 0) {
      opsDel.body = JSON.stringify(changes.deletedMembers);
      yield call(request, url, opsDel);
      yield put({ type: types.RESET_DELETED_LIST });
    }

    for (let i = 0; i < changes.addedMembers.length; i += 1) {
      if (changes.addedMembers.length) {
        url = `${BENREVO_API_PATH}/admin/clients/${clientId}/members/${changes.addedMembers[i].brokerageId}`;
        opsAdd.body = JSON.stringify([changes.addedMembers[i]]);
        yield call(request, url, opsAdd);
      }
    }
    yield put({ type: types.RESET_NEW_CONTACTS });
  } catch (err) {
    yield put({ type: types.SAVE_CLIENT_TEAM_ERROR, payload: err });
  }
}

export function* getClientTeam() {
  const state = yield select();
  const clientId = selectCurrentClientId(state);
  const ops = {
    method: 'GET',
  };
  if (clientId) {
    try {
      const url = `${BENREVO_API_PATH}/admin/clients/${clientId}/members`;
      const data = yield call(request, url, ops);
      yield put(updateClient('clientMembers', data));
    } catch (err) {
      yield put({ type: types.GET_CLIENT_TEAM_ERROR, payload: err });
    }
  }
}

export function* createBroker() {
  const state = yield select();
  const broker = selectNewBrokerFields(state);
  const producer = selectProducerValue(state);
  if (producer.name) {
    broker.values.producer = producer.name;
  }
  const ops = {
    method: 'POST',
  };
  try {
    if (broker.readyToSave) {
      const url = `${BENREVO_API_PATH}/v1/brokers/create`;
      ops.body = JSON.stringify(broker.values);
      const data = yield call(request, url, ops);
      yield put(updateClient('brokerId', data.id));
      yield put({ type: types.CREATE_BROKER_SUCCESS });
    }
  } catch (error) {
    yield put({ type: types.CREATE_BROKER_ERROR, payload: error });
  }
}

export function* createClientPlans(action) {
  const ops = {
    method: 'POST',
  };
  try {
    const client = yield select(selectClientRequest());
    const url = `${BENREVO_API_PATH}/v1/clients/${client.id}/plans/rfp?rfpIds=${action.payload.rfpIds.join(',')}`;
    const data = yield call(request, url, ops);
    yield put({ type: types.CREATE_CLIENT_PLANS_SUCCESS, payload: data });
  } catch (error) {
    yield put({ type: types.CREATE_CLIENT_PLANS_ERROR, payload: error });
  }
}

export function* createCurrentPlans(action) {
  const { section } = action.meta;
  const { plans, clientPlans, rfpId } = yield select(selectBenefitsFromSection(section));
  let selectedBenefits = null;
  if (section === types.DENTAL_SECTION) selectedBenefits = yield select(selectSelectedBenefits(section));
  try {
    const data = [];
    const url = `${BENREVO_API_PATH}/v1/plans/rfp/${rfpId}/create`;
    const ops = {
      method: 'POST',
    };
    ops.headers = new Headers();
    ops.headers.append('Content-Type', 'application/json;charset=UTF-8');
    for (let i = 0; i < clientPlans.length; i += 1) {
      const clientPlan = clientPlans[i];
      if (clientPlan.selectedCarrier.carrierId) {
        const carrier = yield select(selectCarrierById(clientPlan.selectedCarrier.carrierId, section));
        data.push(convertPlan(plans[i], carrier, clientPlan.selectedNetwork.networkId, clientPlan.name, clientPlan.id, (selectedBenefits) ? selectedBenefits[i] : true));
      }
    }
    if (data.length) {
      ops.body = JSON.stringify(data);
      yield call(request, url, ops);
    }
    yield put({ type: RFP_PLANS_SAVE_SUCCESS, payload: action.data, meta: action.meta });
  } catch (err) {
    yield put({ type: RFP_PLANS_SAVE_ERROR, payload: err, meta: { section } });
  }
}

export function convertPlan(plan, carrier = {}, networkId, name = '', id) {
  const benefits = [];
  if (plan && plan.benefits && plan.benefits.length > 0) {
    plan.benefits.forEach((item) => {
      if (!item.temp) {
        const newItem = {
          name: item.name || null,
          sysName: item.sysName || null,
          type: item.type || null,
          typeIn: item.typeIn || null,
          typeOut: item.typeOut || null,
          restriction: item.restriction || null,
        };

        if (item.type) newItem.value = item.value || null;
        else {
          newItem.valueIn = item.valueIn || (item.valueOut || item.restriction ? '-' : null);
          newItem.valueOut = item.valueOut || (item.valueIn || item.restriction ? '-' : null);
        }

        benefits.push(newItem);
      }
    });
  }
  const result = {
    benefits,
    cost: [],
    rx: [],
    nameByNetwork: plan.planName || name,
    rfpQuoteNetworkId: networkId,
    planType: plan.planType,
    optionId: id,
  };
  if (carrier.name !== 'UHC' && carrier.name !== 'AETNA' && carrier.name !== 'BLUE_SHIELD' && carrier.name !== 'HEALTHNET') {
    result.rx = plan.rx;
  } else {
    result.extRx = {
      carrier: '',
      name: plan.planName || '',
      rfpQuoteNetworkPlanId: id,
      rx: plan.rx,
    };
  }
  return result;
}

export function* downloadOptimizer() {
  const ops = {
    method: 'GET',
  };
  try {
    const client = yield select(selectClientRequest());
    const url = `${BENREVO_API_PATH}/dashboard/clients/${client.id}/optimizer/download/`;
    yield call(saveRfp);
    const data = yield call(request, url, ops, true);
    downloadFile(data, 'xlsm', 'application/vnd.ms-excel', `${client.clientName}-optimizer`);
    yield put({ type: types.DOWNLOAD_OPTIMIZER_SUCCESS, payload: data });
  } catch (error) {
    yield put({ type: types.DOWNLOAD_OPTIMIZER_ERROR, payload: error });
  }
}

export function* watchFetchData() {
  yield takeLatest(FETCH_CARRIERS, getAllCarriers);
  yield takeLatest(SEND_RFP, saveRfp);
  yield takeLatest(FETCH_RFP, getRfp);
  yield takeLatest(SEND_RFP_FILE, uploadFile);
  yield takeLatest(REMOVE_FILE, removeFile);
  yield takeLatest(REMOVE_PLAN_FILE, removeFile);
  yield takeEvery(FETCH_RFP_PDF, getPdf);
  yield takeEvery(CHECK_CENSUS_TYPE, checkCensusType);
  yield takeEvery(RFP_PLANS_SAVE, createCurrentPlans);
  yield takeEvery(CHANGE_CURRENT_CARRIER, getPlanNetworks);
  yield takeEvery(types.BROKERAGE_GET, getBrokerage);
  yield takeEvery(types.GA_GET, getGA);
  yield takeLatest(types.DOWNLOAD_OPTIMIZER, downloadOptimizer);
  yield takeEvery(types.BROKER_TEAM_GET, getBrokerTeam);
  yield takeLatest(types.SAVE_CLIENT_TEAM, saveClientTeam);
  yield takeLatest(types.CREATE_BROKER, createBroker);
  yield takeLatest(types.SAVE_CLIENT, saveClient);
  yield takeLatest(types.GET_CLIENT_TEAM, getClientTeam);
  yield takeLatest(types.CREATE_CLIENT_PLANS, createClientPlans);
}

export default [
  watchFetchData,
];
