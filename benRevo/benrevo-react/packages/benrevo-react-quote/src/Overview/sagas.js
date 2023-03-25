import { call, put, takeLatest, takeEvery, select } from 'redux-saga/effects';
import { info } from 'react-notification-system-redux';
import { request, BENREVO_API_PATH } from '@benrevo/benrevo-react-core';
import {
  REFRESH_PRESENTATION_DATA,
  OPTION_NETWORK_GET,
  OPTION_NETWORK_GET_SUCCESS,
  OPTION_NETWORK_GET_ERROR,
  OPTION_NETWORK_ADD,
  OPTION_NETWORK_ADD_SUCCESS,
  OPTION_NETWORK_ADD_ERROR,
  OPTION_NETWORK_CHANGE,
  OPTION_NETWORK_CHANGE_SUCCESS,
  OPTION_NETWORK_CHANGE_ERROR,
  OPTION_CONTRIBUTION_GET,
  OPTION_CONTRIBUTION_GET_SUCCESS,
  OPTION_CONTRIBUTION_GET_ERROR,
  OPTION_CONTRIBUTION_SAVE,
  OPTION_CONTRIBUTION_SAVE_SUCCESS,
  OPTION_CONTRIBUTION_SAVE_ERROR,
  OPTION_RIDER_GET,
  OPTION_RIDER_GET_SUCCESS,
  OPTION_RIDER_GET_ERROR,
  CARRIER_NETWORKS_GET,
  CARRIER_NETWORKS_GET_SUCCESS,
  CARRIER_NETWORKS_GET_ERROR,
  OPTION_NETWORK_DELETE,
  OPTION_NETWORK_DELETE_SUCCESS,
  OPTION_NETWORK_DELETE_ERROR,
  OPTION,
  OPTION_COMPARE_NETWORKS_GET,
  OPTION_COMPARE_NETWORKS_GET_SUCCESS,
  OPTION_COMPARE_NETWORKS_GET_ERROR,
  OPTION_RIDER_FEE_GET,
  OPTION_RIDER_FEE_GET_SUCCESS,
  OPTION_RIDER_FEE_GET_ERROR,
  OPTION_RIDER_FEE_SAVE,
  OPTION_RIDER_FEE_SAVE_SUCCESS,
  OPTION_RIDER_FEE_SAVE_ERROR,
  OPTION_RIDER_SELECT,
  OPTION_RIDER_SELECT_SUCCESS,
  OPTION_RIDER_SELECT_ERROR,
  OPTION_RIDER_UNSELECT,
  OPTION_RIDER_UNSELECT_SUCCESS,
  OPTION_RIDER_UNSELECT_ERROR,
  UNSELECT_OPTION,
  CARRIER_RX_NETWORKS_GET,
  CARRIER_RX_NETWORKS_GET_SUCCESS,
  CARRIER_RX_NETWORKS_GET_ERROR,
} from '../constants';
import {
  selectClient,
  selectCarrier,
  selectContributions,
  selectPage,
  selectClearValueCarrier,
  selectSelectedOption,
  selectMatch,
} from '../selectors';
import {
  getMode,
} from '../utils';
import {
  dataRefreshed,
  dataRefreshError,
  refreshPresentationData,
  getNetworks,
  getCarrierNetworks,
  getContributions,
  changeLoad,
  getRider,
  getRiderFee,
  optionsUnSelect,
  getFinal,
} from '../actions';

