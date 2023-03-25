import { call, put } from 'redux-saga/effects'
import api from 'api'
import { signUpSuccess, signUpFail } from '../actions'

function * saga({ user }) {
  try {
    yield call(api().post, `/users/`, { attributes: user })
    yield put(signUpSuccess())
  } catch (error) {
    const { response: { data: { errors } } } = error
    yield put(signUpFail({ errors }))
  }
}

export default saga
