import { call, put } from 'redux-saga/effects'
import api from 'api'
import { loadCommentsSuccess, loadCommentsFail } from '../actions'
import { showStickyMessage } from 'containers/App/actions'

function * saga({ id }) {
  try {
    const { data } = yield call(api().get, `/news/${id}/comments`)
    yield put(loadCommentsSuccess({ comments: data }))
  } catch (error) {
    const { response: { data: { errors } } } = error
    yield put(loadCommentsFail({ errors }))
    yield put(showStickyMessage({
      kind: 'error',
      text: 'Comments load failed'
    }))
  }
}

export default saga
