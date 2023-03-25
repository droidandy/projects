import { call, put, takeEvery } from 'redux-saga/effects'
import { getRequest, putRequest } from './api'

import {
  fetchTaxIdTypeRequest,
  fetchTaxIdTypeSuccess,
} from '../actions/settings'

import {
  fetchBillingUsageStats,
  updateBilingUserSuccess,
  updateBillingUsageStats,
  updateBillingUserRequest,
  // updateBilingUserSuccess,
} from 'actions/billing'

function fetchTaxIdType() {
  return getRequest('/billing/address/new')
}

function putBillingData(payload) {
  return putRequest('/billing/address', payload)
}

export function fetchUsageStatsRequest() {
  return getRequest('/billing/usage_stat')
}

function* taxIdTypeWatcher({ payload }) {
  const taxIdType = yield call(fetchTaxIdType)
  yield put(fetchTaxIdTypeSuccess(taxIdType.data.data.results.tax_id_types))
  yield payload[0](taxIdType.data.data.results.tax_id_types)
}

function* billingUpdateWatcher({ payload }) {
  try {
    const user = yield call(putBillingData, payload[0])
    yield payload[1]()
    // yield put(updateBilingUserSuccess(user.data.data.results.billing_address))
    // if (payload[1]) yield payload[1](user.data.data.results)
  } catch (e) {
    yield payload[2]();
    console.log('Update billing error:', e)
  }
}


function* userFetchUsageStatsWatcher({ payload }) {
  try {
    const usageStats = yield call(fetchUsageStatsRequest)
    yield put(updateBillingUsageStats(usageStats.data.data.results))
  }
  catch (e) {
    console.log('User fetch usage stats error:', e)
  }
}

export default function* billingWatcher() {
  yield takeEvery(fetchTaxIdTypeRequest, taxIdTypeWatcher)
  yield takeEvery(updateBillingUserRequest, billingUpdateWatcher)
  yield takeEvery(fetchBillingUsageStats, userFetchUsageStatsWatcher)
}
