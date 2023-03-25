import { takeEvery } from 'redux-saga/effects'
import { TYPES } from '../actions'
import auth from './auth'
import login from './login'
import resetPassword from './resetPassword'
import setupPassword from './setupPassword'

export default function * sagas() {
  yield takeEvery(TYPES.login, login)
  yield takeEvery(TYPES.auth, auth)
  yield takeEvery(TYPES.resetPassword, resetPassword)
  yield takeEvery(TYPES.setupPassword, setupPassword)
}