export function* getOptionData(action) {
  const section = action.meta.section;
  const optionId = action.payload.optionId;
  const carrier = action.payload.carrier;
  const kaiser = action.payload.kaiser;
  const excludes = action.payload.excludes || {};
  const optionType = action.payload.optionType;
  const showAllNetworks = yield select(selectMatch());
  const mainCarrier = yield select(selectCarrier(section));
  const clearValueCarrier = yield select(selectClearValueCarrier(section));
  const ops = {
    method: 'GET',
  };
  let url;
  let multiMode = false;

  if (mainCarrier.carrier.carrierId) {
    multiMode = (carrier && carrier.carrier) ? carrier.carrier.carrierId !== mainCarrier.carrier.carrierId : false;

    if (multiMode && clearValueCarrier.carrier.carrierId) {
      if (carrier.carrier.carrierId === clearValueCarrier.carrier.carrierId) multiMode = false;
    }
  } else multiMode = getMode(carrier);

  if (optionId !== 'new') url = `${BENREVO_API_PATH}/v1/quotes/options/${optionId}`;
  else {
    const client = yield select(selectClient());
    let quoteType = 'STANDARD';

    url = `${BENREVO_API_PATH}/v1/quotes/options/create`;

    if (kaiser) quoteType = 'KAISER';
    if (carrier.carrier.name === 'ANTHEM_CLEAR_VALUE') quoteType = 'CLEAR_VALUE';

    ops.method = 'POST';
    ops.body = JSON.stringify({
      clientId: client.id,
      quoteType,
      optionType: optionType || OPTION,
      rfpCarrierId: carrier.rfpCarrierId,
    });
  }

  try {
    const data = yield call(request, url, ops);
    yield put(dataRefreshed(section, data, excludes));
    if (!excludes.contribution) yield put(getContributions(section, data.id));
    if (!excludes.rider) yield put(getRider(section, data.id));

    if (!excludes.carrierNetwors) {
      yield put(getNetworks(section, data.id, carrier));
      yield put(getCarrierNetworks(section, carrier, data.detailedPlans, data.id, showAllNetworks, data.quoteType === 'KAISER'));
    }

    const load = { overview: optionId === 'new' };

    if (optionId === 'new') load.options = true;

    yield put(changeLoad(section, load));
  } catch (err) {
    yield put(dataRefreshError(section, err));
  }
}

export function* getNetworksForOption(action) {
  const optionId = action.payload.optionId;
  const section = action.meta.section;
  const carrier = action.payload.carrier || { carrier: {} };
  const mainCarrier = yield select(selectCarrier(section));
  const clearValueCarrier = yield select(selectClearValueCarrier(section));
  try {
    let multiMode = false;

    if (mainCarrier.carrier.carrierId) {
      multiMode = (carrier && carrier.carrier) ? carrier.carrier.carrierId !== mainCarrier.carrier.carrierId : false;

      if (multiMode && clearValueCarrier.carrier.carrierId) {
        if (carrier.carrier.carrierId === clearValueCarrier.carrier.carrierId) multiMode = false;
      }
    } else multiMode = getMode(carrier);
    const url = multiMode ? `${BENREVO_API_PATH}/v1/carrier/${carrier.carrier.carrierId}/networks` : `${BENREVO_API_PATH}/v1/quotes/options/${optionId}/networks`;
    const data = yield call(request, url);
    yield put({ type: OPTION_NETWORK_GET_SUCCESS, payload: data, meta: { section } });
  } catch (err) {
    yield put({ type: OPTION_NETWORK_GET_ERROR, payload: err, meta: { section } });
  }
}

