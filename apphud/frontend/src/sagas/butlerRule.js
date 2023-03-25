import { call, put, takeEvery } from "redux-saga/effects"
import { getRequest } from "./api"

import {
  fetchButlerRuleRequest,
  fetchButlerRuleSuccess
} from "../actions/butlerRule"

// Fetch one rule request
function fetchRule(id) {
  return getRequest(`/butler/rules/${id}`)
}

// One rule
function * fetchRuleWatcher({ payload }) {
  try {
    const rule = yield call(fetchRule, payload[0])

    yield put(fetchButlerRuleSuccess(rule.data.data))
    yield payload[1](rule.data.data)
  } catch (e) {
    console.log("Fetch rules error", e)
  }
}

export default function * ruleWatcher() {
  yield takeEvery(fetchButlerRuleRequest, fetchRuleWatcher)
}
