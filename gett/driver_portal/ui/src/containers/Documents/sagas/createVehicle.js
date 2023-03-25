import { call, put } from 'redux-saga/effects'
import api from 'api'
import { createVehicleSuccess, createVehicleFail, loadDocuments } from '../actions'
import { showStickyMessage } from 'containers/App/actions'

function * saga({ vehicle }) {
  try {
    const { data } = yield call(api().post, `/session/vehicles`, {
      title: vehicle.title
    })
    yield put(createVehicleSuccess({ vehicle: data }))
    yield put(loadDocuments())
    yield put(showStickyMessage({
      kind: 'success',
      text: 'Vehicle has been successfully created'
    }))
  } catch (error) {
    const { response: { data: { errors } } } = error
    console.error('update vehicle', error)
    yield put(createVehicleFail({ errors }))
    yield put(showStickyMessage({
      kind: 'error',
      text: 'Vehicle create failed'
    }))
  }
}

export default saga
