import { call, put, takeEvery, select } from 'redux-saga/effects'
import {
  postWithoutTokenRequest,
  putRequest,
  getRequest,
  putWithoutTokenRequest,
} from './api'
import { authenticateSuccess } from '../actions/sessions'
import TokenService from '../libs/TokenService'

import {
  createUserRequest,
  createUserSuccess,
  fetchUserRequest,
  fetchUserSuccess,
  updateUserRequest,
  updateUserSuccess,
  resetUserRequest,
  resetUserSuccess,
} from '../actions/user'
import {track} from "../libs/helpers";

const getUserId = (state) => state.sessions.id
const tokenService = TokenService.getService()

function createUser(requestData) {
  return postWithoutTokenRequest('/users', {
    ...requestData,
  })
}

function updateUser(requestData, userId) {
  return putRequest('/user', {
    ...requestData,
  })
}

function fetchUser(requestData, userId) {
  return getRequest('/user.json')
}

function resetUser(requestData) {
  if (requestData.code) {
    return putWithoutTokenRequest('/users/passwords', requestData)
  } else return postWithoutTokenRequest('/users/passwords', requestData)
}

function* userCreateWatcher({ payload }) {
  try {
    const user = yield call(createUser, payload[0])
    const { results, meta } = user.data.data

    if (meta) tokenService.setToken(meta)

    yield put(createUserSuccess(results))
    yield put(authenticateSuccess(results))

    payload[1](user)
  } catch (e) {
    console.log('User create error:', e);
    track("sign_up_form_error_shown");
  }
}

function* userFetchWatcher({ payload }) {
  try {
    const userId = yield select(getUserId)
    const user = yield call(fetchUser, payload, userId)
    yield put(fetchUserSuccess(user.data.data.results))
    yield put(authenticateSuccess(user.data.data.results))

    yield payload[0](user.data.data.results)
  } catch (e) {
    console.log('User fetch error:', e)
    yield payload[1]()
  }
}

function* userUpdateWatcher({ payload }) {
  try {
    const userId = yield select(getUserId)
    const user = yield call(updateUser, payload[0], userId)

    yield put(updateUserSuccess(user.data.data.results))

    if (payload[1]) yield payload[1](user.data.data.results)
  } catch (e) {
    console.log('User update error:', e)
  }
}

function* userResetWatcher({ payload }) {
  try {
    const user = yield call(resetUser, payload[0])
    const { results, meta } = user.data.data

    if (meta) tokenService.setToken(meta)

    yield put(resetUserSuccess(results))
    yield put(authenticateSuccess(results))

    if (payload[1]) yield payload[1](user.data.data.results)
  } catch (e) {
    console.log('User update error:', e)
  }
}

export default function* userWatcher() {
  yield takeEvery(fetchUserRequest, userFetchWatcher)
  yield takeEvery(createUserRequest, userCreateWatcher)
  yield takeEvery(updateUserRequest, userUpdateWatcher)
  yield takeEvery(resetUserRequest, userResetWatcher)
}
