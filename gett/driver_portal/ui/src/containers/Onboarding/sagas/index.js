import { takeEvery } from 'redux-saga/effects'
import { TYPES } from '../actions'

import loadInvite from './loadInvite'
import updateInvite from './updateInvite'

export default function * sagas() {
  yield takeEvery(TYPES.loadInvite, loadInvite)
  yield takeEvery(TYPES.updateInvite, updateInvite)
}
