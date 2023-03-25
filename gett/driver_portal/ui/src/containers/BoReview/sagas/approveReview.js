import { call, put } from 'redux-saga/effects'
import api from 'api'
import { approveReviewSuccess, approveReviewFail } from '../actions'
import { showStickyMessage, loadCurrentUser } from 'containers/App/actions'

function * saga({ userId, history }) {
  try {
    const { data: { review } } = yield call(api().post, `/users/${userId}/review/approve`)
    yield put(approveReviewSuccess({ review }))
    yield put(showStickyMessage({
      kind: 'success',
      text: 'Review has been successfully approved'
    }))
    yield put(loadCurrentUser(history, '/drivers'))
  } catch (error) {
    const { response: { data: { errors } } } = error
    console.error('approve review', error)
    yield put(approveReviewFail({ errors }))
  }
}

export default saga
