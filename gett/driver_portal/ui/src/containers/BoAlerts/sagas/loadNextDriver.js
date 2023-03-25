import { call, put } from 'redux-saga/effects'
import api from 'api'
import { showSystemMessage, loadCurrentUser } from 'containers/App/actions'

function * saga({ history }) {
  try {
    yield call(api().post, `/users/approval/start`)
    history.push('/bodocuments')
    yield put(loadCurrentUser())
  } catch (error) {
    const { response: { data: { errors } } } = error
    history.push('/boalerts')
    console.error('load next driver', error)
    if (errors.base) {
      yield put(showSystemMessage({
        kind: 'error',
        text: errors.base
      }))
    }
  }
}

export default saga
