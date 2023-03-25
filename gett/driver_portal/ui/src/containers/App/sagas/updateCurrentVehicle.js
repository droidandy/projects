import { call, put } from 'redux-saga/effects'
import api from 'api'
import { updateCurrentVehicleSuccess, updateCurrentVehicleFail, showSystemMessage } from '../actions'

function * saga({ vehicle }) {
  try {
    const { data: { vehicles } } = yield call(api().post, `/session/vehicles/${vehicle.id}/set_as_current`)
    yield put(updateCurrentVehicleSuccess({ vehicles }))
  } catch (error) {
    const { response: { data: { errors } } } = error
    console.error('update current vehicle', error)
    yield put(updateCurrentVehicleFail({ errors }))

    if (errors.data) {
      yield put(showSystemMessage({
        kind: 'error',
        text: errors.data
      }))
    }
  }
}

export default saga
