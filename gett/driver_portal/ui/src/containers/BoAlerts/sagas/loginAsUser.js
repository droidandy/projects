import { call, put } from 'redux-saga/effects'
import api from 'api'
import auth from 'api/auth'
import { showSystemMessage } from 'containers/App/actions'

function * saga({ driverToApproveId }) {
  try {
    const { data } = yield call(api().post, `/users/${driverToApproveId}/log_in_as`)
    localStorage.setItem('adminToken', localStorage.authToken)
    localStorage.setItem('redirect', '/bodocuments')
    auth.setToken(data.accessToken)
  } catch (error) {
    const { response: { data: { errors } } } = error
    if (errors.data) {
      yield put(showSystemMessage({
        kind: 'error',
        text: errors.data
      }))
    }
  }
}

export default saga
