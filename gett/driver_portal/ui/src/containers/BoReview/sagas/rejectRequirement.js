import { call, put } from 'redux-saga/effects'
import api from 'api'
import { rejectRequirementSuccess, rejectRequirementFail, loadHistory } from '../actions'
import { showStickyMessage } from 'containers/App/actions'

function * saga({ comment, userId, requirementType }) {
  try {
    const { data: { review } } = yield call(api().post, `/users/${userId}/review/${requirementType}/reject`, { comment })
    yield put(rejectRequirementSuccess({ review }))
    yield put(loadHistory({ userId }))
    yield put(showStickyMessage({
      kind: 'success',
      text: 'Requirement has been successfully rejected'
    }))
  } catch (error) {
    const { response: { data: { errors } } } = error
    console.error('reject requirement', error)
    yield put(rejectRequirementFail({ errors }))
  }
}

export default saga
