import { call, put } from 'redux-saga/effects'
import api from 'api'
import { loadVehiclesDocumentsSuccess, loadVehiclesDocumentsFail } from '../actions'
import { showSystemMessage } from 'containers/App/actions'

function * saga({ driverToApproveId, vehicleId }) {
  try {
    const { data: { documents } } = yield call(api().get, `/users/${driverToApproveId}/vehicles/${vehicleId}/documents`)
    yield put(loadVehiclesDocumentsSuccess({ documents }))
  } catch (error) {
    const { response: { data: { errors } } } = error
    console.error('load vehicles documents', error)
    yield put(loadVehiclesDocumentsFail({ errors }))

    if (errors.data) {
      yield put(showSystemMessage({
        kind: 'error',
        text: errors.data
      }))
    }
  }
}

export default saga
