import { call, put } from 'redux-saga/effects'
import api from 'api'
import { loadStatsSuccess, loadStatsFail } from '../actions'
import { showSystemMessage } from 'containers/App/actions'

function * saga({ userId }) {
  try {
    const { data } = yield call(api().get, `/users/${userId}/review/stats`)
    yield put(loadStatsSuccess({ data }))
  } catch (error) {
    const { response: { data: { errors } } } = error
    console.error('load user', error)
    yield put(loadStatsFail({ errors }))

    if (errors.data) {
      yield put(showSystemMessage({
        kind: 'error',
        text: errors.data
      }))
    }
  }
}

export default saga
