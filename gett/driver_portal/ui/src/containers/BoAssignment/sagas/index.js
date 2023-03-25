import { takeEvery } from 'redux-saga/effects'
import { TYPES } from '../actions'

import loadAssignment from './loadAssignment'
import checkInAssignment from './checkInAssignment'
import identifyAssignment from './identifyAssignment'
import loadAgents from './loadAgents'
import assignUser from './assignUser'

export default function * sagas() {
  yield takeEvery(TYPES.loadAssignment, loadAssignment)
  yield takeEvery(TYPES.checkInAssignment, checkInAssignment)
  yield takeEvery(TYPES.identifyAssignment, identifyAssignment)
  yield takeEvery(TYPES.loadAgents, loadAgents)
  yield takeEvery(TYPES.assignUser, assignUser)
}
