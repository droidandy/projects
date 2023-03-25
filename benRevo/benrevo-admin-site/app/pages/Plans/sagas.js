import { call, put, takeLatest, takeEvery, select } from 'redux-saga/effects';
import { push } from 'react-router-redux';
import request from 'utils/request';
import { success, error } from 'react-notification-system-redux';
import moment from 'moment';
import _ from 'lodash';
import { BENREVO_API_PATH } from '../../config';
import * as types from './constants';
import { getPlan, changeCurrentCarrier } from './actions';
import { changeCurrentBroker, updateClient } from '../Client/actions';
import { selectClient, selectPlansFromSection, selectInfoForQuote, selectClientPlans, selectPlanDataChanges, selectTeamChanges } from './selectors';

export function* getFiles() {
  try {
    const client = yield select(selectClient());
    const url = `${BENREVO_API_PATH}/admin/files/${client.id}/`;
    const data = yield call(request, url);
    yield put({ type: types.FILES_GET_SUCCESS, payload: data, meta: {} });
  } catch (err) {
    yield put({ type: types.FILES_GET_ERROR, payload: err, meta: {} });
  }
}

export function* downloadFile(action) {
  const file = action.payload;
  try {
    const info = yield select(selectInfoForQuote());
    const url = `${file.link}&carrierName=${info.carrier.name}`;
    const data = yield call(request, url, null, true);
    const blob = new Blob([data], {
      type: file.type,
    });
    const link = document.createElement('a');
    link.setAttribute('href', window.URL.createObjectURL(blob));
    link.setAttribute('download', file.name);
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

export function* getHistory() {
  // const url = `${BENREVO_API_PATH}/admin/history`;
  const url = 'http://localhost:3001/mockapi/v1/history';
  try {
    const data = yield call(request, url);
    yield put({ type: types.HISTORY_GET_SUCCESS, payload: data, meta: {} });
  } catch (err) {
    yield put({ type: types.HISTORY_GET_ERROR, payload: err, meta: {} });
  }
}

export function* getCarrierHistory(action) {
  const section = action.meta.section;
  try {
    const client = yield select(selectClient());
    const data = yield call(request, `${BENREVO_API_PATH}/admin/client/${client.id}/rfp/${section.toUpperCase()}/carrierHistory/all/`);
    yield put({ type: types.CARRIER_HISTORY_GET_SUCCESS, payload: data, meta: action.meta });
  } catch (err) {
    yield put({ type: types.CARRIER_HISTORY_GET_ERROR, payload: err });
  }
}

export function* getNetworks(action) {
  const carrierId = action.payload.carrierId;
  const planType = action.payload.planType;
  const section = action.meta.section;
  const url = `${BENREVO_API_PATH}/admin/carrier/${carrierId}/network/${(planType === 'H.S.A') ? 'HSA' : planType}/all/`;
  try {
    const data = yield call(request, url);
    yield put({ type: types.NETWORKS_GET_SUCCESS, payload: { networks: data, carrierId, planType }, meta: { section } });
  } catch (err) {
    yield put({ type: types.NETWORKS_GET_ERROR, payload: err, meta: { } });
  }
}

export function* createSectionPlans(action) {
  const section = action.meta.section;
  const plan = action.payload.plan;
  const info = yield select(selectInfoForQuote());
  const clientPlans = yield select(selectClientPlans());
  const ids = [];

  if (plan.optionId) {
    for (let i = 0; i < clientPlans.length; i += 1) {
      if (clientPlans[i].option_id === plan.optionId) {
        ids.push(clientPlans[i].client_plan_id);
      }
    }
  } else ids.push(plan.rfpQuoteNetworkPlanId);
  try {
    const url = `${BENREVO_API_PATH}/admin/clients/plans/createPlan/?clientPlanIds=${ids.join(',')}`;
    const ops = {
      method: 'POST',
    };
    ops.headers = new Headers();
    ops.headers.append('Content-Type', 'application/json;charset=UTF-8');
    ops.body = JSON.stringify(convertPlan(plan, info.carrier));
    const data = yield call(request, url, ops, true);
    yield put({ type: types.PLAN_CREATE_SUCCESS, payload: data, meta: { section } });
  } catch (err) {
    yield put({ type: types.PLAN_CREATE_ERROR, payload: err, meta: { section } });
  }
}

export function convertPlan(plan, carrier) {
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
          value: item.value || null,
          valueIn: item.valueIn || null,
          valueOut: item.valueOut || null,
        };
        benefits.push(newItem);
      }
    });
  }
  const result = {
    benefits,
    cost: [],
    rx: [],
    nameByNetwork: plan.planName || '',
    rfpQuoteNetworkId: plan.selectedNetwork.networkId,
    rfpQuoteNetworkPlanId: plan.rfpQuoteNetworkPlanId,
  };
  if (carrier.name === 'ANTHEM_BLUE_CROSS') {
    result.rx = plan.rx;
  } else {
    result.extRx = {
      carrier: '',
      name: plan.planName || '',
      rfpQuoteNetworkPlanId: plan.rfpQuoteNetworkPlanId,
      rx: plan.rx,
    };
  }
  return result;
}

