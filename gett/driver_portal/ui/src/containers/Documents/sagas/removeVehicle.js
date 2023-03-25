import { call, put } from 'redux-saga/effects'
import api from 'api'
import { removeVehicleSuccess, removeVehicleFail, loadDocuments } from '../actions'
import { showStickyMessage } from 'containers/App/actions'

function * saga({ vehicle }) {
  try {
    yield call(api().delete, `/session/vehicles/${vehicle.id}`)
    yield put(removeVehicleSuccess({ vehicle }))
    yield put(loadDocuments())
    yield put(showStickyMessage({
      kind: 'success',
      text: 'Vehicle has been successfully removed'
    }))
  } catch (error) {
    const { response: { data: { errors } } } = error
    console.error('update vehicle', error)
    yield put(removeVehicleFail({ errors }))
    yield put(showStickyMessage({
      kind: 'error',
      text: 'Vehicle remove failed'
    }))
  }
}

export default saga
