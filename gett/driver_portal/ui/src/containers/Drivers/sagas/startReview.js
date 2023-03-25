import { call, put } from 'redux-saga/effects'
import api from 'api'
import { showSystemMessage, loadCurrentUser } from 'containers/App/actions'

function * saga({ user, history }) {
  try {
    yield call(api().post, `/users/${user.id}/review/start`)
    yield put(loadCurrentUser(history, 'boreview'))
  } catch (error) {
    const { response: { data: { errors } } } = error
    console.error('start review', error)
    if (errors.data) {
      yield put(showSystemMessage({
        kind: 'error',
        text: errors.data
      }))
    }
  }
}

export default saga
