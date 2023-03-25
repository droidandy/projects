import { call, put } from 'redux-saga/effects'
import api from 'api'
import { showSystemMessage, loadCurrentUser } from 'containers/App/actions'

function * saga({ user, history }) {
  try {
    yield call(api().post, `/users/${user.id}/approval/pick`)
    yield put(loadCurrentUser(history, 'bodocuments'))
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
