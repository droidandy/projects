import { call, put } from 'redux-saga/effects'
import api from 'api'
import { updateVehicleSuccess, updateVehicleFail } from '../actions'
import { showStickyMessage } from 'containers/App/actions'

function * saga({ vehicle }) {
  try {
    const { data } = yield call(api().put, `/session/vehicles/${vehicle.id}`, {
      title: vehicle.title
    })
    yield put(updateVehicleSuccess({ vehicle: data }))
    yield put(showStickyMessage({
      kind: 'success',
      text: 'Vehicle has been successfully updated'
    }))
  } catch (error) {
    const { response: { data: { errors } } } = error
    console.error('update vehicle', error)
    yield put(updateVehicleFail({ errors }))
    yield put(showStickyMessage({
      kind: 'error',
      text: 'Vehicle update failed'
    }))
  }
}

export default saga
