import { call, put, takeEvery } from "redux-saga/effects"
import {postWithoutTokenRequest, deleteRequest, getRequest} from "./api"

import {
  authenticateRequest,
  authenticateSuccess,
  logoutRequest,
  logoutSuccess
} from "../actions/sessions"
import history from "../history"
import TokenService from "../libs/TokenService"
import {updateBillingUsageStats} from "../actions/billing";

const tokenService = TokenService.getService()

function fetchAuthenticate(requestData) {
  return postWithoutTokenRequest("/sessions", {
    ...requestData
  })
}

function fetchUsageStatsRequest() {
  return getRequest('/billing/usage_stat')
}

function * authenticateRequestWatcher({ payload }) {
  try {
    const session = yield call(fetchAuthenticate, payload[0])
    const { results, meta } = session.data.data

    if (meta) tokenService.setToken(meta)

    yield put(authenticateSuccess(results))

    const usageStats = yield call(fetchUsageStatsRequest)
    yield put(updateBillingUsageStats(usageStats.data.data.results))

    yield payload[1](session.data.data.results)
  } catch (e) {
    yield payload[2](e)
    console.log("Authenticate error", e)
  }
}

function fetchLogout(requestData) {
  return deleteRequest("/sessions/logout", {
    ...requestData
  })
}

function * logoutRequestWatcher({ payload }) {
  try {
    yield call(fetchLogout)
    yield payload[0]()
  } catch (e) {
    console.log("Logout error", e)
  }
}

export default function * sessionsWatcher() {
  yield takeEvery(authenticateRequest, authenticateRequestWatcher)
  yield takeEvery(logoutRequest, logoutRequestWatcher)
}
