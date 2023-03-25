import { call, put, takeLatest, select, takeEvery } from 'redux-saga/effects';
import * as types from './constants';
import { selectBrokerVolume, selectFilters, selectMarketProduct, selectVolumeProduct, selectIncumbentProduct } from './selectors';
import { BENREVO_API_PATH } from '../../config';
import request from '../../utils/request';
import { generateQueryFilter } from '../../utils/query';
import * as actions from './actions';

export function* getBrokerVolume(action) {
  let product = action.payload;
  const ops = {
    method: 'GET',
  };
  try {
    if (!product) product = yield select(selectVolumeProduct);
    const clientState = yield select(selectBrokerVolume);
    let states = '';

    if (clientState === types.SOLD) states = `${types.ON_BOARDING_STATE},${types.SOLD_STATE}`;
    else if (clientState === types.SOLD) states = `${types.QUOTED_STATE},${types.PENDING_APPROVAL_STATE}`;
    else if (clientState === types.CLOSED) states = `${types.CLOSED_STATE}`;
    else if (clientState === types.ALL_GROUPS) states = `${types.QUOTED_STATE},${types.PENDING_APPROVAL_STATE},${types.ON_BOARDING_STATE},${types.SOLD_STATE},${types.CLOSED}`;

    const url = `${BENREVO_API_PATH}/dashboard/manager/brokerVolume?product=${product}&clientState=${states}`;
    const data = yield call(request, url, ops);

    yield put({ type: types.BROKER_VOLUME_GET_SUCCESS, payload: data });
  } catch (error) {
    yield put({ type: types.BROKER_VOLUME_GET_ERROR, payload: error });
  }
}

export function* getMarketPositions(action) {
  let product = action.payload;
  const ops = {
    method: 'GET',
  };
  try {
    if (!product) product = yield select(selectMarketProduct);
    const url = `${BENREVO_API_PATH}/dashboard/manager/relativeMarketPosition/?product=${product}`;
    const data = yield call(request, url, ops);

    yield put({ type: types.MARKET_POSITIONS_GET_SUCCESS, payload: data });
  } catch (error) {
    yield put({ type: types.MARKET_POSITIONS_GET_ERROR, payload: error });
  }
}

export function* getQuoteDifference(action) {
  let product = action.payload;
  const ops = {
    method: 'GET',
  };
  try {
    if (!product) product = yield select(selectIncumbentProduct);
    const url = `${BENREVO_API_PATH}/dashboard/manager/quoteDifference/?product=${product}`;
    const data = yield call(request, url, ops);

    yield put({ type: types.QUOTE_DIFFERENCE_GET_SUCCESS, payload: data });
  } catch (error) {
    yield put({ type: types.QUOTE_DIFFERENCE_GET_ERROR, payload: error });
  }
}

export function* getClients() {
  const ops = {
    method: 'GET',
  };
  try {
    const filters = yield select(selectFilters);
    const url = `${BENREVO_API_PATH}/dashboard/clients/search${generateQueryFilter(filters)}`;
    const data = yield call(request, url, ops);

    yield put({ type: types.CLIENTS_GET_SUCCESS, payload: data });
  } catch (error) {
    yield put({ type: types.CLIENTS_GET_ERROR, payload: error });
  }
}

export function* getFilters(action) {
  let product = action.payload.product;
  const ops = {
    method: 'GET',
  };
  try {
    if (!product) {
      const filters = yield select(selectFilters);
      product = filters.product;
    }
    const url = `${BENREVO_API_PATH}/dashboard/clients/search/filters?product=${product}`;
    const data = yield call(request, url, ops);

    yield put({ type: types.FILTERS_GET_SUCCESS, payload: data });
  } catch (error) {
    yield put({ type: types.FILTERS_GET_ERROR, payload: error });
  }
}

export function* getProbabilityStats(action) {
  const ops = {
    method: 'GET',
  };
  const url = `${BENREVO_API_PATH}/dashboard/clients/countByProbability?product=${action.payload}`;
  try {
    const data = yield call(request, url, ops);
    yield put({ type: types.GET_PROBABILITY_STATS_SUCCESS, payload: data });
  } catch (error) {
    yield put({ type: types.GET_PROBABILITY_STATS_ERROR, payload: error });
  }
}

