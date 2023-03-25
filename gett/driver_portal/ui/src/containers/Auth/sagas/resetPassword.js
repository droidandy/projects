import { call, put } from 'redux-saga/effects'
import api from 'api'
import { resetPasswordSuccess, resetPasswordFail } from '../actions'

function * saga({ email }) {
  try {
    yield call(api().post, '/reset_password', { email })
    yield put(resetPasswordSuccess())
  } catch (error) {
    const { response: { data: { errors } } } = error
    yield put(resetPasswordFail({ errors }))
  }
}

export default saga
