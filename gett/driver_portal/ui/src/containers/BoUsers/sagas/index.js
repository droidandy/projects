import { takeEvery } from 'redux-saga/effects'
import { TYPES } from '../actions'

import loadUsers from './loadUsers'

import activateUser from './activateUser'

import deactivateUser from './deactivateUser'

import inviteUser from './inviteUser'

import update from './update'

import create from './create'

export default function * sagas() {
  yield takeEvery(TYPES.loadUsers, loadUsers)
  yield takeEvery(TYPES.activateUser, activateUser)
  yield takeEvery(TYPES.deactivateUser, deactivateUser)
  yield takeEvery(TYPES.inviteUser, inviteUser)
  yield takeEvery(TYPES.updateUser, update)
  yield takeEvery(TYPES.createUser, create)
}
