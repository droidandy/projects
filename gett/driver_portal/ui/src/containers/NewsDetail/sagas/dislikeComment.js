import { call, put } from 'redux-saga/effects'
import api from 'api'
import { loadComments } from '../actions'
import { showStickyMessage } from 'containers/App/actions'

function * saga({ id, commentId }) {
  try {
    yield call(api().post, `/news/${id}/comments/${commentId}/likes`, { value: '-1' })
    yield put(loadComments({ id, noreload: true }))
  } catch (error) {
    const { response: { data: { errors } } } = error
    console.error('disliking comments', errors)
    yield put(showStickyMessage({
      kind: 'error',
      text: 'Disliking fail'
    }))
  }
}
export default saga
