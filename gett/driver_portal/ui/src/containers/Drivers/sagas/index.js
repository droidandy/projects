import { takeEvery } from 'redux-saga/effects'
import { TYPES } from '../actions'

import loadUsers from './loadUsers'
import synchronizeUsers from './synchronizeUsers'

import activateUser from './activateUser'
import activateUsers from './activateUsers'

import deactivateUser from './deactivateUser'
import deactivateUsers from './deactivateUsers'

import inviteUser from './inviteUser'
import inviteUsers from './inviteUsers'

import loginAsUser from './loginAsUser'
import showComplianceView from './showComplianceView'
import unclaimUser from './unclaimUser'
import startReview from './startReview'

export default function * sagas() {
  yield takeEvery(TYPES.loadUsers, loadUsers)
  yield takeEvery(TYPES.synchronizeUsers, synchronizeUsers)

  yield takeEvery(TYPES.activateUser, activateUser)
  yield takeEvery(TYPES.activateUsers, activateUsers)

  yield takeEvery(TYPES.deactivateUser, deactivateUser)
  yield takeEvery(TYPES.deactivateUsers, deactivateUsers)

  yield takeEvery(TYPES.inviteUser, inviteUser)
  yield takeEvery(TYPES.inviteUsers, inviteUsers)

  yield takeEvery(TYPES.loginAsUser, loginAsUser)
  yield takeEvery(TYPES.showComplianceView, showComplianceView)
  yield takeEvery(TYPES.unclaimUser, unclaimUser)
  yield takeEvery(TYPES.startReview, startReview)
}
