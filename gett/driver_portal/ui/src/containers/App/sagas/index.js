import { takeEvery } from 'redux-saga/effects'
import { TYPES } from '../actions'
import loadCurrentUser from './loadCurrentUser'
import updateCurrentVehicle from './updateCurrentVehicle'
import logout from './logout'

export default function * sagas() {
  yield takeEvery(TYPES.loadCurrentUser, loadCurrentUser)
  yield takeEvery(TYPES.updateCurrentVehicle, updateCurrentVehicle)
  yield takeEvery(TYPES.logout, logout)
}
