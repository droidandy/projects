import { call, put, takeEvery } from "redux-saga/effects"
import { getRequest } from "./api"

import {
  fetchCustomerRequest,
  fetchCustomerSuccess
} from "../actions/customer"

// Fetch customer request
function fetchCustomer({ id, sandbox }) {
  return getRequest(`/apps/customers/${id}?sandbox=${sandbox}`)
}

// customer

function * fetchCustomerWatcher({ payload }) {
  try {
    const customer = yield call(fetchCustomer, payload[0])

    yield put(fetchCustomerSuccess(customer.data.data.results))
    yield payload[1](customer.data.data.results)
  } catch (e) {
    console.log("Fetch customer error", e)
  }
}

export default function * customerWatcher() {
  yield takeEvery(fetchCustomerRequest, fetchCustomerWatcher)
}
