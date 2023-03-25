import { call, put } from 'redux-saga/effects'
import api from 'api'
import auth from 'api/auth'
import { loginSuccess } from '../actions'

function * saga({ token }) {
  try {
    const { data } = yield call(api().post, `/tokens/${token}/exchange`)
    auth.setToken(data.accessToken)
    yield put(loginSuccess())
  } catch (error) {
    window.location = '/'
  }
}

export default saga
