import { call, put } from 'redux-saga/effects'
import api from 'api'
import { addCommentSuccess, addCommentFail, loadComments } from '../actions'
import { showStickyMessage } from 'containers/App/actions'

function * saga({ id, nestedId, content }) {
  try {
    let url = `/news/${id}/comments`
    if (nestedId) url += `/${nestedId}/comments`
    const { data } = yield call(api().post, url, { content })
    yield put(addCommentSuccess({ comment: data }))
    yield put(loadComments({ id, noreload: true }))
    yield put(showStickyMessage({
      kind: 'success',
      text: 'Comment has been successfully added'
    }))
  } catch (error) {
    const { response: { data: { errors } } } = error
    console.error('add comment', error)
    yield put(addCommentFail({ errors }))
    yield put(showStickyMessage({
      kind: 'error',
      text: 'Adding comment error'
    }))
  }
}
export default saga
