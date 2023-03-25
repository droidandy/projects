import { call, put } from 'redux-saga/effects'
import api from 'api'
import { updateVehicleDetailsSuccess, updateVehicleDetailsFail } from '../actions'
import { showStickyMessage } from 'containers/App/actions'

function * saga({ model, userId, vehicleId }) {
  try {
    yield call(api().put, `/users/${userId}/vehicles/${vehicleId}`, { model })
    yield put(updateVehicleDetailsSuccess({ vehicleId, model }))
    yield put(showStickyMessage({
      kind: 'success',
      text: 'Vehicle details has been successfully updated'
    }))
  } catch (error) {
    const { response: { data: { errors } } } = error
    console.error('update vehicle details', error)
    yield put(updateVehicleDetailsFail({ errors }))
  }
}

export default saga
