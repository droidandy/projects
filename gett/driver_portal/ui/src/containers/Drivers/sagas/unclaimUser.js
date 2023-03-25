import { call, put } from 'redux-saga/effects'
import api from 'api'
import { showSystemMessage, showStickyMessage, loadCurrentUser } from 'containers/App/actions'

function * saga({ user }) {
  try {
    yield call(api().post, `/users/${user.id}/approval/drop`)
    yield put(showStickyMessage({
      kind: 'success',
      text: 'Driver has been successfully unclaimed'
    }))
    yield put(loadCurrentUser())
  } catch (error) {
    const { response: { data: { errors } } } = error
    console.error('exit alerts', error)
    if (errors.data) {
      yield put(showSystemMessage({
        kind: 'error',
        text: errors.data
      }))
    }
  }
}

export default saga
