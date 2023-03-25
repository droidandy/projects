import { call, put } from 'redux-saga/effects'
import api from 'api'
import { loadHistorySuccess, loadHistoryFail } from '../actions'
import { showSystemMessage } from 'containers/App/actions'

function * saga({ userId }) {
  try {
    const { data: { reviews } } = yield call(api().get, `/users/${userId}/review/history`)
    yield put(loadHistorySuccess({ data: reviews }))
  } catch (error) {
    const { response: { data: { errors } } } = error
    console.error('load user', error)
    yield put(loadHistoryFail({ errors }))

    if (errors.data) {
      yield put(showSystemMessage({
        kind: 'error',
        text: errors.data
      }))
    }
  }
}

export default saga
