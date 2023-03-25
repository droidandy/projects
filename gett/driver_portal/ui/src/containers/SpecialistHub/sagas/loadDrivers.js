import { call, put } from 'redux-saga/effects'
import api from 'api'
import { loadDriversSuccess, loadDriversFail } from '../actions'

function * saga() {
  try {
    const { data: { drivers, channels } } = yield call(api().get, '/session/assignment/drivers')
    yield put(loadDriversSuccess({ drivers, channels }))
  } catch (error) {
    const { response: { data: { errors } } } = error
    yield put(loadDriversFail({ errors }))
  }
}

export default saga
