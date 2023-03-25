import { takeEvery } from 'redux-saga/effects'
import { TYPES } from '../actions'

import loadVehicles from './loadVehicles'
import loadDocuments from './loadDocuments'

import saveDocument from './saveDocument'
import saveVehicle from './saveVehicle'
import update from './updateVehicle'
import create from './createVehicle'
import remove from './removeVehicle'

export default function * sagas() {
  yield takeEvery(TYPES.loadVehicles, loadVehicles)
  yield takeEvery(TYPES.loadDocuments, loadDocuments)
  yield takeEvery(TYPES.saveDocument, saveDocument)
  yield takeEvery(TYPES.saveVehicle, saveVehicle)
  yield takeEvery(TYPES.updateVehicle, update)
  yield takeEvery(TYPES.createVehicle, create)
  yield takeEvery(TYPES.removeVehicle, remove)
}
