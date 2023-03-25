import { call, put } from 'redux-saga/effects'
import api from 'api'
import { updateSuccess } from '../actions'
import { showSystemMessage } from 'containers/App/actions'

function * saga({ driverId }) {
  try {
    const { data } = yield call(api().post, `/assignment/drivers/${driverId}/check_in`)
    yield put(updateSuccess({ data }))
  } catch (error) {
    const { response: { data: { errors } } } = error
    console.error('Assignment Check in', error)

    if (errors.data) {
      yield put(showSystemMessage({
        kind: 'error',
        text: errors.data
      }))
    }
  }
}
export default saga
