import { call, put } from 'redux-saga/effects'
import api from 'api'
import { loadVehiclesSuccess, loadVehiclesFail } from '../actions'
import { showSystemMessage } from 'containers/App/actions'

function * saga({ driverToApproveId }) {
  try {
    const { data: { vehicles } } = yield call(api().get, `/users/${driverToApproveId}/vehicles`)
    yield put(loadVehiclesSuccess({ vehicles }))
  } catch (error) {
    const { response: { data: { errors } } } = error
    console.error('load vehicles', error)
    yield put(loadVehiclesFail({ errors }))

    if (errors.data) {
      yield put(showSystemMessage({
        kind: 'error',
        text: errors.data
      }))
    }
  }
}

export default saga
