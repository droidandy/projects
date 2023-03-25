import { call, put, takeEvery } from "redux-saga/effects"
import { getRequest } from "./api"

import {
  fetchButlerRulesRequest,
  fetchButlerRulesSuccess
} from "../actions/butlerRules"

// Fetch all rules request
function fetchButlerRules(data) {
  return getRequest(`/apps/${data.appId}/butler/rules`)
}

// All rules

function * fetchButlerRulesWatcher({ payload }) {
  try {
    const rules = yield call(fetchButlerRules, payload[0])

    yield put(fetchButlerRulesSuccess(rules.data.data.results))
    yield payload[1](rules.data.data.results)
  } catch (e) {
    console.log("Fetch rules error", e)
  }
}

export default function * rulesWatcher() {
  yield takeEvery(fetchButlerRulesRequest, fetchButlerRulesWatcher)
}
