import { call, put } from 'redux-saga/effects'
import api from 'api'
import { saveVehicleSuccess, saveVehicleFail, loadVehicles } from '../actions'
import { showSystemMessage } from 'containers/App/actions'

function * saga({ file, kind, id }) {
  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('kind', kind)
    const { result: data } = yield call(api().post, `/session/vehicles/${id}/documents`, formData)

    yield put(saveVehicleSuccess({ document: data }))
    yield put(loadVehicles())
  } catch (error) {
    const { response: { data: { errors } } } = error
    console.error('load documents', error)
    yield put(saveVehicleFail({ errors }))

    if (errors.data) {
      yield put(showSystemMessage({
        kind: 'error',
        text: errors.data
      }))
    }
  }
}

export default saga