export function* getNetworksForCarrier(action) {
  const carrier = action.payload.carrier;
  const kaiser = action.payload.kaiser;
  const showAllNetworks = action.payload.showAllNetworks;
  const optionId = action.payload.optionId;
  const rfpCarrierId = carrier.rfpCarrierId;
  const plans = action.payload.plans;
  const section = action.meta.section;
  const mainCarrier = yield select(selectCarrier(section));
  const clearValueCarrier = yield select(selectClearValueCarrier(section));
  let getNetworksForEmpty = showAllNetworks;
  let networksForEmpty = [];
  let multiMode = false;

  if (mainCarrier.carrier.carrierId) {
    multiMode = (carrier && carrier.carrier) ? carrier.carrier.carrierId !== mainCarrier.carrier.carrierId : false;

    if (multiMode && clearValueCarrier.carrier.carrierId) {
      if (carrier.carrier.carrierId === clearValueCarrier.carrier.carrierId) multiMode = false;
    }
  } else multiMode = getMode(carrier);

  if (!multiMode) {
    for (let i = 0; i < plans.length; i += 1) {
      const item = plans[i];
      if (!item.rfpQuoteNetworkId) {
        getNetworksForEmpty = true;
        break;
      }
    }
  } else getNetworksForEmpty = false;

  if (getNetworksForEmpty) {
    try {
      networksForEmpty = yield call(request, `${BENREVO_API_PATH}/v1/quotes/options/${optionId}/networks/all`);
    } catch (err) {
      yield put({ type: CARRIER_NETWORKS_GET_ERROR, payload: err, meta: { section } });
    }
  }

  for (let i = 0; i < plans.length; i += 1) {
    const item = plans[i];
    let url;
    if (multiMode) {
      const carrierId = kaiser && item.currentPlan && item.currentPlan.carrier === 'Kaiser' ? item.currentPlan.rfpCarrierId : rfpCarrierId;
      url = `${BENREVO_API_PATH}/v1/rfpcarriers/${carrierId}/networks?networkType=${item.type}`;
      if (item.type === 'HMO' || item.type === 'PPO' || item.type === 'HSA') {
        let rxType = `RX_${item.type}`;
        if (item.type === 'HSA') {
          rxType = 'RX_PPO';
        }
        yield put({ type: CARRIER_RX_NETWORKS_GET, payload: { index: i, rfpCarrierId: carrierId, rxType }, meta: { section } });
      } else {
        // if it is not HMO, PPO, HSA - fill empty rx array there
        yield put({ type: CARRIER_RX_NETWORKS_GET_SUCCESS, payload: { index: i, data: [] }, meta: { section } });
      }
    } else if (!item.rfpQuoteNetworkId || showAllNetworks) {
      url = null;
    } else if (item.rfpQuoteNetworkId && !showAllNetworks) {
      url = `${BENREVO_API_PATH}/v1/quotes/options/${optionId}/avaliableNetworks?rfpQuoteNetworkId=${item.rfpQuoteNetworkId}`;
    }

    try {
      if (url) {
        const data = yield call(request, url);
        yield put({ type: CARRIER_NETWORKS_GET_SUCCESS, payload: { index: i, data }, meta: { section } });
      } else if (networksForEmpty && networksForEmpty.length) {
        yield put({ type: CARRIER_NETWORKS_GET_SUCCESS, payload: { index: i, data: networksForEmpty }, meta: { section } });
      }
    } catch (err) {
      yield put({ type: CARRIER_NETWORKS_GET_ERROR, payload: err, meta: { section } });
    }
  }
}

export function* getRXNetworksForCarrier(action) {
  const { rfpCarrierId, rxType, index } = action.payload;
  const { section } = action.meta;
  const url = `${BENREVO_API_PATH}/v1/rfpcarriers/${rfpCarrierId}/networks?networkType=${rxType}`;
  try {
    const data = yield call(request, url);
    yield put({ type: CARRIER_RX_NETWORKS_GET_SUCCESS, payload: { index, data }, meta: { section } });
  } catch (err) {
    yield put({ type: CARRIER_RX_NETWORKS_GET_ERROR, payload: err, meta: { section } });
  }
}

export function* getNetworksForCompare(action) {
  // const optionId = action.payload.optionId;
  const section = action.meta.section;
  const url = 'http://localhost:3000/mockapi/v1/presentation/compare/networks';

  try {
    const data = yield call(request, url);
    yield put({ type: OPTION_COMPARE_NETWORKS_GET_SUCCESS, payload: data, meta: { section } });
  } catch (err) {
    yield put({ type: OPTION_COMPARE_NETWORKS_GET_ERROR, payload: err, meta: { section } });
  }
}

