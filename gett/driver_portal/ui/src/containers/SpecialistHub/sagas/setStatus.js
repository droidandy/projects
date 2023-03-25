import { call, put } from 'redux-saga/effects'
import moment from 'moment'
import api from 'api'
import { setStatusSuccess, setStatusFail, loadDriversSuccess } from '../actions'
import { loadCurrentUser } from 'containers/App/actions'

function * saga(action) {
  const { status } = action
  try {
    yield call(api().post, '/assignment/agents/change_status', { status })
    yield put(setStatusSuccess(status, moment()))
    yield put(loadCurrentUser())
    if (status === 'busy') {
      const { data: { drivers } } = yield call(api().get, '/session/assignment/drivers')
      yield put(loadDriversSuccess({ drivers }))
    }
  } catch (error) {
    const { response: errors } = error
    yield put(setStatusFail({ errors }))
  }
}

export default saga
