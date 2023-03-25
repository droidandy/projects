import { call, put, takeEvery } from 'redux-saga/effects'
import { getRequest } from './api'

import {
  fetchCustomersRequest,
  fetchCustomersSuccess,
} from '../actions/customers'

// Fetch all customers request
function fetchCustomers({ appId, paramsString }) {
  return getRequest(`/apps/${appId}/customers?${paramsString}`)
}

// All customers

function* fetchCustomersWatcher({ payload }) {
  try {
    const customers = yield call(fetchCustomers, payload[0])

    yield put(fetchCustomersSuccess(customers.data.data))
    yield payload[1](customers.data.data)
  } catch (e) {
    console.log('Fetch customers error', e)
  }
}

export default function* customersWatcher() {
  yield takeEvery(fetchCustomersRequest, fetchCustomersWatcher)
}