export function* getContributionsForOption(action) {
  const optionId = action.payload.optionId;
  const section = action.meta.section;
  const url = `${BENREVO_API_PATH}/v1/quotes/options/contributions/?rfpQuoteOptionId=${optionId}`;
  try {
    const data = yield call(request, url);
    yield put({ type: OPTION_CONTRIBUTION_GET_SUCCESS, payload: data, meta: { section } });
  } catch (err) {
    yield put({ type: OPTION_CONTRIBUTION_GET_ERROR, payload: err, meta: { section } });
  }
}

export function* getRiderForOption(action) {
  const optionId = action.payload.optionId;
  const section = action.meta.section;
  const url = `${BENREVO_API_PATH}/v1/quotes/options/${optionId}/riders`;
  try {
    const data = yield call(request, url);
    let hsa = false;
    let carrierId = null;
    yield put({ type: OPTION_RIDER_GET_SUCCESS, payload: data, meta: { section } });

    for (let i = 0; i < data.networkRidersDtos.length; i += 1) {
      const item = data.networkRidersDtos[i];

      if (item.networkType === 'HSA') {
        hsa = true;
        carrierId = item.carrierId;
        break;
      }
    }

    if (hsa) yield put(getRiderFee(section, carrierId));
  } catch (err) {
    yield put({ type: OPTION_RIDER_GET_ERROR, payload: err, meta: { section } });
  }
}

export function* addNetwork(action) {
  const { section } = action.meta;
  const { optionId, clientPlanId, networkId, multiMode } = action.payload;
  const selectedOption = yield select(selectSelectedOption(section));
  const ops = {
    method: 'POST',
  };
  try {
    const page = yield select(selectPage(section));
    let url = `${BENREVO_API_PATH}/v1/quotes/options/${optionId}/addNetwork`;
    let body = {};
    if (multiMode) {
      body = {
        networkId,
      };
    } else {
      body = {
        rfpQuoteNetworkId: networkId,
      };
    }

    if (clientPlanId) {
      body = {
        networkId,
        clientPlanId,
      };
    }

    ops.body = JSON.stringify(body);
    if (multiMode && !clientPlanId) url = `${BENREVO_API_PATH}/v1/quotes/options/${optionId}/createEmptyNetwork`;
    const data = yield call(request, url, ops);
    yield put({ type: OPTION_NETWORK_ADD_SUCCESS, payload: data, meta: { section } });

    if (clientPlanId && optionId === selectedOption) {
      yield put(optionsUnSelect(section, optionId));
      const notificationOpts = {
        message: UNSELECT_OPTION,
        position: 'tc',
        autoDismiss: 5,
      };
      yield put(info(notificationOpts));
    }

    yield put(refreshPresentationData(section, page.carrier, optionId, false));
    yield put(changeLoad(section, { options: true, compare: true }));
    yield put(getFinal());
  } catch (err) {
    yield put({ type: OPTION_NETWORK_ADD_ERROR, payload: err, meta: { section } });
  }
}

export function* changeNetwork(action) {
  const section = action.meta.section;
  const optionId = action.payload.optionId;
  const rfpQuoteNetworkId = action.payload.rfpQuoteNetworkId;
  const isNetworkId = action.payload.isNetworkId;
  const rfpQuoteOptionNetworkId = action.payload.rfpQuoteOptionNetworkId;
  const { multiMode } = action.payload;
  const ops = {
    method: 'PUT',
  };
  try {
    const page = yield select(selectPage(section));
    const selectedOption = yield select(selectSelectedOption(section));
    const url = `${BENREVO_API_PATH}/v1/quotes/options/${optionId}/changeNetwork`;
    let body = {};
    if (!multiMode && !isNetworkId) {
      body = {
        rfpQuoteOptionNetworkId,
        rfpQuoteNetworkId,
      };
    } else if (multiMode || isNetworkId) {
      body = {
        networkId: rfpQuoteNetworkId,
        rfpQuoteOptionNetworkId,
      };
    }

    ops.body = JSON.stringify(body);

    const data = yield call(request, url, ops);
    yield put({ type: OPTION_NETWORK_CHANGE_SUCCESS, payload: data, meta: { section } });

    if (optionId === selectedOption) {
      yield put(optionsUnSelect(section, optionId));
      const notificationOpts = {
        message: UNSELECT_OPTION,
        position: 'tc',
        autoDismiss: 5,
      };
      yield put(info(notificationOpts));
    }
    yield put(refreshPresentationData(section, page.carrier, optionId, false, false, null, { carrierNetwors: true }));
    yield put(changeLoad(section, { options: true, compare: true }));
    yield put(getFinal());
  } catch (err) {
    yield put({ type: OPTION_NETWORK_CHANGE_ERROR, payload: err, meta: { section } });
  }
}

