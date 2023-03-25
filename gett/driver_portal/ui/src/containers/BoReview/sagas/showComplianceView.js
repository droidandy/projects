import { call, put } from 'redux-saga/effects'
import api from 'api'
import { showSystemMessage, loadCurrentUser } from 'containers/App/actions'

function * saga({ userId, history }) {
  try {
    yield call(api().post, `/users/${userId}/approval/pick`)
    yield put(loadCurrentUser())
    yield call(history.push, '/bodocuments')
  } catch (error) {
    const { response: { data: { errors } } } = error
    if (errors.user) {
      yield put(showSystemMessage({
        kind: 'error',
        text: errors.user
      }))
    }
    if (errors.base) {
      yield put(showSystemMessage({
        kind: 'error',
        text: errors.base
      }))
    }
  }
}

export default saga
