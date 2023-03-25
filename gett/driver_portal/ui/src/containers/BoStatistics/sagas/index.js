import { takeEvery } from 'redux-saga/effects'
import { TYPES } from '../actions'
import * as activeUsers from './activeUsers'
import * as loginCount from './loginCount'

export default function * sagas() {
  yield takeEvery(TYPES.loadActiveUsers, activeUsers.loadActiveUsers)
  yield takeEvery(TYPES.loadLoginCount, loginCount.loadLoginCount)
}