export function* createPlan(action) {
  const section = action.meta.section;
  try {
    const plans = yield select(selectPlansFromSection(section));
    /* eslint-disable no-plusplus */
    for (let i = 0; i < plans.length; i++) {
      if (plans[i].rfpQuoteNetworkPlanId && plans[i].selectedNetwork.networkId && plans[i].planName) {
        yield put({ type: types.PLAN_CREATE_START, payload: { index: i, plan: plans[i] }, meta: { section } });
      }
    }
  } catch (err) {
    yield put({ type: types.PLAN_CREATE_ERROR, payload: err, meta: { section } });
  }
}

export function* clientPlansGet(action) {
 // const section = action.meta.section;
  const clientId = action.payload;
  const url = `${BENREVO_API_PATH}/admin/clients/${clientId}/plans`;
  try {
    const data = yield call(request, url);
    yield put(getPlan(data));
    yield put({ type: types.CLIENT_PLANS_GET_SUCCESS, payload: data });
  } catch (err) {
    yield put({ type: types.CLIENT_PLANS_GET_ERROR, payload: err });
  }
}

export function* getCurrentPlans(action) {
  try {
    const clientPlans = action.payload;
    const plans = {};
    const optionIds = {};
    const networks = [];
    for (let i = 0; i < clientPlans.length; i += 1) {
      const item = clientPlans[i];

      if (!optionIds[item.option_id || item.client_plan_id]) {
        const plan = yield call(request, `${BENREVO_API_PATH}/admin/clients/plans/${item.client_plan_id}/`);
        if (plan.benefits) {
          plans[item.client_plan_id] = plan;
          if (plan.carrierId) {
            let section = 'medical';

            if (item.planType === 'DPPO' || item.planType === 'DHMO') section = 'dental';
            else if (item.planType === 'VISION') section = 'vision';
            networks.push({ section, carrierId: plan.carrierId, index: plans.length - 1, planType: item.planType });
          }
        }

        optionIds[item.option_id || item.client_plan_id] = true;
      }
    }
    yield put({ type: types.PLAN_GET_SUCCESS, payload: { plans, clientPlans } });

    for (let i = 0; i < networks.length; i += 1) {
      const item = networks[i];
      yield put(changeCurrentCarrier(item.section, item.carrierId, item.index, item.planType));
    }
  } catch (err) {
    yield put({ type: types.PLAN_GET_ERROR, payload: err });
  }
}

export function* giveAccessToClient(action) {
  const brokerId = action.payload.brokerId;
  const clientId = action.payload.clientId;
  try {
    const url = `${BENREVO_API_PATH}/admin/brokers/benrevoGa/request?brokerId=${brokerId}&clientId=${clientId}`;
    const ops = {
      method: 'POST',
    };
    ops.headers = new Headers();
    ops.headers.append('Content-Type', 'application/json;charset=UTF-8');
    const data = yield call(request, url, ops, true);
    yield put({ type: types.GIVE_ACCESS_TO_CLIENT_SUCCESS, payload: data });
    const notificationOpts = {
      message: (data && data.message) ? data.message : 'Access granted successfully',
      position: 'tc',
      autoDismiss: 5,
    };
    yield put(success(notificationOpts));
  } catch (err) {
    yield put({ type: types.GIVE_ACCESS_TO_CLIENT_ERROR, payload: err });
  }
}

