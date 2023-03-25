import { call, put, takeEvery } from "redux-saga/effects"
import { getRequest } from "./api"

import {
  fetchProductGroupsRequest,
  fetchProductGroupsSuccess
} from "../actions/productGroups"

// Fetch all productGroups request
function fetchProductGroups(appId) {
  return getRequest(`/apps/${appId}/product_groups`)
}

// All productGroups
function * fetchProductGroupsWatcher({ payload }) {
  try {
    const productGroups = yield call(fetchProductGroups, payload[0])

    yield put(fetchProductGroupsSuccess(productGroups.data.data.results))
    yield payload[1](productGroups.data.data.results)
  } catch (e) {
    console.log("Fetch productGroups error", e)
  }
}

export default function * productGroupsWatcher() {
  yield takeEvery(fetchProductGroupsRequest, fetchProductGroupsWatcher)
}