export function* deleteNetwork(action) {
  const section = action.meta.section;
  const optionId = action.payload.optionId;
  const networkId = action.payload.networkId;
  const ops = {
    method: 'DELETE',
  };
  try {
    const page = yield select(selectPage(section));
    const url = `${BENREVO_API_PATH}/v1/quotes/options/deleteNetwork`;
    const body = {
      rfpQuoteOptionNetworkId: networkId,
    };

    ops.body = JSON.stringify(body);

    const data = yield call(request, url, ops);
    yield put({ type: OPTION_NETWORK_DELETE_SUCCESS, payload: data, meta: { section } });

    yield put(refreshPresentationData(section, page.carrier, optionId, false));
    yield put(changeLoad(section, { options: true, compare: true }));
    yield put(getFinal());
  } catch (err) {
    yield put({ type: OPTION_NETWORK_DELETE_ERROR, payload: err, meta: { section } });
  }
}

export function* saveContributions(action) {
  const section = action.meta.section;
  const optionId = action.payload.optionId;
  const index = action.payload.index;
  const ops = {
    method: 'PUT',
  };
  try {
    const page = yield select(selectPage(section));
    const url = `${BENREVO_API_PATH}/v1/quotes/options/contributions`;
    const contributions = yield select(selectContributions(section, index));

    ops.body = JSON.stringify(contributions);

    const data = yield call(request, url, ops);
    yield put({ type: OPTION_CONTRIBUTION_SAVE_SUCCESS, payload: data, meta: { section } });

    yield put(refreshPresentationData(section, page.carrier, optionId, true));
    yield put(changeLoad(section, { options: true, compare: true }));
    yield put(getFinal());
  } catch (err) {
    yield put({ type: OPTION_CONTRIBUTION_SAVE_ERROR, payload: err, meta: { section } });
  }
}

export function* getRiderFeeForCarrier(action) {
  const section = action.meta.section;
  const carrierId = action.payload.carrierId;
  try {
    const url = `${BENREVO_API_PATH}/v1/carriers/${carrierId}/fees`;
    const data = yield call(request, url);
    yield put({ type: OPTION_RIDER_FEE_GET_SUCCESS, payload: data, meta: { section } });
  } catch (err) {
    yield put({ type: OPTION_RIDER_FEE_GET_ERROR, payload: err, meta: { section } });
  }
}

export function* saveRiderFee(action) {
  const section = action.meta.section;
  const administrativeFeeId = action.payload.administrativeFeeId;
  const optionId = action.payload.optionId;
  const rfpQuoteOptionNetworkId = action.payload.rfpQuoteOptionNetworkId;
  const ops = {
    method: 'PUT',
  };
  try {
    ops.body = JSON.stringify({
      administrativeFeeId,
      rfpQuoteOptionNetworkId,
    });
    const page = yield select(selectPage(section));
    const url = `${BENREVO_API_PATH}/v1/quotes/options/selectAdministrativeFee`;
    yield call(request, url, ops);
    yield put({ type: OPTION_RIDER_FEE_SAVE_SUCCESS, payload: action.payload, meta: { section } });

    yield put(refreshPresentationData(section, page.carrier, optionId, false, false, null, { rider: true, contribution: true }));
    yield put(changeLoad(section, { options: true, compare: true }));
    yield put(getFinal());
  } catch (err) {
    yield put({ type: OPTION_RIDER_FEE_SAVE_ERROR, payload: err, meta: { section } });
  }
}