export function* getClientTeam(action) {
  const clientId = action.payload;
  const gaIDs = [];
  const gaTeams = [];
  let data = [];

  const url = `${BENREVO_API_PATH}/admin/clients/${clientId}/members`;
  try {
    data = yield call(request, url);
    const brTeam = data.filter((x) => !x.generalAgent);
    const gaMembers = data.filter((x) => !!x.generalAgent);

    while (gaMembers.length && gaMembers[0].generalAgent) {
      const currId = gaMembers[0].brokerageId;
      const currGATeam = _.takeWhile(gaMembers, { brokerageId: currId });
      gaTeams.push(currGATeam);
      gaIDs.push(currGATeam[0].brokerageId);
      _.pullAllWith(gaMembers, currGATeam, _.isEqual);
    }

    const gaUrl = `${BENREVO_API_PATH}/v1/brokers/generalAgents`;
    const gaList = yield call(request, gaUrl);

    yield put({ type: types.CLIENT_TEAM_GET_SUCCESS, payload: { brTeam, gaTeams, gaList } });
  } catch (err) {
    yield put({ type: types.CLIENT_TEAM_GET_ERROR, payload: err });
  }
}

export function* saveClientTeam() {
  const changes = yield select(selectTeamChanges());
  const client = yield select(selectClient());
  const opsDel = {
    method: 'DELETE',
  };
  const opsAdd = {
    method: 'POST',
  };

  try {
    let url = `${BENREVO_API_PATH}/admin/clients/${client.id}/members`;
    if (changes.deleted.length > 0) {
      opsDel.body = JSON.stringify(changes.deleted);
      yield call(request, url, opsDel);
    }
    let added = false;

    for (let i = 0; i < changes.added.length; i += 1) {
      if (changes.added[i].length) {
        added = true;
        url = `${BENREVO_API_PATH}/admin/clients/${client.id}/members/${changes.added[i][0].brokerageId}`;
        opsAdd.body = JSON.stringify(changes.added[i]);
        yield call(request, url, opsAdd);
      }
    }

    if (added || changes.deleted.length) {
      const notificationOpts = {
        message: 'Saved Client Team Successfully',
        position: 'tc',
        autoDismiss: 5,
      };
      yield put(success(notificationOpts));
    }
    yield call(saveClient);
    yield put(push('/client/plans/accounts'));
  } catch (err) {
    yield put({ type: types.CLIENT_TEAM_SAVE_ERROR, payload: err });
  }
}

export function* createClientAccounts(action) {
  const clientId = action.payload;
  const ops = {
    method: 'POST',
  };
  const notificationOpts = {
    message: 'Client Team Accounts Created Successfully',
    position: 'tc',
    autoDismiss: 5,
  };

  try {
    const url = `${BENREVO_API_PATH}/admin/clients/${clientId}/createUsers`;
    const data = yield call(request, url, ops);
    yield put({ type: types.CLIENT_TEAM_CREATE_ACCOUNTS_SUCCESS, payload: data });
    yield put(success(notificationOpts));
  } catch (err) {
    yield put({ type: types.CLIENT_TEAM_CREATE_ACCOUNTS_ERROR, payload: err });
  }
}

export function* saveClient() {
  const ops = {
    method: 'PUT',
  };

  try {
    const client = yield select(selectClient());

    if (client.hasChangedClientData) {
      client.effectiveDate = moment(client.effectiveDate).format('MM/DD/YYYY');
      client.dueDate = (client.dueDate) ? moment(client.dueDate).format('MM/DD/YYYY') : null;
      const url = `${BENREVO_API_PATH}/admin/clients/${client.id}`;
      ops.body = JSON.stringify(client);
      yield call(request, url, ops, false, 'Saved Client Data Successfully');
    }
    yield put({ type: types.CLIENT_TEAM_SAVE_SUCCESS });
  } catch (err) {
    yield put({ type: types.CLIENT_TEAM_SAVE_ERROR, payload: err });
  }
}

