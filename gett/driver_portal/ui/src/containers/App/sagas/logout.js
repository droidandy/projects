import auth from 'api/auth'
import api from 'api'
import { put, call } from 'redux-saga/effects'
import { hasRoles } from 'components/hocs/authorize'

import { loadCurrentUserFail } from '../actions'

function * saga({ currentUser }) {
  if (hasRoles(currentUser, 'onboarding_agent')) {
    yield call(api().post, '/assignment/agents/change_status', { status: 'offline' })
  }
  auth.removeToken()
  yield put(loadCurrentUserFail())
}

export default saga
