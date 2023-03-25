import { call, put, takeEvery } from "redux-saga/effects"
import { getRequest } from "./api"

import {
  fetchApphooksRequest,
  fetchApphooksSuccess
} from "../actions/apphooks"

// Fetch all apphooks request

function fetchApphooks(data) {
  return getRequest(`/apps/${data.appId}/app_hooks`)
}

// All apphooks

function * fetchApphooksWatcher({ payload }) {
  try {
    const apphooks = yield call(fetchApphooks, payload[0])

    yield put(fetchApphooksSuccess(apphooks.data.data.results))
    yield payload[1](apphooks.data.data.results)
  } catch (e) {
    console.log("Fetch apphooks error", e)
  }
}

export default function * apphooksWatcher() {
  yield takeEvery(fetchApphooksRequest, fetchApphooksWatcher)
}
