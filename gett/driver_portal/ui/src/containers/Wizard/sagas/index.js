import { takeEvery } from 'redux-saga/effects'
import { TYPES } from '../actions'

import save from './save'

export default function * sagas() {
  yield takeEvery(TYPES.save, save)
}
