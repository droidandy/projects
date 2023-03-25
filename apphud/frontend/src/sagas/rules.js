import { call, put, takeEvery } from "redux-saga/effects"
import { getRequest } from "./api"

import { fetchRulesRequest, fetchRulesSuccess } from "../actions/rules"

// Fetch all rules request
function fetchRules(data) {
  return getRequest(`/apps/${data.appId}/rules`)
}

// All rules

function * fetchRulesWatcher({ payload }) {
  try {
    const rules = yield call(fetchRules, payload[0])

    yield put(fetchRulesSuccess(rules.data.data.results))
    yield payload[1](rules.data.data.results)
  } catch (e) {
    console.log("Fetch rules error", e)
  }
}

export default function * rulesWatcher() {
  yield takeEvery(fetchRulesRequest, fetchRulesWatcher)
}
