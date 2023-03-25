import { takeEvery } from 'redux-saga/effects'
import { TYPES } from '../actions'

import loadDocuments from './loadDocuments'
import loadKinds from './loadKinds'
import loadVehiclesDocuments from './loadVehiclesDocuments'
import loadVehiclesKinds from './loadVehiclesKinds'
import loadVehicles from './loadVehicles'
import loginAsUser from './loginAsUser'
import loadUser from './loadUser'
import approveDocument from './approveDocument'
import approveVehicleDocument from './approveVehicleDocument'
import rejectDocument from './rejectDocument'
import rejectVehicleDocument from './rejectVehicleDocument'
import exitAlerts from './exitAlerts'
import sendNotification from './sendNotification'
import updateVehicleDetails from './updateVehicleDetails'
import loadNextDriver from './loadNextDriver'
import loadNotificationMsg from './loadNotificationMsg'

export default function * sagas() {
  yield takeEvery(TYPES.loadDocuments, loadDocuments)
  yield takeEvery(TYPES.loadKinds, loadKinds)
  yield takeEvery(TYPES.loadVehiclesDocuments, loadVehiclesDocuments)
  yield takeEvery(TYPES.loadVehiclesKinds, loadVehiclesKinds)
  yield takeEvery(TYPES.loadVehicles, loadVehicles)
  yield takeEvery(TYPES.loginAsUser, loginAsUser)
  yield takeEvery(TYPES.loadUser, loadUser)
  yield takeEvery(TYPES.approveDocument, approveDocument)
  yield takeEvery(TYPES.approveVehicleDocument, approveVehicleDocument)
  yield takeEvery(TYPES.rejectDocument, rejectDocument)
  yield takeEvery(TYPES.rejectVehicleDocument, rejectVehicleDocument)
  yield takeEvery(TYPES.exitAlerts, exitAlerts)
  yield takeEvery(TYPES.sendNotification, sendNotification)
  yield takeEvery(TYPES.updateVehicleDetails, updateVehicleDetails)
  yield takeEvery(TYPES.loadNextDriver, loadNextDriver)
  yield takeEvery(TYPES.loadNotificationMsg, loadNotificationMsg)
}