export function* optionRiderSelect(action) {
  const section = action.meta.section;
  const riderId = action.payload.riderId;
  const optionId = action.payload.optionId;
  const rfpQuoteOptionNetworkId = action.payload.rfpQuoteOptionNetworkId;
  const ops = {
    method: 'POST',
  };
  try {
    const page = yield select(selectPage(section));
    const url = `${BENREVO_API_PATH}/v1/quotes/options/networks/${rfpQuoteOptionNetworkId}/riders/${riderId}/select`;
    yield call(request, url, ops);
    yield put({ type: OPTION_RIDER_SELECT_SUCCESS, payload: action.payload, meta: { section } });

    yield put(refreshPresentationData(section, page.carrier, optionId, false, false, null, { rider: true, contribution: true }));
    yield put(changeLoad(section, { options: true, compare: true }));
    yield put(getFinal());
  } catch (err) {
    yield put({ type: OPTION_RIDER_SELECT_ERROR, payload: err, meta: { section } });
  }
}

export function* optionRiderUnSelect(action) {
  const section = action.meta.section;
  const riderId = action.payload.riderId;
  const optionId = action.payload.optionId;
  const rfpQuoteOptionNetworkId = action.payload.rfpQuoteOptionNetworkId;
  const ops = {
    method: 'POST',
  };
  try {
    const page = yield select(selectPage(section));
    const url = `${BENREVO_API_PATH}/v1/quotes/options/networks/${rfpQuoteOptionNetworkId}/riders/${riderId}/unselect`;
    yield call(request, url, ops);
    yield put({ type: OPTION_RIDER_UNSELECT_SUCCESS, payload: action.payload, meta: { section } });

    yield put(refreshPresentationData(section, page.carrier, optionId, false, false, null, { rider: true, contribution: true }));
    yield put(changeLoad(section, { options: true, compare: true }));
    yield put(getFinal());
  } catch (err) {
    yield put({ type: OPTION_RIDER_UNSELECT_ERROR, payload: err, meta: { section } });
  }
}

export function* watchFetchData() {
  yield takeLatest(REFRESH_PRESENTATION_DATA, getOptionData);
  yield takeLatest(OPTION_NETWORK_GET, getNetworksForOption);
  yield takeLatest(CARRIER_NETWORKS_GET, getNetworksForCarrier);
  yield takeEvery(CARRIER_RX_NETWORKS_GET, getRXNetworksForCarrier);
  yield takeLatest(OPTION_NETWORK_ADD, addNetwork);
  yield takeLatest(OPTION_NETWORK_CHANGE, changeNetwork);
  yield takeLatest(OPTION_NETWORK_DELETE, deleteNetwork);
  yield takeLatest(OPTION_CONTRIBUTION_GET, getContributionsForOption);
  yield takeLatest(OPTION_RIDER_GET, getRiderForOption);
  yield takeEvery(OPTION_CONTRIBUTION_SAVE, saveContributions);
  yield takeEvery(OPTION_COMPARE_NETWORKS_GET, getNetworksForCompare);
  yield takeEvery(OPTION_RIDER_FEE_GET, getRiderFeeForCarrier);
  yield takeEvery(OPTION_RIDER_FEE_SAVE, saveRiderFee);
  yield takeEvery(OPTION_RIDER_SELECT, optionRiderSelect);
  yield takeEvery(OPTION_RIDER_UNSELECT, optionRiderUnSelect);
}

// All sagas to be loaded
export default [
  watchFetchData,
];
