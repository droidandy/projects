import { call, put } from 'redux-saga/effects'
import api from 'api'
import { loadUserSuccess, loadUserFail } from '../actions'
import { showSystemMessage } from 'containers/App/actions'

function * saga({ userId }) {
  try {
    const { data } = yield call(api().get, `/users/${userId}`)
    yield put(loadUserSuccess({ user: data }))
  } catch (error) {
    const { response: { data: { errors } } } = error
    console.error('load user', error)
    yield put(loadUserFail({ errors }))

    if (errors.data) {
      yield put(showSystemMessage({
        kind: 'error',
        text: errors.data
      }))
    }
  }
}

export default saga
