import { call, put } from 'redux-saga/effects'
import api from 'api'
import { loadVehiclesKindsSuccess, loadVehiclesKindsFail } from '../actions'
import { showSystemMessage } from 'containers/App/actions'

function * saga({ driverToApproveId, vehicleId }) {
  try {
    const { data: { kinds } } = yield call(api().get, `/users/${driverToApproveId}/vehicles/${vehicleId}/documents/kinds`)
    yield put(loadVehiclesKindsSuccess({ kinds }))
  } catch (error) {
    const { response: { data: { errors } } } = error
    console.error('load documents', error)
    yield put(loadVehiclesKindsFail({ errors }))

    if (errors.data) {
      yield put(showSystemMessage({
        kind: 'error',
        text: errors.data
      }))
    }
  }
}

export default saga
