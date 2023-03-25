import { call, put, takeEvery } from "redux-saga/effects"
import { getRequest, postRequest, deleteRequest, putRequest } from "./api"

import {
  fetchRuleRequest,
  fetchRuleSuccess,
  createRuleRequest,
  createRuleSuccess,
  removeRuleRequest,
  removeRuleSuccess,
  updateRuleRequest,
  updateRuleSuccess
} from "../actions/rule"

// Fetch one rule request
function fetchRule(id) {
  return getRequest(`/rules/${id}`)
}

// Create rule request
function createRule(rule) {
  return postRequest(`/apps/${rule.appId}/rules`, rule)
}

// Update rule request
function updateRule(data) {
  return putRequest(`/rules/${data.id}`, data)
}

// Destroy rule request
function removeRule(rule) {
  return deleteRequest(`/apps/${rule.appId}/rules/${rule.id}`)
}

// One rule
function * fetchRuleWatcher({ payload }) {
  try {
    const rule = yield call(fetchRule, payload[0])

    yield put(fetchRuleSuccess(rule.data.data.results))
    yield payload[1](rule.data.data.results)
  } catch (e) {
    console.log("Fetch rules error", e)
  }
}

// Update rule
function * updateRuleWatcher({ payload }) {
  try {
    const rule = yield call(updateRule, payload[0])

    yield put(updateRuleSuccess(rule.data.data.results))
    yield payload[1](rule.data.data.results)
  } catch (e) {
    payload[2]()
    console.log("Update rule error", e)
  }
}

// Remove rule
function * removeRuleWatcher({ payload }) {
  try {
    const rule = yield call(removeRule, payload[0])

    yield put(removeRuleSuccess(rule.data.data.results))
    yield payload[1]()
  } catch (e) {
    console.log("Fetch rules error", e)
  }
}

// Create rule
function * createRuleWatcher({ payload }) {
  var callback = payload[1]
  try {
    const rule = yield call(createRule, payload[0])
    yield put(createRuleSuccess(rule.data.data.results))
    yield callback(rule.data.data.results)
  } catch (e) {
    console.log("Create rule error", e)
  }
}

export default function * ruleWatcher() {
  yield takeEvery(fetchRuleRequest, fetchRuleWatcher)
  yield takeEvery(createRuleRequest, createRuleWatcher)
  yield takeEvery(removeRuleRequest, removeRuleWatcher)
  yield takeEvery(updateRuleRequest, updateRuleWatcher)
}
