import { takeEvery } from 'redux-saga/effects'
import { TYPES } from '../actions'

import signUp from './signUp'

export default function * sagas() {
  yield takeEvery(TYPES.signUp, signUp)
}
