import { call, put } from 'redux-saga/effects'
import api from 'api'
import auth from 'api/auth'
import { loginSuccess, loginFail } from '../actions'

function * saga({ email, password }) {
  const session = {
    email,
    password
  }

  try {
    const { data } = yield call(api().post, '/session', { session })
    auth.setToken(data.accessToken)
    yield put(loginSuccess())
  } catch (error) {
    const { response: { data: { errors } } } = error
    yield put(loginFail({ errors }))
  }
}

export default saga