export function* moveClient(action) {
  const ops = {
    method: 'POST',
  };
  const notificationOpts = {
    message: 'Client was successfully moved.',
    position: 'tc',
    autoDismiss: 5,
  };
  const fromBrokerId = action.payload.fromBrokerId;
  const toBrokerId = action.payload.toBrokerId;
  const clientId = action.payload.clientId;
  const reason = action.payload.moveReason;

  try {
    const url = `${BENREVO_API_PATH}/admin/clients/move?fromBrokerId=${fromBrokerId}&toBrokerId=${toBrokerId}&clientId=${clientId}&reason=${reason}`;
    const data = yield call(request, url, ops);
    yield put(push('/client'));
    yield put(changeCurrentBroker(action.payload.newBroker));
    yield put({ type: types.MOVE_CLIENT_SUCCESS, payload: data });
    yield put(success(notificationOpts));
  } catch (err) {
    notificationOpts.message = 'Error occurred when moving client.';
    yield put(error(notificationOpts));
    yield put({ type: types.MOVE_CLIENT_ERROR, payload: err });
  }
}

export function* changeClientStatus(action) {
  const clientId = action.payload.clientId;
  const clientState = action.payload.newStatus;
  try {
    const url = `${BENREVO_API_PATH}/admin/clients/${clientId}`;
    const ops = {
      method: 'POST',
    };
    ops.body = JSON.stringify({ clientState });
    yield call(request, url, ops, false, 'Successfully updated client state.');
    yield put(updateClient('clientState', clientState));
    yield put({ type: types.CHANGE_CLIENT_STATUS_SUCCESS });
  } catch (err) {
    yield put({ type: types.CHANGE_CLIENT_STATUS_ERROR, payload: err });
  }
}

export function* saveContribution() {
  const ops = {
    method: 'PUT',
  };
  const url = `${BENREVO_API_PATH}/admin/clients/plans/updatePlan`;
  try {
    const planDataChanges = yield select(selectPlanDataChanges());
    if (planDataChanges.length) {
      ops.body = JSON.stringify(planDataChanges);
      yield call(request, url, ops, false, 'Saved Plan Data Successfully');
    }
    yield put({ type: types.SAVE_CONTRIBUTION_SUCCESS });
  } catch (err) {
    yield put({ type: types.SAVE_CONTRIBUTION_ERROR, payload: err });
  }
}

export function* watchFetchData() {
  yield takeLatest(types.FILES_GET, getFiles);
  yield takeEvery(types.DOWNLOAD_FILE, downloadFile);
  yield takeLatest(types.PLAN_GET, getCurrentPlans);
  yield takeLatest(types.HISTORY_GET, getHistory);
  yield takeEvery(types.GET_CARRIER_HISTORY, getCarrierHistory);
  yield takeLatest(types.CLIENT_PLANS_GET, clientPlansGet);
  yield takeLatest(types.PLAN_CREATE, createPlan);
  yield takeEvery(types.PLAN_CREATE_START, createSectionPlans);
  yield takeEvery(types.CHANGE_CURRENT_CARRIER, getNetworks);
  yield takeLatest(types.GIVE_ACCESS_TO_CLIENT, giveAccessToClient);
  yield takeEvery(types.CLIENT_TEAM_SAVE, saveClientTeam);
  yield takeLatest(types.CLIENT_TEAM_GET, getClientTeam);
  yield takeLatest(types.CLIENT_TEAM_CREATE_ACCOUNTS, createClientAccounts);
  yield takeLatest(types.MOVE_CLIENT, moveClient);
  yield takeLatest(types.CHANGE_CLIENT_STATUS, changeClientStatus);
  yield takeLatest(types.SAVE_CONTRIBUTION, saveContribution);
}

// All sagas to be loaded
export default [
  watchFetchData,
];
