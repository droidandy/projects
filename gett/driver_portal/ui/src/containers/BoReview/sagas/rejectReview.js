import { call, put } from 'redux-saga/effects'
import api from 'api'
import { rejectReviewSuccess, rejectReviewFail } from '../actions'
import { showStickyMessage, loadCurrentUser } from 'containers/App/actions'

function * saga({ comment, userId, history }) {
  try {
    const { data: { review } } = yield call(api().post, `/users/${userId}/review/reject`, { comment })
    yield put(rejectReviewSuccess({ review }))
    yield put(showStickyMessage({
      kind: 'success',
      text: 'Review has been successfully rejected'
    }))
    yield put(loadCurrentUser(history, '/drivers'))
  } catch (error) {
    const { response: { data: { errors } } } = error
    console.error('reject review', error)
    yield put(rejectReviewFail({ errors }))
  }
}

export default saga
