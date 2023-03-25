import { takeEvery } from 'redux-saga/effects'
import { TYPES } from '../actions'

import loadDrivers from './loadDrivers'
import setStatus from './setStatus'

export default function * sagas() {
  yield takeEvery(TYPES.loadDrivers, loadDrivers)
  yield takeEvery(TYPES.setStatus, setStatus)
}
