import { call, put } from 'redux-saga/effects'
import api from 'api'
import { showSystemMessage, loadCurrentUser } from 'containers/App/actions'

function * saga({ driverToApproveId, history }) {
  try {
    yield call(api().post, `/users/${driverToApproveId}/approval/drop`)
    yield put(loadCurrentUser(history, 'boalerts'))
  } catch (error) {
    const { response: { data: { errors } } } = error
    console.error('exit alerts', error)
    if (errors.data) {
      yield put(showSystemMessage({
        kind: 'error',
        text: errors.data
      }))
    }
  }
}

export default saga
