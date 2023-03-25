import { call, put } from 'redux-saga/effects'
import api from 'api'
import { loadKindsSuccess, loadKindsFail } from '../actions'
import { showSystemMessage } from 'containers/App/actions'

function * saga({ driverToApproveId }) {
  try {
    const { data: { kinds } } = yield call(api().get, `/users/${driverToApproveId}/documents/kinds`)
    yield put(loadKindsSuccess({ kinds }))
  } catch (error) {
    const { response: { data: { errors } } } = error
    console.error('load kinds', error)
    yield put(loadKindsFail({ errors }))

    if (errors.data) {
      yield put(showSystemMessage({
        kind: 'error',
        text: errors.data
      }))
    }
  }
}

export default saga