export function* getClientsAtRisk(action) {
  const ops = {
    method: 'GET',
  };
  try {
    const url = `${BENREVO_API_PATH}/dashboard/clients/${action.payload}/atRisk`;
    const data = yield call(request, url, ops);

    yield put({ type: types.GET_CLIENTS_AT_RISK_SUCCESS, payload: data });
  } catch (error) {
    yield put({ type: types.GET_CLIENTS_AT_RISK_ERROR, payload: error });
  }
}

export function* getUpcomingRenewalClients(action) {
  const ops = {
    method: 'GET',
  };
  try {
    const url = `${BENREVO_API_PATH}/dashboard/clients/${action.payload}/upcoming`;
    const data = yield call(request, url, ops);

    yield put({ type: types.GET_UPCOMING_RENEWAL_SUCCESS, payload: data });
  } catch (error) {
    yield put({ type: types.GET_UPCOMING_RENEWAL_ERROR, payload: error });
  }
}

export function* getDiscountStats(action) {
  const url = `${BENREVO_API_PATH}/dashboard/clients/discountData/?quarterYear=${action.payload.replace(' ', '+')}`;
  const ops = {
    method: 'GET',
  };
  try {
    const data = yield call(request, url, ops);
    yield put({ type: types.GET_DISCOUNT_STATS_SUCCESS, payload: data });
  } catch (error) {
    yield put({ type: types.GET_DISCOUNT_STATS_ERROR, payload: error });
  }
}

export function* getFunnelData(action) {
  const ops = {
    method: 'GET',
  };
  try {
    const url = `${BENREVO_API_PATH}//dashboard/clients/countByState/?product=${action.payload}`;
    const data = yield call(request, url, ops);
    yield put({ type: types.GET_FUNNEL_DATA_SUCCESS, payload: data });
  } catch (error) {
    yield put({ type: types.GET_FUNNEL_DATA_ERROR, payload: error });
  }
}

export function* getTopClients() {
  const ops = {
    method: 'GET',
  };
  const url = `${BENREVO_API_PATH}/dashboard/clients/topClients`;
  try {
    const data = yield call(request, url, ops);
    yield put({ type: types.TOP_CLIENTS_GET_SUCCESS, payload: data });
  } catch (error) {
    yield put({ type: types.TOP_CLIENTS_GET_ERROR, payload: error });
  }
}

export function* toggleTopClient(action) {
  const ops = {
    method: 'POST',
  };
  try {
    ops.body = JSON.stringify([{ attributeName: 'TOP_CLIENT', value: null }]);
    let url = '';
    if (action.payload.check) {
      url = `${BENREVO_API_PATH}/v1/clients/${action.payload.client.clientId}/saveAttributes`;
    } else {
      url = `${BENREVO_API_PATH}/v1/clients/${action.payload.client.clientId}/removeAttributes`;
    }
    yield call(request, url, ops);
    yield put(actions.getTopClients());
    yield put({ type: types.TOGGLE_TOP_CLIENT_SUCCESS, payload: { client: action.payload.client } });
  } catch (error) {
    yield put({ type: types.TOGGLE_TOP_CLIENT_ERROR, payload: { client: action.payload.client, error } });
  }
}

export function* watchFetchData() {
  yield takeLatest(types.CLIENTS_GET, getClients);
  yield takeLatest(types.FILTERS_GET, getFilters);
  yield takeLatest(types.BROKER_VOLUME_GET, getBrokerVolume);
  yield takeLatest(types.CHANGE_VOLUME_PRODUCT, getBrokerVolume);
  yield takeLatest(types.MARKET_POSITIONS_GET, getMarketPositions);
  yield takeLatest(types.CHANGE_MARKET_PRODUCT, getMarketPositions);
  yield takeLatest(types.QUOTE_DIFFERENCE_GET, getQuoteDifference);
  yield takeLatest(types.CHANGE_INCUMBENT_PRODUCT, getQuoteDifference);
  yield takeLatest(types.GET_CLIENTS_AT_RISK, getClientsAtRisk);
  yield takeLatest(types.GET_UPCOMING_RENEWAL, getUpcomingRenewalClients);
  yield takeLatest(types.CHANGE_QUARTER_YEAR, getDiscountStats);
  yield takeLatest(types.GET_PROBABILITY_STATS, getProbabilityStats);
  yield takeLatest(types.GET_FUNNEL_DATA, getFunnelData);
  yield takeLatest(types.TOP_CLIENTS_GET, getTopClients);
  yield takeEvery(types.TOGGLE_TOP_CLIENT, toggleTopClient);
}

export default [
  watchFetchData,
];
