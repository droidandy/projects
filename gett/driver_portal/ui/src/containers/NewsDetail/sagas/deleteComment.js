import { call, put } from 'redux-saga/effects'
import api from 'api'
import { loadComments } from '../actions'
import { showStickyMessage } from 'containers/App/actions'

function * saga({ id, commentId }) {
  try {
    yield call(api().delete, `/news/${id}/comments/${commentId}/likes`)
    yield put(loadComments({ id, noreload: true }))
  } catch (error) {
    const { response: { data: { errors } } } = error
    console.error('deleting comments', errors)
    yield put(showStickyMessage({
      kind: 'error',
      text: 'Deleting like error'
    }))
  }
}
export default saga
